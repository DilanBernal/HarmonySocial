import HttpClient from '../core/services/HttpClient';
import { AppConfig } from '../config/AppConfig';
import { Observable, forkJoin, of, Subject } from 'rxjs';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { HttpResponse } from '../core/models/utils/HttpResponse';
export type SearchUser = {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  email?: string;
};
export type SearchArtist = { id: string; name: string; avatarUrl?: string };
export type SearchSong = {
  id: string;
  title: string;
  audioUrl: string;
  artwork?: string;
  artist?: string;
};

export type SearchResponse = {
  users: SearchUser[];
  artists: SearchArtist[];
  songs: SearchSong[];
};

function norm(s?: string) {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
function has(a?: string, b?: string) {
  return norm(a).includes(norm(b));
}

function pickRowsDeep(obj: any): any[] {
  const seen = new Set<any>();
  const stack = [obj];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== 'object' || seen.has(cur)) continue;
    seen.add(cur);

    if (Array.isArray(cur)) {
      if (cur.length === 0) continue;
      if (typeof cur[0] === 'object') return cur;
      continue;
    }
    if (Array.isArray(cur.rows)) return cur.rows;
    if (Array.isArray(cur.data))
      return typeof cur.data[0] === 'object'
        ? cur.data
        : pickRowsDeep(cur.data);
    if (Array.isArray(cur.items)) return cur.items;
    if (Array.isArray(cur.users)) return cur.users;
    if (Array.isArray(cur.result)) return cur.result;

    for (const k of Object.keys(cur)) {
      const v = (cur as any)[k];
      if (v && typeof v === 'object') stack.push(v);
    }
  }
  return [];
}

const mapUser = (u: any): SearchUser => ({
  id: String(u.id),
  name: u.full_name ?? u.name ?? u.username ?? '',
  username: u.username,
  email: u.email,
  avatarUrl: u.avatar_url ?? u.avatarUrl,
});
const mapArtist = (a: any): SearchArtist => ({
  id: String(a.id),
  name: a.artist_name ?? a.name ?? '',
  avatarUrl: a.avatar_url ?? a.avatarUrl,
});
const mapSong = (s: any): SearchSong => ({
  id: String(s.id),
  title: s.title ?? '',
  audioUrl: s.audio_url ?? s.audioUrl ?? s.url ?? '',
  artwork: s.artwork ?? s.cover ?? s.cover_url,
  artist: s.artist_name ?? s.artist,
});

export class SearchService {
  private httpClient: HttpClient;
  private searchSubject = new Subject<string>();
  private lastSearchResults: SearchResponse = {
    users: [],
    artists: [],
    songs: [],
  };

  constructor() {
    this.httpClient = new HttpClient(AppConfig.apiBaseUrl);

    // Setup debounced search
    this.setupDebouncedSearch();
  }

