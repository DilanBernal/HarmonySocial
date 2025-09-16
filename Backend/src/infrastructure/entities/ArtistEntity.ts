import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import ArtistUserEntity from "./ArtistUserEntity";

@Entity({ name: "artists" })
export default class ArtistEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => ArtistUserEntity, { nullable: true })
  @JoinColumn({ name: "artist_user_id" })
  artist_user_id?: ArtistUserEntity | null;

  @Column({ type: "character varying" })
  artist_name!: string;

  @Column({ type: "text", nullable: true })
  biography?: string;

  @Column({ type: "boolean", default: false })
  verified!: boolean;

  @Column({ type: "int" })
  formation_year!: number;

  @Column({ type: "character varying", length: 6, nullable: true })
  country_code?: string;

  @Column({ type: "enum", enum: ["ACTIVE", "DELETED"], default: "ACTIVE" })
  status!: "ACTIVE" | "DELETED";

  @CreateDateColumn({ type: "timestamp", nullable: false })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;
}
