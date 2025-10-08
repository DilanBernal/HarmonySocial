import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserEntity from "./UserEntity";

@Entity({ name: "user_follows", schema: "social" })
export default class UserFollowEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "follower_id" })
  follower!: UserEntity;
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "followed_id" })
  followed!: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
