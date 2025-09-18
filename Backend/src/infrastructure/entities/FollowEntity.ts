import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import UserEntity from "./UserEntity"; 

@Entity({ name: "user_follows_user" })
@Unique(["followerId", "followedId"])
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "follower_id" })
  followerId!: number;

  @Column({ name: "followed_id" })
  followedId!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "follower_id" })
  follower!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "followed_id" })
  followed!: UserEntity;
}
