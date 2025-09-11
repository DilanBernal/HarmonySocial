import { Router } from "express";
import userRoutes from "./UserRoutes";
import friendshipRouter from "./FriendshipRouter";

// ⬇️ importa tu router de canciones
import songsRouter from "./songs.routes";

const mainRouter = Router();

// Registrar rutas existentes
mainRouter.use("/users", userRoutes);
mainRouter.use("/friendships", friendshipRouter);

// ⬇️ monta las rutas de canciones en /api/songs
mainRouter.use("/songs", songsRouter);

mainRouter.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default mainRouter;
