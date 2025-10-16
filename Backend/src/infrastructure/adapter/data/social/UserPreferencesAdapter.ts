import { Collection, InsertOneResult } from "mongodb";
import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
import UserTag from "../../../../domain/models/social/UserTag";
import UserPreferencesPort from "../../../../domain/ports/data/social/UserPreferencesPort";
import UserPreferences from "../../../../domain/models/social/UserPreferences";
import {
  ApplicationError,
  ErrorCodes,
} from "../../../../application/shared/errors/ApplicationError";

export default class UserPreferencesAdapter implements UserPreferencesPort {
  private readonly collection;
  private readonly _defaultPositivePoints: number = 5;
  private readonly _defaultNegativePoints: number = -6;

  constructor(collection: Collection<UserPreferences>) {
    this.collection = collection;
  }

  //#region PostTags Section
  async addPositiveUserPostTags(
    userId: number,
    newLikedTags: Array<UserTag>,
  ): Promise<ApplicationResponse<UserPreferences>> {
    try {
      const userActualPreferences = await this.collection.findOne({ userId });

      if (!userActualPreferences) {
        const newUserPreferences: UserPreferences = {
          userId,
          userPostTags: newLikedTags.map(t => {
            t.count = this._defaultPositivePoints;
            return t;
          }),
        };
        await this.collection.insertOne(newUserPreferences);
        return ApplicationResponse.success(newUserPreferences);
      } else {
        let actualLikedPreferences: Array<UserTag> = newLikedTags;

        if (!userActualPreferences.userPostTags) {
          actualLikedPreferences = newLikedTags;
        }

        userActualPreferences.userPostTags?.forEach((x) => {
          if (newLikedTags.includes(x)) {
            x.count += 5;
          }
          actualLikedPreferences.push(x);
        });

        const response = await this.collection.updateOne(
          { userId },
          { $set: { userPostTags: actualLikedPreferences } },
          { upsert: true },
        );
        return ApplicationResponse.success(userActualPreferences);
      }
    } catch (error) {
      console.error(error);
      return ApplicationResponse.failure(
        new ApplicationError("NO se agrego el coso de db", ErrorCodes.DATABASE_ERROR),
      );
    }
  }

  async addNegativeUserPostTags(userId: number, liked: Array<UserTag>): Promise<ApplicationResponse> {
    throw new Error("Method not implemented.");
  }

  async getPositivePreferencesByUserId(userId: number): Promise<ApplicationResponse<Array<UserTag>>> {
    throw new Error("Method not implemented.");
  }
  async getNegativePreferencesByUserId(userId: number): Promise<ApplicationResponse<Array<UserTag>>> {
    throw new Error("Method not implemented.");
  }
  //#endregion
}
