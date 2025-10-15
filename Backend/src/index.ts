import app from "./infrastructure/web/app";
import ServerBootstrap from "./infrastructure/bootstrap/server_bootstrap";
import { connectSqlDB, connectMongoDB, closeMongoDB, getMongoDB } from "./infrastructure/config/con_database";
import UserPreferencesAdapter from "./infrastructure/adapter/data/social/UserPreferencesAdapter";
import { Collection } from "mongodb";
import UserPreferences from "./domain/models/social/UserPreferences";

const server = new ServerBootstrap(app);

(async () => {
  try {
    await connectSqlDB();
    await connectMongoDB();

    process.on("SIGINT", async () => {
      await closeMongoDB();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await closeMongoDB();
      process.exit(0);
    });

    const collection: Collection<UserPreferences> = getMongoDB().collection<UserPreferences>("user_preferences")
    const userPAdapter = new UserPreferencesAdapter(collection);

    await userPAdapter.addLikedPreferences(1, [{ name: "Black metal latino Blasphemo satanico", count: 120 }])
    await Promise.all([server.init()]);
  } catch (error) {
    console.error("Ha ocurrido un error iniciando la app", error);
    process.exit(1);
  }
})();
