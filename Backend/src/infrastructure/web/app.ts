import express from "express";
import cors from "cors";
import mainRouter from "../router/mainRouter";
import envs from "../config/environment-vars";

class App {
  private app = express();

  constructor() {
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use((req, _res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
      next();
    });

    // Permite llamadas desde el móvil / web local
    this.app.use(
      cors({
        origin: [
          /^http:\/\/localhost:\d+$/,
          /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
          envs.ALLOWED_URLS,
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/api", mainRouter);
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();
