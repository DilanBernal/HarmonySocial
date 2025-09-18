import { Request, Response } from "express";
import FollowService from "../../application/services/FollowService";

const service = new FollowService();

export default class FollowController {
  static async create(req: Request, res: Response) {
    try {
      const follow = await service.create(req.body);
      res.status(201).json(follow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    const follows = await service.findAll();
    res.json(follows);
  }

  static async findById(req: Request, res: Response) {
    const follow = await service.findById(Number(req.params.id));
    follow
      ? res.json(follow)
      : res.status(404).json({ message: "Follow not found" });
  }

  static async update(req: Request, res: Response) {
    const follow = await service.update(Number(req.params.id), req.body);
    follow
      ? res.json(follow)
      : res.status(404).json({ message: "Follow not found" });
  }

  static async delete(req: Request, res: Response) {
    const success = await service.delete(Number(req.params.id));
    success
      ? res.json({ message: "Follow deleted" })
      : res.status(404).json({ message: "Follow not found" });
  }

  // 🔹 Nuevo método UNFOLLOW
  static async unfollow(req: Request, res: Response) {
    try {
      const { followerId, followedId } = req.body;

      if (!followerId || !followedId) {
        return res
          .status(400)
          .json({ message: "followerId y followedId son requeridos" });
      }

      const success = await service.unfollow(followerId, followedId);

      success
        ? res.json({ message: "Unfollow realizado con éxito" })
        : res.status(404).json({ message: "No existe esa relación de follow" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
