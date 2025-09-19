import { api } from './api';

export type Artist = {
  id: string;
  artist_name: string;
  verified?: boolean;
  formation_year?: number;
  country_code?: string;
  status?: string;
  avatarUrl?: string;
};

export const ArtistsService = {
  getById: (id: string) => api.get<Artist>(`/artists/${id}`),

  getByName: async (name: string) => {
    const r = await api.get<{ rows: Artist[] }>(`/artists/search`, { params: { q: name, limit: 1 } });
    return r?.rows?.[0] ?? null;
  },
};
