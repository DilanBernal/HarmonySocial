import { randomUUID } from "crypto";
import { SongPort } from "../../../domain/ports/data/SongPort";
import { Song, SongCreateDTO, SongUpdateDTO } from "../../../domain/models/Song";

export class InMemorySongRepository implements SongPort {
  private items: Song[] = [];

  async search(query = "", page = 1, limit = 20) {
    const q = (query ?? "").trim().toLowerCase();
    const filtered = q
      ? this.items.filter((s) =>
          [s.title, s.artist, s.genre ?? "", s.album ?? ""].join(" ").toLowerCase().includes(q)
        )
      : this.items;

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    return { data, total, page, limit };
  }

  async getById(id: string) {
    return this.items.find((s) => s.id === id) ?? null;
  }

  async create(dto: SongCreateDTO) {
    const now = new Date().toISOString();
    const s: Song = { id: randomUUID(), createdAt: now, updatedAt: now, ...dto };
    this.items.unshift(s);
    return s;
  }

  async update(id: string, dto: SongUpdateDTO) {
    const i = this.items.findIndex((s) => s.id === id);
    if (i === -1) return null;
    const updated: Song = { ...this.items[i], ...dto, updatedAt: new Date().toISOString() };
    this.items[i] = updated;
    return updated;
  }

  async delete(id: string) {
    const before = this.items.length;
    this.items = this.items.filter((s) => s.id !== id);
    return this.items.length < before;
  }
}
