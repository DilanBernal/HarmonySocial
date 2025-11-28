import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import ArtistEntity from "./ArtistEntity";
import AlbumEntity from "./AlbumEntity";
import UserEntity from "../seg/UserEntity";
import Song, { SongDifficultyLevel } from "../../../../domain/models/music/Song";

@Entity({ name: "songs", schema: "music" })
export default class SongEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 100 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ name: "audio_url", type: "varchar", length: 255 })
  audioUrl!: string;

  @Column({ type: "int", nullable: true })
  duration?: number | null;

  @Column({ type: "int", nullable: true })
  bpm?: number | null;

  @Column({ name: "key_note", type: "varchar", length: 10, nullable: true })
  keyNote?: string | null;

  @ManyToOne(() => AlbumEntity)
  @JoinColumn({ name: "album_id" })
  album?: AlbumEntity;

  @Column({ type: "int", nullable: true })
  decade?: number | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  genre?: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  country?: string | null;

  @Column({ type: "jsonb", nullable: true })
  instruments?: unknown | null;

  @Column({ name: "difficulty_level", type: "varchar", length: 20, nullable: true })
  difficultyLevel?: "EASY" | "INTERMEDIATE" | "HARD" | null;

  @Column({ name: "artist_id", type: "int", nullable: true })
  artistId?: number | null;

  @Column({ name: "user_id", type: "int", nullable: true })
  userId?: number | null;

  @Column({ name: "verified_by_artist", type: "boolean", default: false })
  verifiedByArtist!: boolean;

  @Column({ name: "verified_by_users", type: "boolean", default: false })
  verifiedByUsers!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @ManyToOne(() => ArtistEntity)
  @JoinColumn({ name: "artist_id" })
  artist!: ArtistEntity | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity | null;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone", nullable: true })
  updatedAt!: Date | null;

  /**
   * Converts this entity to a domain object
   */
  toDomain(): Song {
    return new Song(
      this.id,
      this.title,
      this.audioUrl,
      this.verifiedByArtist,
      this.verifiedByUsers,
      this.createdAt,
      this.updatedAt,
      this.description,
      this.duration,
      this.bpm,
      this.keyNote,
      this.album?.title ?? null,
      this.decade?.toString() ?? null,
      this.genre,
      this.country,
      this.instruments,
      this.difficultyLevel as SongDifficultyLevel | null,
      this.artistId,
      this.userId,
    );
  }

  /**
   * Creates an entity from a domain object
   */
  static fromDomain(domain: Song): SongEntity {
    const entity = new SongEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.audioUrl = domain.audioUrl;
    entity.verifiedByArtist = domain.verifiedByArtist;
    entity.verifiedByUsers = domain.verifiedByUsers;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt ?? null;
    entity.description = domain.description;
    entity.duration = domain.duration;
    entity.bpm = domain.bpm;
    entity.keyNote = domain.keyNote;
    if (domain.decade) {
      const decadeNum = Number(domain.decade);
      entity.decade = !isNaN(decadeNum) ? decadeNum : null;
    } else {
      entity.decade = null;
    }
    entity.genre = domain.genre;
    entity.country = domain.country;
    entity.instruments = domain.instruments;
    entity.difficultyLevel = domain.difficultyLevel;
    entity.artistId = domain.artistId;
    entity.userId = domain.userId;
    return entity;
  }
}
