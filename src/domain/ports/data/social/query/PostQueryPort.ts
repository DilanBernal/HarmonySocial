import Result from "../../../../shared/Result";
import Post from "../../../../models/social/Post";
import PostFilters from "../../../../valueObjects/PostFilters";

export default interface PostQueryPort {
  findById(id: number): Promise<Result<Post>>;
  findByFilters(filters: PostFilters): Promise<Result<Post>>;
  searchByFilters(filters: PostFilters): Promise<Result<Post[]>>;
  searchByUser(userId: number): Promise<Result<Post[]>>;
  existsById(id: number): Promise<Result<boolean>>;
}
