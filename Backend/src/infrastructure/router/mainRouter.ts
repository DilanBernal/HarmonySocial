import express, { Router } from "express";
import path from "path";
import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";
import fileRouter from "./FileRouter";
import songsRouter from "./songs.routes";
import artistRouter from "./ArtistRouter";
import artistUserRouter from "./ArtistUserRouter";
import roleRouter from "./RoleRouter";
import userRoleRouter from "./UserRoleRouter";
import permissionRouter from "./PermissionRouter";
import rolePermissionRouter from "./RolePermissionRouter";

const mainRouter = Router();

mainRouter.use("/uploads", express.static(path.join(__dirname, "uploads")));
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);
mainRouter.use("/file", fileRouter);
mainRouter.use("/songs", songsRouter);
mainRouter.use("/artists", artistRouter);
mainRouter.use("/artist-users", artistUserRouter);
mainRouter.use("/roles", roleRouter);
mainRouter.use("/user-roles", userRoleRouter);
mainRouter.use("/", permissionRouter);
mainRouter.use("/", rolePermissionRouter);

mainRouter.get("/ping", (_req, res) => res.send("Pong!"));

export default mainRouter;
