import { DataSource } from "typeorm";
import UserEntity from "../entities/UserEntity";
import FriendshipEntity from "../entities/FriendshipEntity";
import SongEntity from "../entities/SongEntity";
import envs from "./environment-vars";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.DB_HOST,
  port: Number(envs.DB_PORT),
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: envs.DB_SYNC,
  logging: envs.ENVIRONMENT === "dev" ? true : false,
  schema: envs.DB_SCHEMA,
  entities: [UserEntity, FriendshipEntity, SongEntity],
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to the DB", error);
    process.exit(1);
  }
};
