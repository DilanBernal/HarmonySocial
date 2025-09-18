// src/infrastructure/controllers/UserFollowController.ts
import { Request, Response } from "express";
import { UserFollowService } from "../../application/services/FollowService";

export class UserFollowController {
  constructor(private service: UserFollowService) {}

  follow = async (req: Request, res: Response) => {
    try {
      const { followerId, followedId } = req.body;
      const follow = await this.service.follow(followerId, followedId);
      res.status(201).json(follow);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  unfollow = async (req: Request, res: Response) => {
    try {
      const { followerId, followedId } = req.body;
      await this.service.unfollow(followerId, followedId);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getFollowers = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const followers = await this.service.getFollowers(userId);
    res.json(followers);
  };

  getFollowing = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const following = await this.service.getFollowing(userId);
    res.json(following);
  };
}
