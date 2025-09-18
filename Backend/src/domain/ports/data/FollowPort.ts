import Follow from "../../models/Follow";

export default interface FollowPort {
  create(followerId: number, followedId: number): Promise<Follow>;
  findAll(): Promise<Follow[]>;
  findById(id: number): Promise<Follow | null>;
  update(id: number, followerId: number, followedId: number): Promise<Follow | null>;
  delete(id: number): Promise<boolean>;
}
