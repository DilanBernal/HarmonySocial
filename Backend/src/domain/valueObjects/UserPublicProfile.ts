import { UserInstrument } from "../models/seg/User";

export default class UserPublicProfile {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly profileImageUrl: string,
    public readonly activeFrom: number,
    public readonly learningPoints: number,
    public readonly favoriteInstrument: UserInstrument,,
  ) {}
}
