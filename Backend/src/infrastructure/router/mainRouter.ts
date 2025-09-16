import express, { Router } from "express";
import path from "path";
import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";
import fileRouter from "./FileRouter";
import songsRouter from "./songs.routes";

const mainRouter = Router();

mainRouter.use("/uploads", express.static(path.join(__dirname, "uploads")));
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);
mainRouter.use("/file", fileRouter);
mainRouter.use("/songs", songsRouter);

mainRouter.get("/ping", (_req, res) => res.send("Pong!"));

export default mainRouter;
