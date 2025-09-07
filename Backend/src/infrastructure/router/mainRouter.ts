import { Router } from "express";
import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";

const mainRouter = Router();

// Registrar rutas
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);
mainRouter.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default mainRouter;
