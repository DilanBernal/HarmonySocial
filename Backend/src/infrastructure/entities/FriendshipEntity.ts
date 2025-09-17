import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { FrienshipStatus } from "../../domain/models/Friendship";
import UserEntity from "./UserEntity";

@Entity({ name: "friendships" })
@Index(["user", "friend", "status"], { unique: true })
export default class FriendshipEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @RelationId((f: FriendshipEntity) => f.user)
  user_id!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "friend_id" })
  friend!: UserEntity;

  @RelationId((f: FriendshipEntity) => f.friend)
  friend_id!: number;

  @Column({ type: "enum", enum: FrienshipStatus, default: "PENDING" })
  status!: FrienshipStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;
}
