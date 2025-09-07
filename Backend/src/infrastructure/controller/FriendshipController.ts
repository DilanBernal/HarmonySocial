import { Request, Response } from "express";
import FriendshipService from "../../application/services/FriendshipService";

export default class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  async newFriendship(req: Request, res: Response) {
    try {
      const servResponse = await this.friendshipService.createNewFriendship(req.body);
      if (!servResponse!.success) {
        return res.status(400).json(servResponse?.error);
      }
      return res.status(201).json(servResponse?.data);
    } catch (error) {}
  }
}
