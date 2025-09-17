import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import UserRoleEntity from "./UserRoleEntity";

@Entity({ name: "roles" })
@Index("UQ_role_name", ["name"], { unique: true })
export default class RoleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @OneToMany(() => UserRoleEntity, (ur) => ur.role)
  user_roles?: UserRoleEntity[];
}
