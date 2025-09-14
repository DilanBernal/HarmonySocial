// Backend/src/application/services/FriendshipService.ts
import { FriendshipPort } from "../../domain/ports/data/FriendshipPort";
import { Friendship } from "../../domain/models/Friendship";

/**
 * Servicio de aplicación que contiene la lógica para seguir / dejar de seguir / consultar.
 * Depende de la abstracción FriendshipPort.
 */
export class FriendshipService {
  constructor(private repository: FriendshipPort) {}

  async followUser(followerId: number, followedId: number): Promise<Friendship> {
    if (followerId === followedId) {
      throw new Error("Un usuario no puede seguirse a sí mismo.");
    }
    // verificar si ya existe
    const existing = await this.repository.findByFollowerAndFollowed(followerId, followedId);
    if (existing) return existing;

    const newFriendship = Friendship.createNew(followerId, followedId);
    const saved = await this.repository.followUser(newFriendship);
    return saved;
  }

  async unfollowUser(id: number): Promise<void> {
    // validar existencia opcional: podrías lanzar 404 si no existe.
    await this.repository.unfollowUser(id);
  }

  async getFollowers(userId: number): Promise<Friendship[]> {
    return this.repository.getFollowers(userId);
  }

  async getFollowing(userId: number): Promise<Friendship[]> {
    return this.repository.getFollowing(userId);
  }
}
