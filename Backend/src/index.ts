import app from "./infraestructure/web/app";
import ServerBootstrap from "./infraestructure/bootstrap/server_bootstrap";
import { connectDB } from "./infraestructure/config/con_database";

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
