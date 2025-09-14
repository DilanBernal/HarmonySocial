// Backend/src/infrastructure/router/FriendshipRouter.ts
import { Router } from "express";
import { FriendshipController } from "../controller/FriendshipController";

/**
 * Crea un router para las rutas de amistad, inyectando el controller.
 */
export default function createFriendshipRouter(controller: FriendshipController): Router {
  const router = Router();

  // POST /friendships/follow
  router.post("/follow", (req, res) => controller.follow(req, res));

  // DELETE /friendships/unfollow/:id
  router.delete("/unfollow/:id", (req, res) => controller.unfollow(req, res));

  // GET /friendships/followers/:userId
  router.get("/followers/:userId", (req, res) => controller.getFollowers(req, res));

  // GET /friendships/following/:userId
  router.get("/following/:userId", (req, res) => controller.getFollowing(req, res));

  return router;
}
