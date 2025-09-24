import { Observable, from, throwError, of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  tap,
  retry,
  timeout,
  shareReplay,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import { API_BASE } from './api';
import { AuthUserService } from '../core/services/user/auth/AuthUserService';
import { songsService } from './songs';

const authService = new AuthUserService();

export interface UploadProgress {
  progress: number;
  stage: 'uploading' | 'creating' | 'completed' | 'error';
  message?: string;
}

/**
 * Versión mejorada del servicio de upload con RxJS
 * Incluye retry automático, timeout, y mejor manejo de errores
 */
export class EnhancedUploadService {
  private static readonly UPLOAD_TIMEOUT = 120000; // 2 minutos
  private static readonly RETRY_COUNT = 2;

  /**
   * Sube un archivo de audio con retry automático y timeout
   */
  static uploadSongWithRetry(params: {
    title: string;
    artist: string;
    genre?: string;
    description?: string;
    duration?: number;
    bpm?: number;
    decade?: number;
    country?: string;
    audio: DocumentPickerResponse;
    token?: string;
    onProgress?: (progress: UploadProgress) => void;
  }): Observable<any> {
    const { onProgress, ...uploadParams } = params;

    return from(
      uploadParams.token
        ? Promise.resolve(uploadParams.token)
        : authService.getToken(),
    ).pipe(
      switchMap(token => {
        if (!token) {
          return throwError(() => new Error('No auth token (inicia sesión)'));
        }

        // Notificar inicio del proceso
        onProgress?.({
          progress: 0,
          stage: 'uploading',
          message: 'Iniciando subida...',
        });

        return new Observable(subscriber => {
          const form = new FormData();
          form.append('file', {
            uri: uploadParams.audio.uri,
            name: uploadParams.audio.name ?? `audio-${Date.now()}.mp3`,
            type: uploadParams.audio.type ?? 'audio/mpeg',
          } as any);

          Object.entries(uploadParams).forEach(([key, value]) => {
            if (key !== 'audio' && key !== 'token' && value !== undefined) {
              form.append(key, String(value));
            }
          });

          const url = `${API_BASE}/file/song`;
          const xhr = new XMLHttpRequest();

          let lastProgress = -1;
          const reportProgress = (
            p: number,
            stage: UploadProgress['stage'] = 'uploading',
          ) => {
            const clamped = Math.max(0, Math.min(100, Math.round(p)));
            if (clamped !== lastProgress) {
              lastProgress = clamped;
              onProgress?.({
                progress: clamped,
                stage,
                message:
                  stage === 'uploading'
                    ? 'Subiendo archivo...'
                    : 'Procesando...',
              });
            }
          };

          xhr.upload.onloadstart = () => reportProgress(0);
          xhr.upload.onprogress = evt => {
            if (!evt.lengthComputable) return;
            const pct = (evt.loaded / evt.total) * 100;
            reportProgress(Math.min(99, pct));
          };
          xhr.upload.onload = () => reportProgress(Math.max(lastProgress, 99));

          xhr.onload = () => {
            reportProgress(100);
            const status = xhr.status;
            const text = xhr.responseText || '';

            if (status >= 200 && status < 300) {
              let parsed: any = {};
              try {
                parsed = text ? JSON.parse(text) : {};
              } catch {
                const trimmed = text.trim();
                if (/^https?:\/\//i.test(trimmed)) {
                  parsed = { url: trimmed };
                }
              }

              const fromBody =
                parsed?.data?.url ??
                parsed?.data?.audioUrl ??
                parsed?.url ??
                parsed?.audioUrl ??
                parsed?.Location ??
                parsed?.location;

              const fromHeader =
                xhr.getResponseHeader('Location') ||
                xhr.getResponseHeader('location') ||
                xhr.getResponseHeader('X-File-URL') ||
                xhr.getResponseHeader('x-file-url') ||
                xhr.getResponseHeader('X-Resource-Location') ||
                undefined;

              const finalUrl = fromBody || fromHeader || null;

              const result = {
                ...parsed,
                url: finalUrl,
                headers: { location: fromHeader || null },
                raw: text,
                status,
              };

              subscriber.next(result);
              subscriber.complete();
            } else {
              subscriber.error(new Error(`HTTP ${status} - ${text}`));
            }
          };

          xhr.onerror = () => subscriber.error(new Error('Network error'));
          xhr.ontimeout = () => subscriber.error(new Error('Request timeout'));
          xhr.onabort = () => subscriber.error(new Error('Upload aborted'));
          xhr.timeout = this.UPLOAD_TIMEOUT;

          xhr.open('POST', url);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(form);

          return () => xhr.abort();
        });
      }),
      timeout(this.UPLOAD_TIMEOUT),
      retry(this.RETRY_COUNT),
      catchError(error => {
        onProgress?.({
          progress: 0,
          stage: 'error',
          message: `Error en subida: ${error.message}`,
        });
        return throwError(() => error);
      }),
    );
  }

  /**
   * Proceso completo de subida: archivo + creación en BD
   */
  static uploadAndCreateSong(params: {
    title: string;
    artist: string;
    genre?: string;
    description?: string;
    duration?: number;
    bpm?: number;
    decade?: number;
    country?: string;
    audio: DocumentPickerResponse;
    token?: string;
    onProgress?: (progress: UploadProgress) => void;
  }): Observable<{ upload: any; song: any }> {
    const { onProgress, ...uploadParams } = params;

    return this.uploadSongWithRetry({
      ...uploadParams,
      onProgress: progress => {
        // Mapear el progreso de subida al 70% del total
        const mappedProgress = {
          ...progress,
          progress: Math.round(progress.progress * 0.7),
        };
        onProgress?.(mappedProgress);
      },
    }).pipe(
      tap(() => {
        onProgress?.({
          progress: 70,
          stage: 'creating',
          message: 'Creando registro en la base de datos...',
        });
      }),
      switchMap(uploadResult => {
        // Extraer URL del resultado de subida
        const audioUrlCandidates = [
          uploadResult?.data?.url,
          uploadResult?.data?.audioUrl,
          uploadResult?.data?.fileUrl,
          uploadResult?.url,
          uploadResult?.blobUrl,
          uploadResult?.Location,
        ];

        const audioUrl = audioUrlCandidates.find(
          v => typeof v === 'string' && v.length > 0,
        ) as string | undefined;

        if (!audioUrl) {
          return throwError(() => new Error('No se recibió URL del audio'));
        }

        // Crear registro en BD
        return songsService
          .createSong({
            title: uploadParams.title.trim(),
            artist: uploadParams.artist.trim(),
            description: uploadParams.description?.trim() || null,
            audioUrl: audioUrl.split('canciones/')[1] || audioUrl,
            duration:
              typeof uploadParams.duration === 'number'
                ? uploadParams.duration
                : null,
            bpm: typeof uploadParams.bpm === 'number' ? uploadParams.bpm : null,
            decade:
              typeof uploadParams.decade === 'number'
                ? uploadParams.decade
                : null,
            country: uploadParams.country?.trim() || null,
            genre: uploadParams.genre?.trim() || null,
          })
          .pipe(
            map(songResponse => ({ upload: uploadResult, song: songResponse })),
          );
      }),
      tap(result => {
        console.log(result);
        onProgress?.({
          progress: 100,
          stage: 'completed',
          message: 'Proceso completado exitosamente',
        });
      }),
      timeout(30000), // 30 segundos para la creación en BD
      retry(1),
      catchError(error => {
        onProgress?.({
          progress: 0,
          stage: 'error',
          message: `Error: ${error.message}`,
        });
        return throwError(() => error);
      }),
    );
  }

  /**
   * Búsqueda de canciones con debounce
   */
  static searchSongs(searchTerm$: Observable<string>): Observable<any[]> {
    return searchTerm$.pipe(
      debounceTime(300), // Esperar 300ms después del último cambio
      distinctUntilChanged(), // Solo ejecutar si el término cambió
      switchMap(term => {
        if (!term.trim()) {
          return of([]); // Retornar array vacío si no hay término
        }

        // Aquí iría la llamada al endpoint de búsqueda
        return songsService.getSongs().pipe(
          map(response =>
            response.data.filter(
              song =>
                song.title.toLowerCase().includes(term.toLowerCase()) ||
                song.artist.toLowerCase().includes(term.toLowerCase()),
            ),
          ),
          catchError(error => {
            console.error('Error en búsqueda:', error);
            return of([]); // Retornar array vacío en caso de error
          }),
        );
      }),
      shareReplay(1), // Compartir el último resultado entre múltiples suscriptores
    );
  }
}

// Función helper para mantener compatibilidad con el código existente
export function uploadSongMultipart(params: {
  title: string;
  artist: string;
  genre?: string;
  description?: string;
  duration?: number;
  bpm?: number;
  decade?: number;
  country?: string;
  audio: DocumentPickerResponse;
  token?: string;
  onProgress?: (p: number) => void;
}): Observable<any> {
  return EnhancedUploadService.uploadSongWithRetry({
    ...params,
    onProgress: params.onProgress
      ? progress => params.onProgress!(progress.progress)
      : undefined,
  });
}
