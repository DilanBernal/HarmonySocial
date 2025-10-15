import { MongoClient, ServerApiVersion } from "mongodb";
import { DataSource } from "typeorm";
import AlbumEntity from "../entities/Sql/music/AlbumEntity";
import ArtistEntity from "../entities/Sql/music/ArtistEntity";
import MusicTheoryEntity from "../entities/Sql/music/MusicTheoryEntity";
import SongEntity from "../entities/Sql/music/SongEntity";
import { PermissionEntity, UserEntity, UserRoleEntity, RoleEntity, RolePermissionEntity } from "../entities/Sql";
import FriendshipEntity from "../entities/Sql/social/FriendshipEntity";
import UserFollowEntity from "../entities/Sql/social/UserFollowsUserEntity";
import envs from "./environment-vars";

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