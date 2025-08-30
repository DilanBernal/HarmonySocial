import express from "express";
import routes from "../router/UserRoutes";

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes()
  }

  private middlewares(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api", routes);
  }

  getApp(): express.Application {
    return this.app;
  }
}

export default new App().getApp();
