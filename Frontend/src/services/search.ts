import { api } from './api';
export type SearchUser   = { id: string; name: string; username?: string; avatarUrl?: string; email?: string };
export type SearchArtist = { id: string; name: string; avatarUrl?: string };
export type SearchSong   = { id: string; title: string; audioUrl: string; artwork?: string; artist?: string };

export type SearchResponse = { users: SearchUser[]; artists: SearchArtist[]; songs: SearchSong[] };

function norm(s?: string) {
  return (s ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/\s+/g, ' ');
}
function has(a?: string, b?: string) { return norm(a).includes(norm(b)); }

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
    if (Array.isArray(cur.data)) return typeof cur.data[0] === 'object' ? cur.data : pickRowsDeep(cur.data);
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

export const SearchService = {
  async searchAll(q: string): Promise<SearchResponse> {
    const query = q.trim();
    if (!query) return { users: [], artists: [], songs: [] };

    try {
      const [u, a, s] = await Promise.all([
        api.get<any>('/users/search',   { params: { q: query, limit: 10 } }),
        api.get<any>('/artists/search', { params: { q: query, limit: 10 } }),
        api.get<any>('/songs/search',   { params: { q: query, limit: 10 } }),
      ]);
      const uRows = pickRowsDeep(u).map(mapUser);
      const aRows = pickRowsDeep(a).map(mapArtist);
      const sRows = pickRowsDeep(s).map(mapSong);
      if (uRows.length || aRows.length || sRows.length) {
        console.log('[Search]/search =>', { users: uRows.length, artists: aRows.length, songs: sRows.length });
        return { users: uRows, artists: aRows, songs: sRows };
      }
      console.log('[Search]/search sin resultados → fallback');
    } catch (e) {
      console.log('[Search]/search no disponible → fallback. Motivo:', (e as Error)?.message);
    }

    const [usersList, artistsList, songsList] = await Promise.all([
      api.get<any>('/app_user', { params: { limit: 500 } })
         .catch(() => api.get<any>('/users', { params: { limit: 500 } })
         .catch(() => api.get<any>('/users/list', { params: { limit: 500 } })
         .catch(() => ({ rows: [] })))),
      api.get<any>('/artists', { params: { limit: 500 } }).catch(() => ({ rows: [] })),
      api.get<any>('/songs',   { params: { limit: 500, offset: 0 } }).catch(() => ({ rows: [] })),
    ]);

    try { console.log('[Search] raw users =>', JSON.stringify(usersList).slice(0, 400)); } catch {}
    try { console.log('[Search] raw artists =>', JSON.stringify(artistsList).slice(0, 200)); } catch {}
    try { console.log('[Search] raw songs =>', JSON.stringify(songsList).slice(0, 200)); } catch {}

    const usersRaw   = pickRowsDeep(usersList);
    const artistsRaw = pickRowsDeep(artistsList);
    const songsRaw   = pickRowsDeep(songsList);

    console.log('[Search] fallback fetched =>', {
      users: usersRaw.length, artists: artistsRaw.length, songs: songsRaw.length,
    });

    const users = usersRaw
      .filter((u: any) =>
        has(u.username,  query) ||
        has(u.full_name, query) ||
        has(u.name,      query) ||
        has(u.email,     query)
      )
      .slice(0, 10)
      .map(mapUser);

    const artists = artistsRaw
      .filter((a: any) => has(a.artist_name ?? a.name, query))
      .slice(0, 10)
      .map(mapArtist);

    const songs = songsRaw
      .filter((s: any) => has(s.title, query) || has(s.artist_name ?? s.artist, query))
      .slice(0, 10)
      .map(mapSong);

    console.log('[Search] fallback filtered =>', { users: users.length, artists: artists.length, songs: songs.length });

    return { users, artists, songs };
  },
};
