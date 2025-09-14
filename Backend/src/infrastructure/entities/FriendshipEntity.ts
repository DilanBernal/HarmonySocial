// Backend/src/infrastructure/entities/FriendshipEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

/**
 * FriendshipEntity
 * - Representa la tabla que guarda las relaciones de seguimiento (follower -> followed).
 * - Campos: id, followerId, followedId, createdAt.
 * - El índice único evita que un usuario siga a otro más de una vez.
 */
@Entity({ name: "friendships" })
@Index(["followerId", "followedId"], { unique: true }) // evita duplicados
export default class FriendshipEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  followerId!: number;

  @Column({ type: "int" })
  followedId!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
