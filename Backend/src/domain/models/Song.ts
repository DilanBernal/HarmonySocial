export type Song = {
  id: string;              
  title: string;
  artist: string;
  album?: string | null;
  durationSec?: number;
  genre?: string | null;
  coverUrl?: string | null;
  audioUrl?: string | null;
  createdAt: string;       
  updatedAt: string;       
};

export type SongCreateDTO = {
  title: string;
  artist: string;
  album?: string | null;
  durationSec?: number;
  genre?: string | null;
  coverUrl?: string | null;
  audioUrl?: string | null;
};

export type SongUpdateDTO = Partial<SongCreateDTO>;