  private setupDebouncedSearch() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.searchAll(query)),
      )
      .subscribe({
        next: results => {
          this.lastSearchResults = results;
        },
        error: error => {
          console.error('Debounced search error:', error);
        },
      });
  }

  searchAll(query: string): Observable<SearchResponse> {
    const q = query.trim();
    if (!q) {
      return of({ users: [], artists: [], songs: [] });
    }

    console.log('Starting search for:', q);

    // Try optimized search endpoints first
    const optimizedSearch = forkJoin({
      users: this.httpClient
        .get<any>(`/users/search?q=${encodeURIComponent(q)}&limit=10`)
        .pipe(catchError(() => of({ data: [] }))),
      artists: this.httpClient
        .get<any>(`/artists/search?q=${encodeURIComponent(q)}&limit=10`)
        .pipe(catchError(() => of({ data: [] }))),
      songs: this.httpClient
        .get<any>(`/songs/search?q=${encodeURIComponent(q)}&limit=10`)
        .pipe(catchError(() => of({ data: [] }))),
    }).pipe(
      map(({ users, artists, songs }) => {
        const uRows = pickRowsDeep(users.data).map(mapUser);
        const aRows = pickRowsDeep(artists.data).map(mapArtist);
        const sRows = pickRowsDeep(songs.data).map(mapSong);

        if (uRows.length || aRows.length || sRows.length) {
          console.log('[Search] Optimized results:', {
            users: uRows.length,
            artists: aRows.length,
            songs: sRows.length,
          });
          return { users: uRows, artists: aRows, songs: sRows };
        }

        throw new Error('No results from optimized search');
      }),
    );

    // Fallback to full search if optimized search fails
    const fallbackSearch = forkJoin({
      users: this.httpClient
        .get<any>(`/app_user?limit=500`)
        .pipe(
          catchError(() =>
            this.httpClient
              .get<any>(`/users?limit=500`)
              .pipe(
                catchError(() =>
                  this.httpClient
                    .get<any>(`/users/list?limit=500`)
                    .pipe(catchError(() => of({ data: { rows: [] } }))),
                ),
              ),
          ),
        ),
      artists: this.httpClient
        .get<any>(`/artists?limit=500`)
        .pipe(catchError(() => of({ data: { rows: [] } }))),
      songs: this.httpClient
        .get<any>(`/songs?limit=500&offset=0`)
        .pipe(catchError(() => of({ data: { rows: [] } }))),
    }).pipe(
      map(({ users, artists, songs }) => {
        const usersRaw = pickRowsDeep(users.data);
        const artistsRaw = pickRowsDeep(artists.data);
        const songsRaw = pickRowsDeep(songs.data);

        console.log('[Search] Fallback data fetched:', {
          users: usersRaw.length,
          artists: artistsRaw.length,
          songs: songsRaw.length,
        });

        const filteredUsers = usersRaw
          .filter(
            (u: any) =>
              has(u.username, q) ||
              has(u.full_name, q) ||
              has(u.name, q) ||
              has(u.email, q),
          )
          .slice(0, 10)
          .map(mapUser);

        const filteredArtists = artistsRaw
          .filter((a: any) => has(a.artist_name ?? a.name, q))
          .slice(0, 10)
          .map(mapArtist);

        const filteredSongs = songsRaw
          .filter(
            (s: any) => has(s.title, q) || has(s.artist_name ?? s.artist, q),
          )
          .slice(0, 10)
          .map(mapSong);

        console.log('[Search] Fallback filtered results:', {
          users: filteredUsers.length,
          artists: filteredArtists.length,
          songs: filteredSongs.length,
        });

        return {
          users: filteredUsers,
          artists: filteredArtists,
          songs: filteredSongs,
        };
      }),
    );

    return optimizedSearch.pipe(
      catchError(error => {
        console.log(
          '[Search] Optimized search failed, using fallback:',
          error.message,
        );
        return fallbackSearch;
      }),
    );
  }

  // Método para búsqueda con debounce
  searchWithDebounce(query: string): void {
    this.searchSubject.next(query);
  }

  // Obtener los últimos resultados de búsqueda
  getLastSearchResults(): SearchResponse {
    return this.lastSearchResults;
  }

  // Búsquedas específicas por tipo
  searchUsers(query: string): Observable<HttpResponse<SearchUser[]>> {
    return this.httpClient
      .get<any>(`/users/search?q=${encodeURIComponent(query)}&limit=20`)
      .pipe(
        map(response => ({
          ...response,
          data: pickRowsDeep(response.data).map(mapUser),
        })),
        catchError(error => {
          console.error('SearchService.searchUsers - Error:', error);
          return of({ data: [], status: 500, statusText: 'Error' });
        }),
      );
  }

  searchArtists(query: string): Observable<HttpResponse<SearchArtist[]>> {
    return this.httpClient
      .get<any>(`/artists/search?q=${encodeURIComponent(query)}&limit=20`)
      .pipe(
        map(response => ({
          ...response,
          data: pickRowsDeep(response.data).map(mapArtist),
        })),
        catchError(error => {
          console.error('SearchService.searchArtists - Error:', error);
          return of({ data: [], status: 500, statusText: 'Error' });
        }),
      );
  }

  searchSongs(query: string): Observable<HttpResponse<SearchSong[]>> {
    return this.httpClient
      .get<any>(`/songs/search?q=${encodeURIComponent(query)}&limit=20`)
      .pipe(
        map(response => ({
          ...response,
          data: pickRowsDeep(response.data).map(mapSong),
        })),
        catchError(error => {
          console.error('SearchService.searchSongs - Error:', error);
          return of({ data: [], status: 500, statusText: 'Error' });
        }),
      );
  }
}

// Exportar instancia singleton
export const searchService = new SearchService();
