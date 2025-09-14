// Backend/src/application/dto/responses/FriendshipsResponse.ts

/**
 * DTO para respuestas de amistad.
 */
export interface FriendshipResponseItem {
  id: number;
  followerId: number;
  followedId: number;
  createdAt: string; // ISO string
}

export interface FriendshipsResponse {
  data: FriendshipResponseItem[] | FriendshipResponseItem;
  message?: string;
}
