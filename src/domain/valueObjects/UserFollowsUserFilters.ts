import { BasicFilters } from "./BasicFilters";

export default interface UserFollowsUserFilters extends BasicFilters {
  id?: number;
  userIdFollower?: number;
  userIdFollowed?: number;
}
