import { Collection } from "mongodb";
import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
import UserTag from "../../../../domain/models/social/UserTag";
import UserPreferencesPort from "../../../../domain/ports/data/social/UserPreferencesPort";
import { getMongoDB } from "../../../config/con_database";
import UserPreferences from "../../../../domain/models/social/UserPreferences";
import UserPreferencesEntity from "../../../entities/NoSql/social/UserPreferencesEntity";

export default class UserPreferencesAdapter implements UserPreferencesPort {

  private readonly collection;

  constructor(collection: Collection) {
    this.collection = collection;
  }



  async addLikedPreferences(userId: number, liked: Array<UserTag>): Promise<ApplicationResponse<any>> {
    try {

      const userPreference: UserPreferencesEntity = { userId: userId };

      userPreference.likedTags;
      await this.collection.updateOne({ userId }, userPreference, { upsert: true });
    } catch (error) {

    }
    return ApplicationResponse.emptySuccess();
  }
}
