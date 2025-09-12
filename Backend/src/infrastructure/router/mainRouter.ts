import express, { Request, Router } from "express";
import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";
import multer from "multer";
import path from "path";
import FileAdapter from "../adapter/utils/FileAdapter";
import fileRouter from "./FileRouter";

const mainRouter = Router();

mainRouter.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registrar rutas
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);
mainRouter.use("/file", fileRouter);
mainRouter.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default mainRouter;
