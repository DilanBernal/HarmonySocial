import User, { UserInstrument } from "../models/seg/User";

export default class UserPublicProfile extends Pick<User, "id" | "username"> {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly profileImageUrl: string,
    public readonly activeFrom: number,
    public readonly learningPoints: number,
    public readonly favoriteInstrument: UserInstrument,
  ) {}
}
