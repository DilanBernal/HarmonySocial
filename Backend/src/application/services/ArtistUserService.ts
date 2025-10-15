import UserRolePort from "../../domain/ports/data/seg/UserRolePort";
import UserPort from "../../domain/ports/data/seg/UserPort";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import LoggerPort from "../../domain/ports/utils/LoggerPort";

export default class ArtistUserService {
  constructor(
    private userRolePort: UserRolePort,
    private userPort: UserPort,
    private logger: LoggerPort,
  ) { }

  async listArtistUsers(): Promise<ApplicationResponse<any[]>> {
    try {
      const userIds = await this.userRolePort.listUsersForRole("artist");
      if (!userIds.length) return ApplicationResponse.success([]);
      const usersResp = await this.userPort.getUsersByIds(userIds);
      if (!usersResp.success) return usersResp as any;
      const data = (usersResp.data || []).map((u) => ({
        id: u.id,
        full_name: u.full_name,
        username: u.username,
        email: u.email,
        profile_image: u.profile_image,
        status: u.status,
        favorite_instrument: u.favorite_instrument,
        learning_points: u.learning_points,
        created_at: u.created_at,
        updated_at: u.updated_at,
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
