import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
import UserTag from "../../../models/social/UserTag";

export default interface UserPreferencesPort {
  addLikedPreferences(userId: number, liked: Array<UserTag>): Promise<ApplicationResponse<any>>;
}