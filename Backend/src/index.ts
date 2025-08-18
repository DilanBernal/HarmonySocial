import app from "./infraestructure/web/app";
import ServerBootstrap from "./infraestructure/bootstrap/server_bootstrap";

const server = new ServerBootstrap(app);

(async () => {
  try {
    const instances = [server.init()];
  } catch (error) {
    console.error("Ha ocurrido un error iniciando la app", error);
  }
})();
