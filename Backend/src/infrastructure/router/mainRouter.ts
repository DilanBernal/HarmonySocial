import express, { Request, Router } from "express";
import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";
import multer from "multer";
import path from "path";
import FileAdapter from "../adapter/utils/FileAdapter";
import fileRouter from "./FileRouter";

// ⬇️ importa tu router de canciones
import songsRouter from "./songs.routes";

const mainRouter = Router();

mainRouter.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registrar rutas
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);
mainRouter.use("/file", fileRouter);

// ⬇️ monta las rutas de canciones en /api/songs
mainRouter.use("/songs", songsRouter);

mainRouter.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default mainRouter;
