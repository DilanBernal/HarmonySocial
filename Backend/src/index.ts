import app from "./infrastructure/web/app";
import ServerBootstrap from "./infrastructure/bootstrap/server_bootstrap";
import { connectDB } from "./infrastructure/config/con_database";

const server = new ServerBootstrap(app);

(async () => {
  try {
    await connectDB();
    const instances = [server.init()];
    await Promise.all(instances);
  } catch (error) {
    console.error("Ha ocurrido un error iniciando la app", error);
  }
})();
