import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { ArtistStatus } from "../../domain/models/Artist";

@Entity({ name: "artists" })
@Index("IDX_artist_name_status", ["artist_name", "status"])
export default class ArtistEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  artist_name!: string;

  @Column({ type: "text", nullable: true })
  biography?: string;

  @Column({ type: "int" })
  formation_year!: number;

  @Column({ type: "varchar", length: 6, nullable: true })
  country_code?: string;

  @Column({ type: "boolean", default: false })
  verified!: boolean;

  @Column({ type: "enum", enum: ArtistStatus, default: ArtistStatus.PENDING })
  status!: ArtistStatus;

  @Column({ type: "timestamp" })
  created_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @Column({ type: "int", name: "user_id", nullable: true })
  user_id?: number; // usuario propietario que solicitó el perfil
}
