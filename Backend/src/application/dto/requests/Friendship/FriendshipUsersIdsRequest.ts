// Backend/src/application/dto/requests/Friendship/FriendshipUsersIdsRequest.ts

/**
 * DTO de request para seguir a un usuario.
 * - Se espera followerId y followedId en el body de la petición.
 */
export interface FriendshipUsersIdsRequest {
  followerId: number; // quien inicia el follow
  followedId: number; // a quien se sigue
}
