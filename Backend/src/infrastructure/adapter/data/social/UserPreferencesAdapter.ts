import { Collection } from "mongodb";
import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
import UserTag from "../../../../domain/models/social/UserTag";
import UserPreferencesPort from "../../../../domain/ports/data/social/UserPreferencesPort";
import UserPreferences from "../../../../domain/models/social/UserPreferences";
import UserPreferencesEntity from "../../../entities/NoSql/social/UserPreferencesEntity";
import { ApplicationError, ErrorCodes } from "../../../../application/shared/errors/ApplicationError";

export default class UserPreferencesAdapter implements UserPreferencesPort {

  private readonly collection;

  constructor(collection: Collection<UserPreferences>) {
    this.collection = collection;
  }



  async addLikedPreferences(userId: number, liked: Array<UserTag>): Promise<ApplicationResponse<any>> {
    try {

      const userActualPreferences = await this.collection.findOne({ userId });

      if (!userActualPreferences) {
        const newUserPreferences: UserPreferences = {
          userId,
          likedTags: liked,
        }
        const response = await this.collection.insertOne(newUserPreferences);
        console.log(response);
      }
      else {
        let actualLikedPreferences: Array<UserTag> = [];

        if (!userActualPreferences.likedTags) {
          actualLikedPreferences = liked;
        }

        liked.forEach(x => {
          if (userActualPreferences.likedTags?.includes(x)) {
            x.count += 5;
          }
          actualLikedPreferences.push(x);
        });

        const response = await this.collection.updateOne({ userId }, { $set: { likedTags: actualLikedPreferences } }, { upsert: true });
        console.log(response);
      }

    } catch (error) {
      console.error(error);
      return ApplicationResponse.failure(new ApplicationError("NO se agrego el coso de db", ErrorCodes.DATABASE_ERROR));
    }
    return ApplicationResponse.emptySuccess();
  }
}
