import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import User, { UserInstrument, UserStatus } from "../../../../domain/models/seg/User";

@Entity({ name: "app_user", schema: "seg" })
@Index("IDX_user_email_status", ["email", "status"], { unique: true })
@Index("IDX_user_username_status", ["username", "status"], { unique: true })
export default class UserEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 50 })
  username!: string;

  @Column({ type: "varchar", length: 50, default: "" })
  normalized_username!: string;

  @Column({ type: "varchar", nullable: true })
  full_name?: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 100, default: "" })
  normalized_email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 255 })
  profile_image!: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.FROZEN })
  status!: UserStatus;

  @Column({ type: "enum", enum: UserInstrument })
  favorite_instrument!: UserInstrument;

  @Column({ type: "int" })
  learning_points!: number;

  @Column({ type: "varchar", length: 36, nullable: true })
  concurrency_stamp!: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  security_stamp!: string;

  @Column({ type: "timestamp" })
  created_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.username && this.normalized_username !== this.username.toUpperCase()) {
      this.normalized_username = this.username.toUpperCase();
    }
    if (this.email && this.normalized_email !== this.email.toUpperCase()) {
      this.normalized_email = this.email.toUpperCase();
    }
  }

  public static toEntity(userDomain: User): UserEntity {
    const userEntity: UserEntity = new UserEntity();

    userEntity.id = userDomain.id;
    userEntity.username = userDomain.username;
    userEntity.full_name = userDomain.full_name;
    userEntity.email = userDomain.email;
    userEntity.password = userDomain.password;
    userEntity.profile_image = userDomain.profile_image;
    userEntity.status = userDomain.status;
    userEntity.favorite_instrument = userDomain.favorite_instrument;
    userEntity.learning_points = userDomain.learning_points;
    userEntity.concurrency_stamp = userDomain.concurrency_stamp;
    userEntity.created_at = userDomain.created_at;
    userEntity.updated_at = userDomain.updated_at;

    userEntity.normalizeFields();

    return userEntity;
  }

  public static toDomain(userEntity: UserEntity): User {
    const userDomain: User = new User(
      userEntity.id,
      userEntity.full_name,
      userEntity.email,
      userEntity.username,
      userEntity.password,
      userEntity.profile_image,
      userEntity.learning_points,
      userEntity.status,
      userEntity.favorite_instrument,
      userEntity.concurrency_stamp,
      userEntity.security_stamp,
      userEntity.updated_at,
      userEntity.created_at,
    );

    return userDomain;
  }

  public toDomain(): User {
    const userDomain: User = new User(
      this.id,
      this.full_name,
      this.email,
      this.username,
      this.password,
      this.profile_image,
      this.learning_points,
      this.status,
      this.favorite_instrument,
      this.concurrency_stamp,
      this.security_stamp,
      this.updated_at,
      this.created_at,
    );

    return userDomain;
  }
}
