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
import UserEntity from "./UserEntity";

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
}
