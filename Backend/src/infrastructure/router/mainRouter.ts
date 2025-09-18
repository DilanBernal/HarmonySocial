import express, { Router } from "express";
import path from "path";
import multer from "multer";

import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";
import fileRouter from "./FileRouter";
import FollowRouter from "./FollowRouter"; 
import FileAdapter from "../adapter/utils/FileAdapter";

const mainRouter = Router();

// Servir archivos estáticos
mainRouter.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registrar rutas
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);
mainRouter.use("/file", fileRouter);
mainRouter.use("/user-follows", FollowRouter); 

// Healthcheck
mainRouter.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default mainRouter;
