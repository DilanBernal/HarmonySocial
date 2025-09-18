import { Repository } from "typeorm";
import { AppDataSource } from "../../config/con_database"
import { FollowEntity } from "../../entities/FollowEntity";
import FollowPort from "../../../domain/ports/data/FollowPort";
import Follow from "../../../domain/models/Follow";

export default class FollowAdapter implements FollowPort {
  private repository: Repository<FollowEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(FollowEntity);
  }

  async create(followerId: number, followedId: number): Promise<Follow> {
    const follow = this.repository.create({ followerId, followedId });
    return await this.repository.save(follow);
  }

  async findAll(): Promise<Follow[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Follow | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, followerId: number, followedId: number): Promise<Follow | null> {
    const follow = await this.repository.findOneBy({ id });
    if (!follow) return null;
    follow.followerId = followerId;
    follow.followedId = followedId;
    return await this.repository.save(follow);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
