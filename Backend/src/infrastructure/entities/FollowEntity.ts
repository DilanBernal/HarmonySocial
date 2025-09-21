// src/domain/entities/UserFollow.ts
export class UserFollow {
  constructor(
    public id: number | null,
    public followerId: number,
    public followedId: number,
    public createdAt: Date = new Date(),
  ) {}
}
