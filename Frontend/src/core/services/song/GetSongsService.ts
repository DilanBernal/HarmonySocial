import { Paginated } from '../../types/Paginated';
import { AppConfig } from '../../../config/AppConfig';
import HttpClient from '../HttpClient';
import { Observable, of, Subject } from 'rxjs';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { HttpResponse } from '../../models/utils/HttpResponse';

export type Song = {
  id: number;
  title: string;
  audioUrl: string;
  createdAt: string;
  artist?: string;
  genre?: string;
  duration?: number;
  artwork?: string;
};

export type CreateSongDTO = {
  title: string;
  artist: string;
  audioUrl: string;
  genre?: string;
  description?: string;
  duration?: number;
  bpm?: number;
  decade?: number;
  country?: string;
};

export type ApiEnvelope<T> = { success: boolean; data: T };

export class GetSongsService {
  private httpClient: HttpClient;
  private searchSubject = new Subject<string>();
  private searchResults$ = new Subject<HttpResponse<Song[]>>();

  // Cache para evitar peticiones repetidas
  private myListCache$: Observable<
    HttpResponse<ApiEnvelope<Paginated<Song>>>
  > | null = null;
  private lastPage: number = 0;
  private lastLimit: number = 0;

  constructor() {
    this.httpClient = new HttpClient(AppConfig.apiBaseUrl);

    // Setup search with debounce - NO auto-subscribe
    this.setupSearchStream();
  }

  private setupSearchStream() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.performSearch(query)),
      )
      .subscribe(results => {
        // Emitir resultados solo cuando se soliciten
        this.searchResults$.next(results);
      });
  }

  private performSearch(query: string): Observable<HttpResponse<Song[]>> {
    if (!query.trim()) {
      return of({ data: [], status: 200, statusText: 'OK' });
    }

    return this.httpClient
      .get<Song[]>(`songs/search?q=${encodeURIComponent(query)}`)
      .pipe(
        catchError(error => {
          console.error('Search error:', error);
          return of({ data: [], status: 500, statusText: 'Error' });
        }),
      );
  }

  getById(id: string): Observable<HttpResponse<Song>> {
    return this.httpClient.get<Song>(`songs/${id}`).pipe(
      catchError(error => {
        console.error('GetSongsService.getById - Error:', error);
        throw error;
      }),
    );
  }

  create(dto: CreateSongDTO): Observable<HttpResponse<Song>> {
    return this.httpClient.post<Song>('songs', dto).pipe(
      tap(() => {
        // Limpiar cache cuando se crea una nueva canción
        this.clearMyListCache();
      }),
      catchError(error => {
        console.error('GetSongsService.create - Error:', error);
        throw error;
      }),
    );
  }

  listMine(
    page = 1,
    limit = 20,
  ): Observable<HttpResponse<ApiEnvelope<Paginated<Song>>>> {
    console.log(
      `[GetSongsService] Fetching my songs - page: ${page}, limit: ${limit}`,
    );

    // Si es la misma petición y ya está en cache, devolver cache
    if (
      this.myListCache$ &&
      this.lastPage === page &&
      this.lastLimit === limit
    ) {
      console.log('[GetSongsService] Returning cached result');
      return this.myListCache$;
    }

    // Actualizar cache parameters
    this.lastPage = page;
    this.lastLimit = limit;

    // Crear nueva petición con cache
    this.myListCache$ = this.httpClient
      .get<ApiEnvelope<Paginated<Song>>>(
        `songs/mine/list?page=${page}&limit=${limit}`,
      )
      .pipe(
        tap(response => {
          console.log('[GetSongsService] listMine response:', response);
        }),
        shareReplay(1), // Cache la última emisión
        catchError(error => {
          console.error('GetSongsService.listMine - Error:', error);
          // Limpiar cache en caso de error
          this.myListCache$ = null;
          throw error;
        }),
      );

    return this.myListCache$;
  }

  // Método para limpiar cache manualmente
  clearMyListCache(): void {
    this.myListCache$ = null;
    console.log('[GetSongsService] Cache cleared');
  }

  listAll(
    page = 1,
    limit = 20,
  ): Observable<HttpResponse<ApiEnvelope<Paginated<Song>>>> {
    console.log(
      `[GetSongsService] Fetching all songs - page: ${page}, limit: ${limit}`,
    );

    return this.httpClient
      .get<ApiEnvelope<Paginated<Song>>>(`songs?page=${page}&limit=${limit}`)
      .pipe(
        map(response => {
          console.log('[GetSongsService] listAll response:', response);
          return response;
        }),
        catchError(error => {
          console.error('GetSongsService.listAll - Error:', error);
          throw error;
        }),
      );
  }

  searchSongs(query: string): Observable<HttpResponse<Song[]>> {
    return this.httpClient
      .get<Song[]>(`songs/search?q=${encodeURIComponent(query)}`)
      .pipe(
        catchError(error => {
          console.error('GetSongsService.searchSongs - Error:', error);
          return of({ data: [], status: 500, statusText: 'Error' });
        }),
      );
  }

  // Búsqueda con debounce - Devuelve Observable controlado
  searchWithDebounce(query: string): Observable<HttpResponse<Song[]>> {
    this.searchSubject.next(query);
    return this.searchResults$.asObservable();
  }

  // Búsqueda directa sin debounce para casos específicos
  searchSongsImmediate(query: string): Observable<HttpResponse<Song[]>> {
    return this.searchSongs(query);
  }

  getSongStreamUrl(blobname: string): string {
    console.log('Getting stream URL for:', blobname);
    return `${AppConfig.apiBaseUrl.replace(
      /\/$/,
      '',
    )}/file/song?id=${encodeURIComponent(blobname)}`;
  }

  updateSong(
    id: string,
    updates: Partial<CreateSongDTO>,
  ): Observable<HttpResponse<Song>> {
    return this.httpClient.put<Song>(`songs/${id}`, updates).pipe(
      catchError(error => {
        console.error('GetSongsService.updateSong - Error:', error);
        throw error;
      }),
    );
  }

  deleteSong(id: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(`songs/${id}`).pipe(
      catchError(error => {
        console.error('GetSongsService.deleteSong - Error:', error);
        throw error;
      }),
    );
  }
}

// Exportar instancia singleton
export const songsService = new GetSongsService();
