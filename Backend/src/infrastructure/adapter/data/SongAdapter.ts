// src/infrastructure/adapter/data/SongAdapter.ts
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/con_database";
import SongEntity from "../../entities/SongEntity";
import { SongPort } from "../../../domain/ports/data/SongPort";
import { Song } from "../../../domain/models/Song";
import { SongCreateDTO } from "../../../application/dto/requests/Song/SongCreateRequestDto";
import { SongUpdateDTO } from "../../../application/dto/requests/Song/SongUpdateRequestDto";

export default class SongAdapter implements SongPort {
  private repo: Repository<SongEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(SongEntity);
  }

  private toDomain(e: SongEntity): Song {
    return {
      id: e.id,
      title: e.title,
      audioUrl: e.audioUrl,
      description: e.description ?? null,
      duration: e.duration ?? null,
      bpm: e.bpm ?? null,
      keyNote: e.keyNote ?? null,
      album: e.album ?? null,
      decade: e.decade ?? null,
      genre: e.genre ?? null,
      country: e.country ?? null,
      instruments: e.instruments ?? null,
      difficultyLevel: e.difficultyLevel ?? null,
      artistId: e.artistId ?? null,
      userId: e.userId ?? null,
      verifiedByArtist: e.verifiedByArtist,
      verifiedByUsers: e.verifiedByUsers,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt ? e.updatedAt.toISOString() : null,
    };
  }

  async search(query = "", page = 1, limit = 20) {
    const qb = this.repo.createQueryBuilder("s");
    const q = (query ?? "").trim();
    if (q) {
      qb.where(
        `(
          s.title ILIKE :q OR s.description ILIKE :q OR s.album ILIKE :q OR
          s.genre ILIKE :q OR s.country ILIKE :q OR s.decade ILIKE :q OR
          s.key_note ILIKE :q
        )`,
        { q: `%${q}%` }
      );
    }
    qb.orderBy("s.created_at", "DESC").skip((page - 1) * limit).take(limit);
    const [rows, count] = await qb.getManyAndCount();
    return { data: rows.map((r) => this.toDomain(r)), total: count, page, limit };
  }

  async getById(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    return e ? this.toDomain(e) : null;
  }

  async create(dto: SongCreateDTO) {
    const e = this.repo.create({
      title: dto.title,
      audioUrl: dto.audioUrl,
      description: dto.description ?? null,
      duration: dto.duration ?? null,
      bpm: dto.bpm ?? null,
      keyNote: dto.keyNote ?? null,
      album: dto.album ?? null,
      decade: dto.decade ?? null,
      genre: dto.genre ?? null,
      country: dto.country ?? null,
      instruments: dto.instruments ?? null,
      difficultyLevel: dto.difficultyLevel ?? null,
      artistId: dto.artistId ?? null,
      userId: dto.userId ?? null,
      verifiedByArtist: dto.verifiedByArtist ?? false,
      verifiedByUsers: dto.verifiedByUsers ?? false,
    });
    const saved = await this.repo.save(e);
    return this.toDomain(saved);
  }

  async update(id: number, dto: SongUpdateDTO) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) return null;

    if (dto.title !== undefined) e.title = dto.title;
    if (dto.audioUrl !== undefined) e.audioUrl = dto.audioUrl;
    if (dto.description !== undefined) e.description = dto.description ?? null;
    if (dto.duration !== undefined) e.duration = dto.duration ?? null;
    if (dto.bpm !== undefined) e.bpm = dto.bpm ?? null;
    if (dto.keyNote !== undefined) e.keyNote = dto.keyNote ?? null;
    if (dto.album !== undefined) e.album = dto.album ?? null;
    if (dto.decade !== undefined) e.decade = dto.decade ?? null;
    if (dto.genre !== undefined) e.genre = dto.genre ?? null;
    if (dto.country !== undefined) e.country = dto.country ?? null;
    if (dto.instruments !== undefined) e.instruments = dto.instruments ?? null;
    if (dto.difficultyLevel !== undefined) e.difficultyLevel = dto.difficultyLevel ?? null;
    if (dto.artistId !== undefined) e.artistId = dto.artistId ?? null;
    if (dto.userId !== undefined) e.userId = dto.userId ?? null;
    if (dto.verifiedByArtist !== undefined) e.verifiedByArtist = !!dto.verifiedByArtist;
    if (dto.verifiedByUsers !== undefined) e.verifiedByUsers = !!dto.verifiedByUsers;

    const saved = await this.repo.save(e);
    return this.toDomain(saved);
  }

  async delete(id: number) {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}
