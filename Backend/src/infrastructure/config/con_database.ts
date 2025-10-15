import { DataSource } from "typeorm";
import UserEntity from "../entities/UserEntity";
import FriendshipEntity from "../entities/FriendshipEntity";
import SongEntity from "../entities/SongEntity";
import envs from "./environment-vars";
import ArtistEntity from "../entities/ArtistEntity";
import RoleEntity from "../entities/RoleEntity";
import UserRoleEntity from "../entities/UserRoleEntity";
import PermissionEntity from "../entities/PermissionEntity";
import RolePermissionEntity from "../entities/RolePermissionEntity";
import UserFollowEntity from "../entities/UserFollowsUserEntity";
import AlbumEntity from "../entities/AlbumEntity";
import MusicTheoryEntity from "../entities/MusicTheoryEntity";
import { MongoClient, ServerApiVersion } from "mongodb";
import e from "express";

export const SqlAppDataSource = new DataSource({
  type: "postgres",
  host: envs.DB_HOST,
  port: Number(envs.DB_PG_PORT),
  username: envs.DB_PG_USER,
  password: envs.DB_PG_PASSWORD,
  database: envs.DB_PG_NAME,
  synchronize: envs.DB_PG_SYNC,
  logging: envs.ENVIRONMENT === "dev" ? true : false,
  schema: envs.DB_PG_SCHEMA,
  entities: [
    UserEntity,
    FriendshipEntity,
    SongEntity,
    ArtistEntity,
    RoleEntity,
    UserRoleEntity,
    PermissionEntity,
    RolePermissionEntity,
    UserFollowEntity,
    AlbumEntity,
    MusicTheoryEntity
  ],
});

export const connectSqlDB = async () => {
  try {
    await SqlAppDataSource.initialize();
  } catch (error) {
    console.error("Error connecting to the DB", error);
    process.exit(1);
  }
};

export const connectMongoDB = async () => {
  const client = new MongoClient(envs.DB_MONGO_CON_STRING, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
    }
  });

  try {
    return await client.connect();

  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
  }
}