import { UserFollowRepository } from "../../../../../../src/domain/ports/data/social/UserFollowsUserPort";
import { UserFollowsUser } from "../../../../../../src/domain/models/social/UserFollowsUser";

// Mock data for follows
const mockFollows: UserFollowsUser[] = [
  {
    id: 1,
    userIdFollower: 1,
    userIdFollowed: 2,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 2,
    userIdFollower: 1,
    userIdFollowed: 3,
    createdAt: Date.now() - 43200000, // 12 hours ago
  },
  {
    id: 3,
    userIdFollower: 2,
    userIdFollowed: 1,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
];

let nextId = 4;

const createUserFollowRepositoryMock = (): jest.Mocked<UserFollowRepository> => {
  // Clone the array to avoid mutation between tests
  let follows = [...mockFollows];

  return {
    follow: jest.fn().mockImplementation(
      async (followerId: number, followedId: number): Promise<UserFollowsUser> => {
        // Check if already following
        const existing = follows.find(
          (f) => f.userIdFollower === followerId && f.userIdFollowed === followedId
        );

        if (existing) {
          throw new Error("Already following");
        }

        // Check if trying to follow yourself
        if (followerId === followedId) {
          throw new Error("Cannot follow yourself");
        }

        // Create new follow
        const newFollow: UserFollowsUser = {
          id: nextId++,
          userIdFollower: followerId,
          userIdFollowed: followedId,
          createdAt: Date.now(),
        };

        follows.push(newFollow);
        return newFollow;
      }
    ),

    unfollow: jest.fn().mockImplementation(
      async (followerId: number, followedId: number): Promise<void> => {
        const index = follows.findIndex(
          (f) => f.userIdFollower === followerId && f.userIdFollowed === followedId
        );

        if (index === -1) {
          // Silently ignore if not following
          return;
        }

        follows.splice(index, 1);
      }
    ),

    getFollowers: jest.fn().mockImplementation(
      async (userId: number): Promise<UserFollowsUser[]> => {
        return follows.filter((f) => f.userIdFollowed === userId);
      }
    ),

    getFollowing: jest.fn().mockImplementation(
      async (userId: number): Promise<UserFollowsUser[]> => {
        return follows.filter((f) => f.userIdFollower === userId);
      }
    ),

    exists: jest.fn().mockImplementation(
      async (followerId: number, followedId: number): Promise<boolean> => {
        return follows.some(
          (f) => f.userIdFollower === followerId && f.userIdFollowed === followedId
        );
      }
    ),
  };
};

export default createUserFollowRepositoryMock;
