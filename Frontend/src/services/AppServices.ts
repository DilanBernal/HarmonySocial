import { AuthUserService } from '../core/services/user/auth/AuthUserService';
import UserService from '../core/services/user/user/UserService';
import {
  GetSongsService,
  songsService as coresongsService,
} from '../core/services/song/GetSongsService';
import { songsService } from './songs';
import { searchService, SearchService } from './search';
import { Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { useRxSubscriptions } from '../hooks/useRxSubscriptions';

/**
 * Servicio centralizado que unifica todos los servicios de la aplicación
 * Proporciona una interfaz consistente para todas las operaciones con RxJS
 */
export class AppServices {
  // Servicios de autenticación y usuario
  public readonly auth = new AuthUserService();
  public readonly user = new UserService();

  // Servicios de canciones
  public readonly songs = songsService; // El nuevo servicio con HttpClient
  public readonly coreSongs = coresongsService; // El servicio del core refactorizado

  // Servicios de búsqueda
  public readonly search = searchService;

  constructor() {
    console.log('AppServices initialized');
  }

  /**
   * Flujo completo de login
   * 1. Autentica al usuario
   * 2. Obtiene datos adicionales del usuario
   * 3. Retorna toda la información necesaria
   */
  loginComplete(
    userOrEmail: string,
    password: string,
  ): Observable<{
    loginResponse: any;
    userData: any;
  }> {
    return this.auth.login({ userOrEmail, password }).pipe(
      switchMap(loginResponse => {
        const userId = loginResponse.data.data.id;
        return this.user.getUserData(userId).pipe(
          map(userDataResponse => ({
            loginResponse: loginResponse.data,
            userData: userDataResponse.data,
          })),
        );
      }),
    );
  }

  /**
   * Flujo completo de subida de canción
   * 1. Sube el archivo
   * 2. Crea el registro en la base de datos
   * 3. Retorna la información de la canción creada
   */
  uploadSongComplete(uploadParams: any): Observable<any> {
    // Usar el servicio de upload existente
    const { uploadSongMultipart } = require('./upload');

    return uploadSongMultipart(uploadParams).pipe(
      switchMap((uploadResult: any) => {
        // Extraer URL del resultado
        const audioUrl = this.extractAudioUrl(uploadResult);

        if (!audioUrl) {
          throw new Error('No se pudo obtener la URL del audio');
        }

        // Crear registro en la base de datos
        return this.songs
          .createSong({
            title: uploadParams.title,
            artist: uploadParams.artist,
            description: uploadParams.description || null,
            audioUrl: audioUrl.split('canciones/')[1] || audioUrl,
            duration: uploadParams.duration || null,
            bpm: uploadParams.bpm || null,
            decade: uploadParams.decade || null,
            country: uploadParams.country || null,
            genre: uploadParams.genre || null,
          })
          .pipe(
            map(songResponse => ({
              upload: uploadResult,
              song: songResponse.data,
            })),
          );
      }),
    );
  }

  private extractAudioUrl(uploadResult: any): string | null {
    const candidates = [
      uploadResult?.data?.url,
      uploadResult?.data?.audioUrl,
      uploadResult?.data?.fileUrl,
      uploadResult?.url,
      uploadResult?.blobUrl,
      uploadResult?.Location,
    ];

    return (
      candidates.find(url => typeof url === 'string' && url.length > 0) || null
    );
  }

  /**
   * Búsqueda global unificada
   */
  searchGlobal(query: string): Observable<any> {
    return this.search.searchAll(query);
  }

  /**
   * Obtener canciones del usuario actual
   */
  getMySongs(page = 1, limit = 20): Observable<any> {
    return this.coreSongs.listMine(page, limit);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated();
  }

  /**
   * Logout completo
   */
  logoutComplete(): Observable<boolean> {
    return this.auth.logout();
  }
}

// Instancia singleton
export const appServices = new AppServices();

/**
 * Hook personalizado que combina AppServices con useRxSubscriptions
 * para un manejo automático de subscripciones
 */
export function useAppServices() {
  const { addSubscription } = useRxSubscriptions();

  return {
    services: appServices,
    addSubscription,

    // Métodos helper que automáticamente manejan subscripciones
    login: (
      userOrEmail: string,
      password: string,
      callbacks: {
        onSuccess?: (result: any) => void;
        onError?: (error: any) => void;
      },
    ) => {
      const subscription = appServices
        .loginComplete(userOrEmail, password)
        .subscribe({
          next: callbacks.onSuccess,
          error: callbacks.onError,
        });
      addSubscription(subscription);
      return subscription;
    },

    uploadSong: (
      params: any,
      callbacks: {
        onSuccess?: (result: any) => void;
        onError?: (error: any) => void;
        onProgress?: (progress: number) => void;
      },
    ) => {
      const uploadParams = { ...params, onProgress: callbacks.onProgress };
      const subscription = appServices
        .uploadSongComplete(uploadParams)
        .subscribe({
          next: callbacks.onSuccess,
          error: callbacks.onError,
        });
      addSubscription(subscription);
      return subscription;
    },

    search: (
      query: string,
      callbacks: {
        onResults?: (results: any) => void;
        onError?: (error: any) => void;
      },
    ) => {
      const subscription = appServices.searchGlobal(query).subscribe({
        next: callbacks.onResults,
        error: callbacks.onError,
      });
      addSubscription(subscription);
      return subscription;
    },
  };
}

export default appServices;
