// Backend/src/infrastructure/router/FriendshipRouter.ts
import { Router } from "express";
import { FriendshipController } from "../controller/FriendshipController";

/**
 * Construye un router con las rutas de amistad.
 * Recibe el controller ya instanciado (inyección).
 */
export default function createFriendshipRouter(controller: FriendshipController): Router {
  const router = Router();

  router.post("/follow", (req, res) => controller.follow(req, res));
  router.delete("/unfollow/:id", (req, res) => controller.unfollow(req, res));
  router.get("/followers/:userId", (req, res) => controller.getFollowers(req, res));
  router.get("/following/:userId", (req, res) => controller.getFollowing(req, res));

  return router;
}
