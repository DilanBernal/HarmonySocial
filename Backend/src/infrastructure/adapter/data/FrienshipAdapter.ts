import { FindOptionsWhere, In, QueryFailedError, Repository } from "typeorm";
import FriendshipUsersIdsRequest from "../../../application/dto/requests/Friendship/FriendshipUsersIdsRequest";
import FriendshipsResponse from "../../../application/dto/responses/FriendshipsResponse";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import FriendshipPort from "../../../domain/ports/data/FriendshipPort";
import FriendshipEntity from "../../entities/FriendshipEntity";
import { AppDataSource } from "../../config/con_database";
import Friendship, { FrienshipStatus } from "../../../domain/models/Friendship";
import { ApplicationError, ErrorCodes } from "../../../application/shared/errors/ApplicationError";

export default class FriendshipAdapter implements FriendshipPort {
  private frienshipRepository: Repository<FriendshipEntity>;

  constructor() {
    this.frienshipRepository = AppDataSource.getRepository(FriendshipEntity);
  }
  private toDomain(friendship: FriendshipEntity): Friendship {
    const friendshipDomain: Friendship = {
      id: friendship.id,
      user_id: friendship.user_id,
      friend_id: friendship.friend_id,
      status: friendship.status,
      created_at: friendship.created_at,
      updated_at: friendship.updated_at,
    };
    return friendshipDomain;
  }
  private toEntity(friendship: Omit<Friendship, "id">) {
    const friendshipEntity: FriendshipEntity = new FriendshipEntity();
    friendshipEntity.user_id = friendship.user_id;
    friendshipEntity.friend_id = friendship.friend_id;
    friendshipEntity.status = friendship.status;
    friendshipEntity.created_at = friendship.created_at;
    friendshipEntity.updated_at = friendship.updated_at;
    return friendshipEntity;
  }
  private toFriendshipsResponse(list: Array<Friendship>): FriendshipsResponse {
    const friendshipResponse: FriendshipsResponse = new FriendshipsResponse();
    friendshipResponse.friendships = list.map((x) => ({
      id: x.id,
      user_id: x.user_id,
      friend_id: x.friend_id,
      status: x.status,
    }));
    return friendshipResponse;
  }

  async createFriendship(req: FriendshipUsersIdsRequest): Promise<ApplicationResponse<boolean>> {
    try {
      const frienshipEntity = this.toEntity({
        user_id: req.user_id,
        friend_id: req.friend_id,
        status: FrienshipStatus.PENDING,
        created_at: new Date(),
      });

      const result = await this.frienshipRepository.save(frienshipEntity);
      if (result) {
        return ApplicationResponse.success(true);
      } else {
        return ApplicationResponse.success(false);
      }
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "No se pudo crear la amistad",
            ErrorCodes.SERVER_ERROR,
            error.message,
            error,
          ),
        );
      }
      if (error instanceof Error) {
        return ApplicationResponse.failure(
          new ApplicationError(
            "Ocurrio un error al crear la amistad",
            ErrorCodes.SERVER_ERROR,
            error.message,
            error,
          ),
        );
      }
      throw ApplicationResponse.failure(
        new ApplicationError("Error desconocido", ErrorCodes.SERVER_ERROR, error),
      );
    }
  }
  async deleteFriendship(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const result = await this.frienshipRepository.delete(id);
      if (result.affected === 1) {
        return ApplicationResponse.success(true);
      } else {
        return ApplicationResponse.success(false);
      }
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async getAllFriendshipsByUser(id: number): Promise<ApplicationResponse<FriendshipsResponse>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        { user_id: id, status: FrienshipStatus.ACCEPTED },
      ];
      const friendships = await this.frienshipRepository.find({ where: whereCondition });

      const response = this.toFriendshipsResponse(friendships);
      return ApplicationResponse.success(response);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async getAllCommonFriendships(
    req: FriendshipUsersIdsRequest,
  ): Promise<ApplicationResponse<FriendshipsResponse>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        { user_id: req.user_id, friend_id: req.friend_id, status: FrienshipStatus.ACCEPTED },
      ];
      const friendships = await this.frienshipRepository.find({ where: whereCondition });

      const response = this.toFriendshipsResponse(friendships);
      return ApplicationResponse.success(response);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async getFrienshipsByUserAndSimilarName(
    id: number,
    name: string,
  ): Promise<ApplicationResponse<FriendshipsResponse>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        { user_id: id, status: FrienshipStatus.ACCEPTED },
      ];
      const friendships = await this.frienshipRepository.find({ where: whereCondition });

      const response = this.toFriendshipsResponse(friendships);
      return ApplicationResponse.success(response);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async removeFriendshipById(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        { id: id, status: In([FrienshipStatus.ACCEPTED, FrienshipStatus.PENDING]) },
      ];
      const entity = await this.frienshipRepository.findOne({ where: whereCondition });
      if (!entity) {
        return ApplicationResponse.failure(
          new ApplicationError("No se encontro la amistad", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      const response = await this.frienshipRepository.delete(entity.id);
      if (response.affected === 0) {
        return ApplicationResponse.failure(
          new ApplicationError("No se pudo eliminar la amistad", ErrorCodes.SERVER_ERROR),
        );
      }

      return ApplicationResponse.success(true);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async removeFriendshipByUsersIds(
    req: FriendshipUsersIdsRequest,
  ): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        {
          id: req.user_id,
          friend_id: req.friend_id,
          status: In([FrienshipStatus.ACCEPTED, FrienshipStatus.PENDING]),
        },
      ];
      const entity = await this.frienshipRepository.findOne({ where: whereCondition });
      if (!entity) {
        return ApplicationResponse.failure(
          new ApplicationError("No se encontro la amistad", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      const response = await this.frienshipRepository.delete(entity.id);
      if (response.affected === 0) {
        return ApplicationResponse.failure(
          new ApplicationError("No se pudo eliminar la amistad", ErrorCodes.SERVER_ERROR),
        );
      }

      return ApplicationResponse.success(true);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async aproveFrienshipRequest(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        { id: id, status: FrienshipStatus.PENDING },
      ];
      const entity = await this.frienshipRepository.findOne({ where: whereCondition });
      if (!entity) {
        return ApplicationResponse.failure(
          new ApplicationError("No se encontro la amistad", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      entity.status = FrienshipStatus.ACCEPTED;
      entity.updated_at = new Date();

      const response = await this.frienshipRepository.update(entity.id, entity);

      if (response.affected === 0) {
        return ApplicationResponse.failure(
          new ApplicationError("No se pudo eliminar la amistad", ErrorCodes.SERVER_ERROR),
        );
      }

      return ApplicationResponse.success(true);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
  async rejectFrienshipRequest(id: number): Promise<ApplicationResponse<boolean>> {
    try {
      const whereCondition: FindOptionsWhere<FriendshipEntity>[] = [
        { id: id, status: FrienshipStatus.PENDING },
      ];
      const entity = await this.frienshipRepository.findOne({ where: whereCondition });
      if (!entity) {
        return ApplicationResponse.failure(
          new ApplicationError("No se encontro la amistad", ErrorCodes.VALUE_NOT_FOUND),
        );
      }

      entity.status = FrienshipStatus.REJECTED;
      entity.updated_at = new Date();

      const response = await this.frienshipRepository.update(entity.id, entity);

      if (response.affected === 0) {
        return ApplicationResponse.failure(
          new ApplicationError("No se pudo eliminar la amistad", ErrorCodes.SERVER_ERROR),
        );
      }

      return ApplicationResponse.success(true);
    } catch (error) {
      return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
    }
  }
}
