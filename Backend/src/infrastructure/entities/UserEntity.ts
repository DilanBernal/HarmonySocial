import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { UserInstrument, UserStatus } from "../../domain/models/User";

@Entity({ name: "app_user" })
@Index("IDX_user_email_status", ["email", "status"], { unique: true })
@Index("IDX_user_username_status", ["username", "status"], { unique: true })
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  username!: string;

  @Column({ type: "varchar", length: 50, default: "" })
  normalized_username!: string;

  @Column({ type: "varchar" })
  full_name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 100, default: "" })
  normalized_email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 255 })
  profile_image!: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ type: "enum", enum: UserInstrument })
  favorite_instrument!: UserInstrument;

  @Column({ type: "int" })
  learning_points!: number;

  @Column({ type: "boolean" })
  is_artist!: boolean;

  @Column({ type: "varchar", length: 36, nullable: true })
  concurrency_stamp!: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  security_stamp!: string;

  @Column({ type: "timestamp" })
  created_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.username) this.normalized_username = this.username.toUpperCase();
    if (this.email) this.normalized_email = this.email.toUpperCase();
  }
}
