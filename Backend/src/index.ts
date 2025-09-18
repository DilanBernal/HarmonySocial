import app from "./infrastructure/web/app";
import ServerBootstrap from "./infrastructure/bootstrap/server_bootstrap";
import { connectDB } from "./infrastructure/config/con_database";
import songsRouter from "./infrastructure/router/songs.routes";

app.use("/api/songs", songsRouter);

const server = new ServerBootstrap(app);

(async () => {
  try {
    await connectDB();
    await Promise.all([server.init()]);
  } catch (error) {
    console.error("Ha ocurrido un error iniciando la app", error);
  }
})();
