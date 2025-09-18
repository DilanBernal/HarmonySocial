// src/infrastructure/routes/UserFollowRouter.ts
import { Router } from "express";
import { UserFollowController } from "../controller/FollowController";


export const userFollowRouter = (controller: UserFollowController) => {
  const router = Router();

  router.post("/follow", controller.follow);
  router.delete("/unfollow", controller.unfollow);
  router.get("/:userId/followers", controller.getFollowers);
  router.get("/:userId/following", controller.getFollowing);

  return router;
};
