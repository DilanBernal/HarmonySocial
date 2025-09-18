import { Paginated } from '../core/types/Paginated';
import { api } from './api';

export type Song = {
  id: number;
  title: string;
  audioUrl: string;
  createdAt: string;
};

export type ApiEnvelope<T> = { success: boolean; data: T };

export const SongsService = {
  create: (dto: any) => api.post<Song>('/songs', dto),

  // GET /api/songs/mine/list => { success, data: { rows, total, page, limit } }
  listMine: (page = 1, limit = 20) =>
    api.get<ApiEnvelope<Paginated<Song>>>('/songs/mine/list', {
      params: { page, limit },
    }),
};
