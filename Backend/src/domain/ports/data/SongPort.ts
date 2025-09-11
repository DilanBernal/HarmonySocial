import { Song, SongCreateDTO, SongUpdateDTO } from "../../models/Song";

export interface SongPort {
  search(query: string, page: number, limit: number): Promise<{ data: Song[]; total: number; page: number; limit: number }>;
  getById(id: string): Promise<Song | null>;
  create(dto: SongCreateDTO): Promise<Song>;
  update(id: string, dto: SongUpdateDTO): Promise<Song | null>;
  delete(id: string): Promise<boolean>;
}
