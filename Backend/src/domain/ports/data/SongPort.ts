import { Song } from "../../models/Song";
import { SongCreateDTO } from "../../../application/dto/requests/Song/SongCreateRequestDto";
import { SongUpdateDTO } from "../../../application/dto/requests/Song/SongUpdateRequestDto";

export interface SongPort {
  search(query: string, page: number, limit: number): Promise<{ data: Song[]; total: number; page: number; limit: number }>;
  getById(id: number): Promise<Song | null>;
  create(dto: SongCreateDTO): Promise<Song>;
  update(id: number, dto: SongUpdateDTO): Promise<Song | null>;
  delete(id: number): Promise<boolean>;
}
