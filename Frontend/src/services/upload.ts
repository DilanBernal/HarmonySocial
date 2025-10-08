import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import { API_BASE } from './api';
import { AuthUserService } from '../core/services/user/auth/AuthUserService';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

const authService = new AuthUserService();

export async function pickAudio(): Promise<DocumentPickerResponse | null> {
  try {
    const res = await pick({
      type: [types.audio],
      allowMultiSelection: false,
      mode: 'import' as const,
    });
    return Array.isArray(res) ? res[0] : res;
  } catch (e) {
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED)
      return null;
    throw e;
  }
}

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
  const {
    title,
    artist,
    genre,
    description,
    duration,
    bpm,
    decade,
    country,
    audio,
    onProgress,
  } = params;

  return from(
    params.token ? Promise.resolve(params.token) : authService.getToken(),
  ).pipe(
    switchMap(token => {
      if (!token)
        return throwError(() => new Error('No auth token (inicia sesión)'));

      return new Observable(subscriber => {
        console.log(
          '[uploadSongMultipart] starting upload, token present:',
          !!token,
        );
        console.log('[uploadSongMultipart] audio uri:', audio?.uri);

        if (!audio?.uri) {
          subscriber.error(new Error('Audio file missing uri'));
          return;
        }

        const url = `${API_BASE.replace(/\/$/, '')}/file/song`;
        console.log('[uploadSongMultipart] POST URL =', url);

        let activeXhr: XMLHttpRequest | null = null;
        let aborted = false;

        const sendForm = (form: FormData) => {
          const xhr = new XMLHttpRequest();
          activeXhr = xhr;

          let last = -1;
          const report = (p: number) => {
            const clamped = Math.max(0, Math.min(100, Math.round(p)));
            if (clamped !== last && onProgress) {
              last = clamped;
              onProgress(clamped);
            }
          };

          xhr.upload.onloadstart = () => report(0);
          xhr.upload.onprogress = evt => {
            if (!evt.lengthComputable) return;
            const pct = (evt.loaded / evt.total) * 100;
            report(Math.min(99, pct));
          };
          xhr.upload.onload = () => report(Math.max(last, 99));

          xhr.onload = () => {
            report(100);
            const status = xhr.status;
            const text = xhr.responseText || '';

            if (status >= 200 && status < 300) {
              let parsed: any = {};
              try {
                parsed = text ? JSON.parse(text) : {};
              } catch {
                const trimmed = text.trim();
                if (/^https?:\/\//i.test(trimmed)) parsed = { url: trimmed };
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

          xhr.onerror = async (e: any) => {
            console.error('[uploadSongMultipart] xhr.onerror', e);
            // fetch fallback
            try {
              console.log('[uploadSongMultipart] attempting fetch() fallback');
              const fetchRes = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: form as any,
              });
              const text = await fetchRes.text();
              if (fetchRes.ok) {
                let parsed: any = {};
                try {
                  parsed = text ? JSON.parse(text) : {};
                } catch {
                  const trimmed = text.trim();
                  if (/^https?:\/\//i.test(trimmed)) parsed = { url: trimmed };
                }
                const result = {
                  ...parsed,
                  raw: text,
                  status: fetchRes.status,
                };
                subscriber.next(result);
                subscriber.complete();
                return;
              }
              subscriber.error(
                new Error(`Fallback HTTP ${fetchRes.status} - ${text}`),
              );
              return;
            } catch (fetchErr) {
              console.error(
                '[uploadSongMultipart] fetch fallback error',
                fetchErr,
              );
              subscriber.error(new Error('Network error (xhr + fetch failed)'));
              return;
            }
          };

          xhr.ontimeout = () => subscriber.error(new Error('Request timeout'));
          xhr.onabort = () => subscriber.error(new Error('Upload aborted'));
          xhr.timeout = 120000;

          try {
            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(form as any);
            console.log('[uploadSongMultipart] xhr.send called');
          } catch (err) {
            subscriber.error(
              err instanceof Error ? err : new Error(String(err)),
            );
          }
        };

        (async () => {
          try {
            const form = new FormData();
            const fileName = audio.name ?? `audio-${Date.now()}.mp3`;
            const fileType = audio.type ?? 'audio/mpeg';

            if (
              audio.uri &&
              audio.uri.startsWith &&
              audio.uri.startsWith('content://')
            ) {
              try {
                console.log(
                  '[uploadSongMultipart] detected content:// URI, attempting blob fetch',
                );
                const resp = await fetch(audio.uri);
                const blob = await resp.blob();
                try {
                  (form.append as any)('file', blob, fileName);
                  (form.append as any)('audio', blob, fileName);
                } catch {
                  form.append('file', {
                    uri: audio.uri,
                    name: fileName,
                    type: fileType,
                  } as any);
                  form.append('audio', {
                    uri: audio.uri,
                    name: fileName,
                    type: fileType,
                  } as any);
                }
              } catch (err) {
                console.warn(
                  '[uploadSongMultipart] could not fetch blob for content:// URI',
                  err,
                );

                // Try using react-native-blob-util (rn-fetch-blob fork) to resolve content:// URIs
                try {
                  const RNFetchBlob = require('react-native-blob-util');
                  console.log(
                    '[uploadSongMultipart] attempting react-native-blob-util fetch for content://',
                  );
                  const rbResp = await RNFetchBlob.config({
                    fileCache: true,
                  }).fetch('GET', audio.uri);
                  const localPath = rbResp.path();
                  console.log(
                    '[uploadSongMultipart] react-native-blob-util saved to',
                    localPath,
                  );
                  form.append('file', {
                    uri: RNFetchBlob.fs.isDir
                      ? `file://${localPath}`
                      : `file://${localPath}`,
                    name: fileName,
                    type: fileType,
                  } as any);
                  form.append('audio', {
                    uri: `file://${localPath}`,
                    name: fileName,
                    type: fileType,
                  } as any);
                } catch (rbErr) {
                  console.warn(
                    '[uploadSongMultipart] react-native-blob-util fallback failed',
                    rbErr,
                  );
                  // Final fallback: append the content:// URI directly (may fail on some devices)
                  form.append('file', {
                    uri: audio.uri,
                    name: fileName,
                    type: fileType,
                  } as any);
                  form.append('audio', {
                    uri: audio.uri,
                    name: fileName,
                    type: fileType,
                  } as any);
                }
              }
            } else {
              form.append('file', {
                uri: audio.uri,
                name: fileName,
                type: fileType,
              } as any);
              form.append('audio', {
                uri: audio.uri,
                name: fileName,
                type: fileType,
              } as any);
            }

            form.append('title', title);
            form.append('artist', artist);
            if (genre) form.append('genre', genre);
            if (description) form.append('description', description);
            if (typeof duration === 'number')
              form.append('duration', String(duration));
            if (typeof bpm === 'number') form.append('bpm', String(bpm));
            if (typeof decade === 'number')
              form.append('decade', String(decade));
            if (country) form.append('country', country);

            if (aborted) return subscriber.error(new Error('Upload aborted'));

            // Connectivity / preflight check (best-effort) to surface early network issues
            try {
              const pingUrl = `${API_BASE.replace(/\/$/, '')}/ping`;
              console.log(
                '[uploadSongMultipart] performing HEAD preflight to',
                pingUrl,
              );
              const headRes = await fetch(pingUrl, {
                method: 'HEAD',
                headers: { Authorization: `Bearer ${token}` },
              });
              console.log('[uploadSongMultipart] HEAD status', headRes.status);
            } catch (headErr) {
              console.warn(
                '[uploadSongMultipart] HEAD preflight failed',
                headErr,
              );
            }

            sendForm(form);
          } catch (prepErr) {
            subscriber.error(
              prepErr instanceof Error ? prepErr : new Error(String(prepErr)),
            );
          }
        })();

        return () => {
          aborted = true;
          if (activeXhr)
            try {
              activeXhr.abort();
            } catch {}
        };
      });
    }),
    catchError(error => throwError(() => error)),
  );
}
