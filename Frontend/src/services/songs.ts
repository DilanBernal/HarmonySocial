import HttpClient from '../core/services/HttpClient';
import { AppConfig } from '../config/AppConfig';
import { Observable } from 'rxjs';
import { HttpResponse } from '../core/models/utils/HttpResponse';

export interface CreateSongData {
  title: string;
  artist: string;
  description?: string | null;
  audioUrl: string;
  duration?: number | null;
  bpm?: number | null;
  decade?: number | null;
  country?: string | null;
  genre?: string | null;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  description?: string;
  audioUrl: string;
  duration?: number;
  bpm?: number;
  decade?: number;
  country?: string;
  genre?: string;
  createdAt: string;
  updatedAt: string;
}

class SongsService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(AppConfig.apiBaseUrl);
  }

  createSong(data: CreateSongData): Observable<HttpResponse<Song>> {
    return this.httpClient.post<Song>('/songs', data);
  }

  getSongs(): Observable<HttpResponse<Song[]>> {
    return this.httpClient.get<Song[]>('/songs');
  }

  getSongById(id: string): Observable<HttpResponse<Song>> {
    return this.httpClient.get<Song>(`/songs/${id}`);
  }

  updateSong(
    id: string,
    data: Partial<CreateSongData>,
  ): Observable<HttpResponse<Song>> {
    return this.httpClient.put<Song>(`/songs/${id}`, data);
  }

  deleteSong(id: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(`/songs/${id}`);
  }
}

export const songsService = new SongsService();
