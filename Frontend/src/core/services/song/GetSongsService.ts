import { Paginated } from '../../types/Paginated';
import { api } from '../../../services/api';
import { AppConfig } from '../../../config/AppConfig';
import ApiService from '../general/ApiService';

export type Song = {
  id: number;
  title: string;
  audioUrl: string;
  createdAt: string;
  // artwork: string;
  artwork?: string;
};

const BASE_URL = AppConfig.apiBaseUrl;

export type ApiEnvelope<T> = { success: boolean; data: T };
console.log(BASE_URL);

export const SongsService = {
  getById: (id: string) => api.get<Song>(`songs/${id}`),
  create: (dto: any) => api.post<Song>('songs', dto),

  listMine: (page = 1, limit = 20) =>
    // ApiService.get(`${BASE_URL}/songs/mine/list`, { params: { page, limit } }),
    api.get<ApiEnvelope<Paginated<Song>>>('songs/mine/list', {
      params: { page, limit },
    }),
};

export class GetSongsService {
  constructor() {}

  getSongStreamUrl(blobname: string): string {
    console.log(blobname);
    return `${AppConfig.apiBaseUrl.replace(
      /\/$/,
      '',
    )}/file/song?id=${encodeURIComponent(blobname)}`;
  }

  async listMine(page: number, limit: number) {
    const result = await ApiService.get(`${BASE_URL}/songs/mine/list`, {
      params: { page, limit },
    });
    console.log(result);
  }
}
