import FriendshipPort from "../../../../../../src/domain/ports/data/social/FriendshipPort";
import Friendship, { FrienshipStatus } from "../../../../../../src/domain/models/social/Friendship";
import FriendshipUsersIdsRequest from "../../../../../../src/application/dto/requests/Friendship/FriendshipUsersIdsRequest";
import FriendshipsResponse from "../../../../../../src/application/dto/responses/FriendshipsResponse";
import { ApplicationResponse } from "../../../../../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../../../../../src/application/shared/errors/ApplicationError";

// Mock data for friendships
const mockFriendships: Friendship[] = [
  {
    id: 1,
    user_id: 1,
    friend_id: 2,
    status: FrienshipStatus.ACCEPTED,
    created_at: new Date("2023-01-15"),
    updated_at: new Date("2023-01-16"),
  },
  {
    id: 2,
    user_id: 1,
    friend_id: 3,
    status: FrienshipStatus.PENDING,
    created_at: new Date("2023-02-01"),
    updated_at: undefined,
  },
  {
    id: 3,
    user_id: 2,
    friend_id: 3,
    status: FrienshipStatus.REJECTED,
    created_at: new Date("2023-02-10"),
    updated_at: new Date("2023-02-11"),
  },
];

let nextId = 4;

const createFriendshipPortMock = (): jest.Mocked<FriendshipPort> => {
  // Clone the array to avoid mutation between tests
  let friendships = [...mockFriendships];

  return {
    createFriendship: jest.fn().mockImplementation(
      async (req: FriendshipUsersIdsRequest): Promise<ApplicationResponse<boolean>> => {
        // Check if friendship already exists
        const existing = friendships.find(
          (f) =>
            (f.user_id === req.user_id && f.friend_id === req.friend_id) ||
            (f.user_id === req.friend_id && f.friend_id === req.user_id)
        );

        if (existing) {
          return ApplicationResponse.failure(
            new ApplicationError("La amistad ya existe", ErrorCodes.DATABASE_ERROR)
          );
        }

        // Create new friendship
        const newFriendship: Friendship = {
          id: nextId++,
          user_id: req.user_id,
          friend_id: req.friend_id,
          status: FrienshipStatus.PENDING,
          created_at: new Date(),
          updated_at: undefined,
        };

        friendships.push(newFriendship);
        return ApplicationResponse.success(true);
      }
    ),

    deleteFriendship: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse<boolean>> => {
        const index = friendships.findIndex((f) => f.id === id);
        if (index === -1) {
          return ApplicationResponse.failure(
            new ApplicationError("Amistad no encontrada", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        friendships.splice(index, 1);
        return ApplicationResponse.success(true);
      }
    ),

    getAllFriendshipsByUser: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse<FriendshipsResponse>> => {
        const userFriendships = friendships.filter(
          (f) => (f.user_id === id || f.friend_id === id) && f.status === FrienshipStatus.ACCEPTED
        );

        return ApplicationResponse.success({
          friendships: userFriendships,
          total: userFriendships.length,
        } as FriendshipsResponse);
      }
    ),

    getAllCommonFriendships: jest.fn().mockImplementation(
      async (req: FriendshipUsersIdsRequest): Promise<ApplicationResponse<FriendshipsResponse>> => {
        // Get friends of user 1
        const user1Friends = friendships
          .filter(
            (f) =>
              (f.user_id === req.user_id || f.friend_id === req.user_id) &&
              f.status === FrienshipStatus.ACCEPTED
          )
          .map((f) => (f.user_id === req.user_id ? f.friend_id : f.user_id));

        // Get friends of user 2
        const user2Friends = friendships
          .filter(
            (f) =>
              (f.user_id === req.friend_id || f.friend_id === req.friend_id) &&
              f.status === FrienshipStatus.ACCEPTED
          )
          .map((f) => (f.user_id === req.friend_id ? f.friend_id : f.user_id));

        // Find common friends
        const commonFriendIds = user1Friends.filter((id) => user2Friends.includes(id));
        const commonFriendships = friendships.filter(
          (f) =>
            commonFriendIds.includes(f.user_id) ||
            commonFriendIds.includes(f.friend_id)
        );

        return ApplicationResponse.success({
          friendships: commonFriendships,
          total: commonFriendships.length,
        } as FriendshipsResponse);
      }
    ),

    getFrienshipsByUserAndSimilarName: jest.fn().mockImplementation(
      async (id: number, name: string): Promise<ApplicationResponse<FriendshipsResponse>> => {
        // Return all friendships for the user (name filtering would require user data)
        const userFriendships = friendships.filter(
          (f) => (f.user_id === id || f.friend_id === id) && f.status === FrienshipStatus.ACCEPTED
        );

        return ApplicationResponse.success({
          friendships: userFriendships,
          total: userFriendships.length,
        } as FriendshipsResponse);
      }
    ),

    getFriendshipByUsersIds: jest.fn().mockImplementation(
      async (req: FriendshipUsersIdsRequest): Promise<ApplicationResponse<Friendship | null>> => {
        const friendship = friendships.find(
          (f) =>
            (f.user_id === req.user_id && f.friend_id === req.friend_id) ||
            (f.user_id === req.friend_id && f.friend_id === req.user_id)
        );

        return ApplicationResponse.success(friendship || null);
      }
    ),

    getFriendshipById: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse<Friendship | null>> => {
        const friendship = friendships.find((f) => f.id === id);
        return ApplicationResponse.success(friendship || null);
      }
    ),

    removeFriendshipById: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse> => {
        const index = friendships.findIndex((f) => f.id === id);
        if (index === -1) {
          return ApplicationResponse.failure(
            new ApplicationError("Amistad no encontrada", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        friendships.splice(index, 1);
        return ApplicationResponse.emptySuccess();
      }
    ),

    removeFriendshipByUsersIds: jest.fn().mockImplementation(
      async (req: FriendshipUsersIdsRequest): Promise<ApplicationResponse> => {
        const index = friendships.findIndex(
          (f) =>
            (f.user_id === req.user_id && f.friend_id === req.friend_id) ||
            (f.user_id === req.friend_id && f.friend_id === req.user_id)
        );

        if (index === -1) {
          return ApplicationResponse.failure(
            new ApplicationError("Amistad no encontrada", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        friendships.splice(index, 1);
        return ApplicationResponse.emptySuccess();
      }
    ),

    aproveFrienshipRequest: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse> => {
        const friendship = friendships.find((f) => f.id === id);
        if (!friendship) {
          return ApplicationResponse.failure(
            new ApplicationError("Amistad no encontrada", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        if (friendship.status !== FrienshipStatus.PENDING) {
          return ApplicationResponse.failure(
            new ApplicationError("La solicitud no está pendiente", ErrorCodes.BUSINESS_RULE_VIOLATION)
          );
        }

        friendship.status = FrienshipStatus.ACCEPTED;
        friendship.updated_at = new Date();
        return ApplicationResponse.emptySuccess();
      }
    ),

    rejectFrienshipRequest: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse> => {
        const friendship = friendships.find((f) => f.id === id);
        if (!friendship) {
          return ApplicationResponse.failure(
            new ApplicationError("Amistad no encontrada", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        if (friendship.status !== FrienshipStatus.PENDING) {
          return ApplicationResponse.failure(
            new ApplicationError("La solicitud no está pendiente", ErrorCodes.BUSINESS_RULE_VIOLATION)
          );
        }

        friendship.status = FrienshipStatus.REJECTED;
        friendship.updated_at = new Date();
        return ApplicationResponse.emptySuccess();
      }
    ),
  };
};

export default createFriendshipPortMock;
