import {
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserStatus } from "../../domain/models/seg/User";

/**
 * @deprecated DEPRECATED: Mantener solo para compatibilidad de datos; no usar en nueva lógica.
 */
@Entity({ name: "artist_user" })
export default class ArtistUserEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 50 })
  full_name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 100, default: "" })
  normalized_email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ type: "varchar", length: 36, nullable: true })
  concurrency_stamp!: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  security_stamp!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.email && this.normalized_email !== this.email.toUpperCase()) {
      this.normalized_email = this.email.toUpperCase();
    }
  }
}
