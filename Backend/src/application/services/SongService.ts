import { SongPort } from "../../domain/ports/data/SongPort";
import { Song, SongCreateDTO, SongUpdateDTO } from "../../domain/models/Song";

export class SongService {
  constructor(private repo: SongPort) {}

  search(query = "", page = 1, limit = 20) {
    return this.repo.search(query, page, limit);
  }

  getById(id: string) {
    return this.repo.getById(id);
  }

  create(dto: SongCreateDTO): Promise<Song> {
    if (!dto.title || !dto.artist) throw new Error("title and artist are required");
    return this.repo.create(dto);
  }

  update(id: string, dto: SongUpdateDTO) {
    return this.repo.update(id, dto);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
