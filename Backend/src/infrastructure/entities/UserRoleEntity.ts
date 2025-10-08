import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from "typeorm";
import UserEntity from "./UserEntity";
import RoleEntity from "./RoleEntity";

@Entity({ name: "user_roles", schema: "seg" })
@Unique("UQ_user_role", ["user", "role"])
export default class UserRoleEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @ManyToOne(() => UserEntity, { eager: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => RoleEntity, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id" })
  role!: RoleEntity;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
