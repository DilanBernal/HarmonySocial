import { UserInstrument } from "../../../../../domain/models/User";

type UserBasicDataResponse = {
  id: number;
  fullName: string;
  email: string;
  activeFrom: number;
  profileImage: string;
  username: string;
  learningPoints: number;
  favoriteInstrument: UserInstrument;
};

export default UserBasicDataResponse;
