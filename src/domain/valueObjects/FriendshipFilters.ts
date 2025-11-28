import { FrienshipStatus } from "../models/social/Friendship";
import { BasicFilters } from "./BasicFilters";

export default interface FriendshipFilters extends BasicFilters {
  id?: number;
  userId?: number;
  friendId?: number;
  status?: FrienshipStatus;
}
