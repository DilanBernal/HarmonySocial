import { Repository, ILike } from "typeorm";
import { AppDataSource } from "../../config/con_database";
import SongEntity from "../../entities/SongEntity";

export type CreateSongDTO = {
  title: string;
  audioUrl: string;
  description?: string | null;
  genre?: string | null;
  artistId?: number | null;
  userId?: number | null;
  duration?: number | null;
  bpm?: number | null;
  keyNote?: string | null;
  album?: string | null;
  decade?: string | null;
  country?: string | null;
  instruments?: unknown | null;
};

export type UpdateSongDTO = Partial<CreateSongDTO>;

export default class SongAdapter {
  private readonly repo: Repository<SongEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(SongEntity);
  }

  async create(dto: CreateSongDTO): Promise<SongEntity> {
    const entity = this.repo.create({
      title: dto.title,
      audioUrl: dto.audioUrl,
      description: dto.description ?? null,
      genre: dto.genre ?? null,
      artistId: dto.artistId ?? null,
      userId: dto.userId ?? null,
      duration: dto.duration ?? null,
      bpm: dto.bpm ?? null,
      keyNote: dto.keyNote ?? null,
      album: dto.album ?? null,
      decade: dto.decade ?? null,
      country: dto.country ?? null,
      instruments: dto.instruments ?? null,
      verifiedByArtist: false,
      verifiedByUsers: false,
    });
    return await this.repo.save(entity);
  }

  async getById(id: number): Promise<SongEntity | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async search(query: string, page = 1, limit = 20): Promise<{ rows: SongEntity[]; total: number; page: number; limit: number; }> {
    const where = query
      ? [{ title: ILike(`%${query}%`) }, { genre: ILike(`%${query}%`) }]
      : undefined;

    const [rows, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { rows, total, page, limit };
  }

  async update(id: number, dto: UpdateSongDTO): Promise<SongEntity | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;

    this.repo.merge(found, {
      ...dto,
      // mantener flags si no vienen
      verifiedByArtist: dto.hasOwnProperty("verifiedByArtist")
        ? (dto as any).verifiedByArtist
        : found.verifiedByArtist,
      verifiedByUsers: dto.hasOwnProperty("verifiedByUsers")
        ? (dto as any).verifiedByUsers
        : found.verifiedByUsers,
    });

    return await this.repo.save(found);
  }

  async delete(id: number): Promise<boolean> {
    const r = await this.repo.delete(id);
    return (r.affected ?? 0) > 0;
  }
}
