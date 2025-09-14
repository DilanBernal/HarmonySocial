export default interface Friendship {
  id: number;
  user_id: number;   // el que sigue (follower)
  friend_id: number; // el seguido (followed)
  created_at: Date;
  updated_at?: Date;
}
// Backend/src/domain/models/Friendship.ts

/**
 * Modelo de dominio Friendship.
 * - Esta clase representa la entidad en la capa de dominio.
 * - Mantiene la lógica/validaciones mínimas de dominio si fuera necesario.
 */
export class Friendship {
  constructor(
    public readonly id: number | null, // null mientras no exista en BD
    public readonly followerId: number,
    public readonly followedId: number,
    public readonly createdAt: Date | null
  ) {}

  // Factory para crear una nueva relación (sin id aún)
  static createNew(followerId: number, followedId: number) {
    if (followerId === followedId) {
      throw new Error("Un usuario no puede seguirse a sí mismo.");
    }
    return new Friendship(null, followerId, followedId, null);
  }

  // Reconstruye desde datos persistidos
  static fromPersistence(obj: {
    id: number;
    followerId: number;
    followedId: number;
    createdAt: Date;
  }) {
    return new Friendship(obj.id, obj.followerId, obj.followedId, obj.createdAt);
  }
}
