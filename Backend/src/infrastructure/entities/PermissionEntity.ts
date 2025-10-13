import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import RolePermissionEntity from "./RolePermissionEntity";
// import RolePermissionEntity from "./RolePermissionEntity";

@Entity({ name: "permissions", schema: "seg" })
@Index("UQ_permission_name", ["name"], { unique: true })
export default class PermissionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string; // e.g., artist.accept

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  role_permissions?: RolePermissionEntity[];
}
