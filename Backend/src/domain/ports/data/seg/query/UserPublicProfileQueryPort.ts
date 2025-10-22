import UserPublicProfile from "../../../../valueObjects/UserPublicProfile";
import Response from "../../../../shared/Result";
import UserFilters from "../../../../valueObjects/UserFilters";

export default interface UserPublicProfileQueryPort {
  getUserPublicProfileById(id: number): Promise<Response<UserPublicProfile>>;
  getUserPublicProfileByFilters(filters: UserFilters): Promise<Response<UserPublicProfile>>;
  searchUsersPublicProfileByFilters(filters: UserFilters): Promise<Response<UserPublicProfile[]>>;
}
