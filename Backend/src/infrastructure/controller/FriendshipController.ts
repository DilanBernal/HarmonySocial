// Backend/src/infrastructure/controller/FriendshipController.ts
import { Request, Response } from "express";
import { FriendshipService } from "../../application/services/FriendshipService";
import { FriendshipUsersIdsRequest } from "../../application/dto/requests/Friendship/FriendshipUsersIdsRequest";
import { FriendshipsResponse } from "../../application/dto/responses/FriendshipsResponse";

/**
 * Controlador que se encarga de recibir peticiones HTTP y usar el servicio.
 * Inyecta FriendshipService en el constructor.
 */
export class FriendshipController {
  constructor(private service: FriendshipService) {}

  // POST /friendship/follow
  async follow(req: Request, res: Response) {
    try {
      const body = req.body as FriendshipUsersIdsRequest;

      if (!body || typeof body.followerId !== "number" || typeof body.followedId !== "number") {
        return res.status(400).json({ message: "followerId y followedId son requeridos y deben ser números." });
      }

      const saved = await this.service.followUser(body.followerId, body.followedId);

      const dto = {
        id: saved.id!,
        followerId: saved.followerId,
        followedId: saved.followedId,
        createdAt: saved.createdAt ? saved.createdAt.toISOString() : new Date().toISOString(),
      };

      const response: FriendshipsResponse = { data: dto, message: "Seguido correctamente" };
      return res.status(201).json(response);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno" });
    }
  }

  // DELETE /friendship/unfollow/:id
  async unfollow(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Id inválido." });

      await this.service.unfollowUser(id);
      return res.status(200).json({ message: "Dejado de seguir correctamente." });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno" });
    }
  }

  // GET /friendship/followers/:userId
  async getFollowers(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) return res.status(400).json({ message: "userId inválido." });

      const followers = await this.service.getFollowers(userId);

      const data = followers.map((f) => ({
        id: f.id!,
        followerId: f.followerId,
        followedId: f.followedId,
        createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
      }));

      const response: FriendshipsResponse = { data };
      return res.status(200).json(response);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno" });
    }
  }

  // GET /friendship/following/:userId
  async getFollowing(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) return res.status(400).json({ message: "userId inválido." });

      const following = await this.service.getFollowing(userId);

      const data = following.map((f) => ({
        id: f.id!,
        followerId: f.followerId,
        followedId: f.followedId,
        createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
      }));

      const response: FriendshipsResponse = { data };
      return res.status(200).json(response);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Error interno" });
    }
  }
}
