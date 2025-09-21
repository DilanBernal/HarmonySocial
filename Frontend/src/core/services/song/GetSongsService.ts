import { Paginated } from '../../types/Paginated';
import { api } from '../../../services/api';
import { AppConfig } from '../../../config/AppConfig';

export type Song = {
  id: number;
  title: string;
  audioUrl: string;
  createdAt: string;
  // artwork: string;
  artwork?: string;
  
};

export type ApiEnvelope<T> = { success: boolean; data: T };

export const SongsService = {
  getById: (id: string) => api.get<Song>(`/songs/${id}`),
  create: (dto: any) => api.post<Song>('/songs', dto),

  listMine: (page = 1, limit = 20) =>
    api.get<ApiEnvelope<Paginated<Song>>>('/songs/mine/list', {
      params: { page, limit },
    }),
};

export class getSongsService {
  constructor() {}

  getSongStreamUrl(blobname: string): string {
    return `${AppConfig.apiBaseUrl.replace(
      /\/$/,
      '',
    )}/file/song?id=${encodeURIComponent(blobname)}`;
  }
}
