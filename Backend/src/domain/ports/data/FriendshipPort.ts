import FriendshipUsersIdsRequest from "../../../application/dto/requests/Friendship/FriendshipUsersIdsRequest";
import Friendship from "../../models/Friendship";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import FriendshipsResponse from "../../../application/dto/responses/FriendshipsResponse";

export default interface FriendshipPort {
  createFriendship(req: FriendshipUsersIdsRequest): Promise<ApplicationResponse<boolean>>;
  deleteFriendship(id: number): Promise<ApplicationResponse<boolean>>;
  getAllFriendshipsByUser(id: number): Promise<ApplicationResponse<FriendshipsResponse>>;
  getAllCommonFriendships(
    req: FriendshipUsersIdsRequest,
  ): Promise<ApplicationResponse<FriendshipsResponse>>;
  getFrienshipsByUserAndSimilarName(
    id: number,
    name: string,
  ): Promise<ApplicationResponse<FriendshipsResponse>>;
  removeFriendshipById(id: number): Promise<ApplicationResponse<boolean>>;
  removeFriendshipByUsersIds(req: FriendshipUsersIdsRequest): Promise<ApplicationResponse<boolean>>;
  aproveFrienshipRequest(id: number): Promise<ApplicationResponse<boolean>>;
  rejectFrienshipRequest(id: number): Promise<ApplicationResponse<boolean>>;
}
