import UserRolePort from "../../domain/ports/data/seg/UserRolePort";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import UserQueryAdapter from "../../infrastructure/adapter/data/seg/queries/UserQueryAdapter";

export default class ArtistUserService {
  constructor(
    private userRolePort: UserRolePort,
    private userQueryAdapter: UserQueryAdapter,
    private logger: LoggerPort,
  ) {}

  async listArtistUsers(): Promise<ApplicationResponse<any[]>> {
    try {
      const userIds = await this.userRolePort.listUsersForRole("artist");
      if (!userIds.length) return ApplicationResponse.success([]);
      const usersResp = await this.userQueryAdapter.searchUsersByIds(userIds);
      if (!usersResp.isSuccess) return usersResp as any;
      const data = (usersResp.getValue() || []).map((u) => ({
        id: u.id,
        full_name: u.fullName,
        username: u.username,
        email: u.email,
        profile_image: u.profileImage,
        status: u.status,
        favorite_instrument: u.favoriteInstrument,
        learning_points: u.learningPoints,
        created_at: u.createdAt,
        updated_at: u.updatedAt,
      }));
      return ApplicationResponse.success(data);
    } catch (e) {
      if (e instanceof Error) this.logger.error("Error listando artist-users", [e.message]);
      return ApplicationResponse.failure(
        new ApplicationError("Server error", ErrorCodes.SERVER_ERROR),
      );
    }
  }
}
