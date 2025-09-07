import FriendshipPort from "../../domain/ports/data/FriendshipPort";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import FriendshipUsersIdsRequest from "../dto/requests/Friendship/FriendshipUsersIdsRequest";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";

export default class FriendshipService {
  private friendshipPort: FriendshipPort;
  private loggerPort: LoggerPort;

  constructor(friendshipPort: FriendshipPort, logger: LoggerPort) {
    this.friendshipPort = friendshipPort;
    this.loggerPort = logger;
  }

  async createNewFriendship(
    friendRequest: FriendshipUsersIdsRequest,
  ): Promise<ApplicationResponse<boolean>> {
    try {
      const response = await this.friendshipPort.createFriendship(friendRequest);
      if (!response.success) {
        this.loggerPort.appWarn(response);
        return response;
      }
      return response;
    } catch (error) {
      if (error instanceof ApplicationResponse) {
        return ApplicationResponse.failure(new ApplicationError("", ErrorCodes.SERVER_ERROR));
      } else throw error;
    }
  }
}
