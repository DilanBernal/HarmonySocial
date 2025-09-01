import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { UserInstrument, UserStatus } from "../../domain/models/User";

@Entity({ name: "app_user" })
@Index("IDX_user_email_status", ["email", "status"], { unique: true })
@Index("IDX_user_username_status", ["username", "status"], { unique: true })
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  username!: string;

  @Column({ type: "varchar" })
  full_name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

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

  @Column({ type: "timestamp" })
  created_at!: Date;

  @Column({ type: "timestamp" })
  updated_at?: Date;
}
