import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { FrienshipStatus } from "../../domain/models/Friendship";

@Entity({ name: "friendships" })
export default class FriendshipEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  user_id!: number;

  @Column({ type: "int" })
  friend_id!: number;

  @Column({ type: "enum", enum: FrienshipStatus, default: "PENDING" })
  status!: FrienshipStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;
}
