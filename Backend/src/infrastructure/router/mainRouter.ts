// Backend/src/infrastructure/router/mainRouter.ts
import { Router } from "express";
import userRoutes from "./UserRoutes";

// Importar controller, service y adapter
import { FriendshipController } from "../controller/FriendshipController";
import { FriendshipService } from "../../application/services/FriendshipService";
import { FriendshipAdapter } from "../adapter/data/FrienshipAdapter";
import { AppDataSource } from "../config/con_database";

// Importar función que crea el router
import createFriendshipRouter from "./FriendshipRouter";

const mainRouter = Router();

// Rutas de usuarios
mainRouter.use("/users", userRoutes);

// Instanciar Adapter -> Service -> Controller
const friendshipAdapter = new FriendshipAdapter(AppDataSource);
const friendshipService = new FriendshipService(friendshipAdapter);
const friendshipController = new FriendshipController(friendshipService);

// Crear router de amistad con el controller
const friendshipRouter = createFriendshipRouter(friendshipController);

// Registrar router de amistad
mainRouter.use("/friendships", friendshipRouter);

// Ruta de prueba
mainRouter.get("/ping", (req, res) => res.send("Pong!"));

export default mainRouter;
