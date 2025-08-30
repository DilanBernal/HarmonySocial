import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserInstrument, UserStatus } from "../../domain/models/User";

@Entity({ name: "user" })
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  username!: string;

  @Column({ type: "varchar" })
  full_name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
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