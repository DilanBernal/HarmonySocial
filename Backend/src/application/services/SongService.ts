import SongAdapter, { CreateSongDTO, UpdateSongDTO } from "../../infrastructure/adapter/data/SongAdapter";
import SongEntity from "../../infrastructure/entities/SongEntity";

export default class SongService {
  constructor(private readonly songs: SongAdapter) {}

  async create(dto: CreateSongDTO): Promise<SongEntity> {
    if (!dto?.title?.trim()) throw new Error("title es requerido");
    if (!dto?.audioUrl?.trim()) throw new Error("audioUrl es requerido");
    return this.songs.create({
      ...dto,
      title: dto.title.trim(),
      audioUrl: dto.audioUrl.trim(),
    });
  }

  async getById(id: number) {
    if (!Number.isFinite(id)) throw new Error("id inválido");
    return this.songs.getById(id);
  }

  async search(query = "", page = 1, limit = 20) {
    return this.songs.search(query, page, limit);
  }

  async update(id: number, dto: UpdateSongDTO) {
    if (!Number.isFinite(id)) throw new Error("id inválido");
    return this.songs.update(id, dto);
  }

  async delete(id: number) {
    if (!Number.isFinite(id)) throw new Error("id inválido");
    return this.songs.delete(id);
  }
}
