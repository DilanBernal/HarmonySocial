import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import RoleEntity from "./RoleEntity";
import PermissionEntity from "./PermissionEntity";

@Entity({ name: "role_permissions" })
@Unique("UQ_role_permission", ["role", "permission"])
export default class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => RoleEntity, { eager: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id" })
  role!: RoleEntity;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_id" })
  permission!: PermissionEntity;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
