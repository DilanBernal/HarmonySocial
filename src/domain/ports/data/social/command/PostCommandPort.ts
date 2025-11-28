import Result from "../../../../shared/Result";
import Post from "../../../../models/social/Post";

export default interface PostCommandPort {
  create(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Result<number>>;
  update(id: number, post: Partial<Post>): Promise<Result<void>>;
  delete(id: number): Promise<Result<void>>;
  addLike(id: number): Promise<Result<void>>;
  removeLike(id: number): Promise<Result<void>>;
  addComment(id: number): Promise<Result<void>>;
  removeComment(id: number): Promise<Result<void>>;
}
