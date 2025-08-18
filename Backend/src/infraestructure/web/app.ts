import express from "express";

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  getApp(): express.Application {
    return this.app;
  }
}

export default new App().getApp();
