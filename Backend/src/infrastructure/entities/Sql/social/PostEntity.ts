import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import UserEntity from "../seg/UserEntity";
import SongEntity from "../music/SongEntity";

@Entity({ name: 'post', schema: "social" })
export default class PostEntity {
  @PrimaryGeneratedColumn({ type: "bigint", primaryKeyConstraintName: "PK_post_id" })
  id!: number;

  @Index("IDX_post_user_id")
  @ManyToOne(() => UserEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Index("IDX_post_song_id")
  @ManyToOne(() => SongEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "song_id" })
  song!: SongEntity;

  @Index("IDX_post_publication_date")
  @Column({ type: "timestamp", nullable: true })
  publication_date!: Date;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 255 })
  short_description!: string;

  @Column({ type: "bigint" })
  comments_number!: number;

  @Column({ type: "bigint" })
  likes_number!: number;

  @CreateDateColumn({ nullable: false, type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ nullable: true, type: "timestamp", default: null })
  updated_at?: Date;
}