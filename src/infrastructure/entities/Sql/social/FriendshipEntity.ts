import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import Friendship, { FrienshipStatus } from "../../../../domain/models/social/Friendship";
import UserEntity from "../seg/UserEntity";

@Entity({ name: "friendship", schema: "social" })
@Index(["user", "friend", "status"], { unique: true })
export default class FriendshipEntity {
  @PrimaryGeneratedColumn({ type: "bigint", primaryKeyConstraintName: "PK_Friendship_id" })
  id!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id", foreignKeyConstraintName: "FK_user_id" })
  user: UserEntity = new UserEntity();

  @RelationId((f: FriendshipEntity) => f.user)
  user_id!: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "friend_id", foreignKeyConstraintName: "FK_friend_id" })
  friend: UserEntity = new UserEntity();

  @RelationId((f: FriendshipEntity) => f.friend)
  friend_id!: number;

  @Column({ type: "enum", enum: FrienshipStatus, default: "PENDING" })
  status!: FrienshipStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;

  /**
   * Converts this entity to a domain object
   */
  toDomain(): Friendship {
    return new Friendship(
      this.id,
      this.user_id,
      this.friend_id,
      this.status,
      this.created_at,
      this.updated_at,
    );
  }

  /**
   * Creates an entity from a domain object
   */
  static fromDomain(domain: Friendship): FriendshipEntity {
    const entity = new FriendshipEntity();
    entity.id = domain.id;
    // Set the relation objects which will populate the foreign keys
    entity.user = { id: domain.userId } as UserEntity;
    entity.friend = { id: domain.friendId } as UserEntity;
    entity.status = domain.status;
    entity.created_at = domain.createdAt;
    entity.updated_at = domain.updatedAt;
    return entity;
  }
}
