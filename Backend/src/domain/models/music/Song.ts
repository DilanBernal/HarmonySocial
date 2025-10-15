export type Song = {
  id: number;
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

  createdAt: string;
  updatedAt?: string | null;
};
