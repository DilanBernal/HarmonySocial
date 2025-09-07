import express from "express";
import mainRouter from "../router/mainRouter";

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api", mainRouter);
  }

  getApp(): express.Application {
    return this.app;
  }
}

export default new App().getApp();
