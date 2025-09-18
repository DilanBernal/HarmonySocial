import { api } from './api';

export type SearchUser   = { id: string; name: string; username?: string; avatarUrl?: string; email?: string };
export type SearchArtist = { id: string; name: string; avatarUrl?: string };
export type SearchSong   = { id: string; title: string; audioUrl: string; artwork?: string; artist?: string };

export type SearchResponse = { users: SearchUser[]; artists: SearchArtist[]; songs: SearchSong[] };

function norm(s?: string) {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
function contains(a?: string, b?: string) { return norm(a).includes(norm(b)); }

function pickRows(resp: any): any[] {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp.rows)) return resp.rows;
  if (resp.data) {
    if (Array.isArray(resp.data)) return resp.data;
    if (Array.isArray(resp.data?.rows)) return resp.data.rows;
    if (Array.isArray(resp.data?.items)) return resp.data.items;
    if (Array.isArray(resp.data?.users)) return resp.data.users;
    if (Array.isArray(resp.data?.result)) return resp.data.result;
  }
  if (Array.isArray(resp.items)) return resp.items;
  if (Array.isArray(resp.users)) return resp.users;
  for (const k of Object.keys(resp)) {
    const v = (resp as any)[k];
    if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
      return v;
    }
  }
  return [];
}

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

      const usersS   = pickRows(u).map(x => ({
        id: String(x.id),
        name: x.full_name ?? x.name ?? x.username ?? '',
        username: x.username,
        email: x.email,
        avatarUrl: x.avatar_url ?? x.avatarUrl,
      }));
      const artistsS = pickRows(a).map(x => ({
        id: String(x.id),
        name: x.artist_name ?? x.name ?? '',
        avatarUrl: x.avatar_url ?? x.avatarUrl,
      }));
      const songsS   = pickRows(s).map(x => ({
        id: String(x.id),
        title: x.title ?? '',
        audioUrl: x.audio_url ?? x.audioUrl ?? x.url ?? '',
        artwork: x.artwork,
        artist: x.artist_name ?? x.artist,
      }));

      if (usersS.length || artistsS.length || songsS.length) {
        return {
          users: usersS.slice(0, 10),
          artists: artistsS.slice(0, 10),
          songs: songsS.slice(0, 10),
        };
      }
    } catch (e) {
      console.log('[Search] /search endpoints no disponibles; fallback. Motivo:', (e as Error)?.message);
    }
    let usersResp: any = null;
    try {
      usersResp = await api.get<any>('/app_user');
    } catch {
      try {
        usersResp = await api.get<any>('/users', { params: { limit: 500 } });
      } catch {
        try {
          usersResp = await api.get<any>('/users/list', { params: { limit: 500 } });
        } catch {
          usersResp = { rows: [] };
        }
      }
    }

    const [artistsResp, songsResp] = await Promise.all([
      api.get<any>('/artists').catch(() => ({ rows: [] })),
      api.get<any>('/songs', { params: { limit: 500, offset: 0 } }).catch(() => ({ rows: [] })),
    ]);

    try { console.log('[Search] raw users resp =>', JSON.stringify(usersResp).slice(0, 400)); } catch {}
    try { console.log('[Search] raw artists resp =>', JSON.stringify(artistsResp).slice(0, 200)); } catch {}
    try { console.log('[Search] raw songs resp =>', JSON.stringify(songsResp).slice(0, 200)); } catch {}

    const usersRaw   = pickRows(usersResp);
    const artistsRaw = pickRows(artistsResp);
    const songsRaw   = pickRows(songsResp);

    console.log('[Search] fallback fetch counts =>', { users: usersRaw.length, artists: artistsRaw.length, songs: songsRaw.length });

    const users: SearchUser[] = usersRaw
      .filter((u: any) =>
        contains(u.username,  query) ||
        contains(u.full_name, query) ||
        contains(u.name,      query) ||
        contains(u.email,     query)
      )
      .slice(0, 10)
      .map((u: any) => ({
        id: String(u.id),
        name: u.full_name ?? u.name ?? u.username ?? '',
        username: u.username,
        email: u.email,
        avatarUrl: u.avatar_url ?? u.avatarUrl,
      }));

    const artists: SearchArtist[] = artistsRaw
      .filter((a: any) => contains(a.artist_name ?? a.name, query))
      .slice(0, 10)
      .map((a: any) => ({
        id: String(a.id),
        name: a.artist_name ?? a.name ?? '',
        avatarUrl: a.avatar_url ?? a.avatarUrl,
      }));

    const songs: SearchSong[] = songsRaw
      .filter((s: any) =>
        contains(s.title, query) ||
        contains(s.artist_name ?? s.artist, query)
      )
      .slice(0, 10)
      .map((s: any) => ({
        id: String(s.id),
        title: s.title ?? '',
        audioUrl: s.audio_url ?? s.audioUrl ?? s.url ?? '',
        artwork: s.artwork,
        artist: s.artist_name ?? s.artist,
      }));

    console.log('[Search] fallback filtered =>', { users: users.length, artists: artists.length, songs: songs.length });

    return { users, artists, songs };
  },
};
