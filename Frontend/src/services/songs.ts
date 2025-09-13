import { api } from "./api";

export type SongCreateDTO = {
  title: string;
  audioUrl: string;
  description?: string | null;
  duration?: number | null;
  bpm?: number | null;
  keyNote?: string | null;
  album?: string | null;
  decade?: string | null;
  genre?: string | null;
  country?: string | null;
  instruments?: unknown | null;
  difficultyLevel?: "EASY" | "INTERMEDIATE" | "HARD" | null;
  artistId?: number | null;
  userId?: number | null;
  verifiedByArtist?: boolean;
  verifiedByUsers?: boolean;
};

export type Song = {
  id: number;
  title: string;
  audioUrl: string;
  createdAt: string;
};

export const SongsService = {
  create: (dto: SongCreateDTO) => api.post<Song>("/songs", dto),
};
