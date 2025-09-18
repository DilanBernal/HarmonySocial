import FollowRequest from "../dto/requests/Follow/FollowRequest";
import FollowResponse from "../dto/responses/FollowResponse";
import FollowAdapter from "../../infrastructure/adapter/data/FollowAdapter";
import { AppDataSource } from "../../../src/infrastructure/config/con_database";
import { FollowEntity } from "../../../src/infrastructure/entities/FollowEntity";

export default class FollowService {
  private adapter: FollowAdapter;

  constructor() {
    this.adapter = new FollowAdapter();
  }

  async create(request: FollowRequest): Promise<FollowResponse> {
    return await this.adapter.create(request.followerId, request.followedId);
  }

  async findAll(): Promise<FollowResponse[]> {
    return await this.adapter.findAll();
  }

  async findById(id: number): Promise<FollowResponse | null> {
    return await this.adapter.findById(id);
  }

  async update(id: number, request: FollowRequest): Promise<FollowResponse | null> {
    return await this.adapter.update(id, request.followerId, request.followedId);
  }

  async delete(id: number): Promise<boolean> {
    return await this.adapter.delete(id);
  }

  async unfollow(followerId: number, followedId: number): Promise<boolean> {
  const repo = AppDataSource.getRepository(FollowEntity);

  const follow = await repo.findOne({
    where: { followerId, followedId },
  });

  if (!follow) {
    return false;
  }

  await repo.remove(follow);
  return true;
}

}
