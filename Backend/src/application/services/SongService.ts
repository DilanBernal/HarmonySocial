import { SongPort } from "../../domain/ports/data/SongPort";
import { Song, } from "../../domain/models/Song";
import { SongCreateDTO } from "../dto/requests/Song/SongCreateRequestDto";
import { SongUpdateDTO } from "../dto/requests/Song/SongUpdateRequestDto";

export class SongService {
  constructor(private repo: SongPort) {}

  search(query = "", page = 1, limit = 20) {
    return this.repo.search(query, page, limit);
  }
  getById(id: number) { return this.repo.getById(id); }

  create(dto: SongCreateDTO): Promise<Song> {
    if (!dto.title?.trim()) throw new Error("title is required");
    if (!dto.audioUrl?.trim()) throw new Error("audioUrl is required");
    return this.repo.create(dto);
  }

  update(id: number, dto: SongUpdateDTO) { return this.repo.update(id, dto); }
  delete(id: number) { return this.repo.delete(id); }
}
