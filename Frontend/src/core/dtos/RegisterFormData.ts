import { UserInstrument } from '../models/data/User';

export interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  favoriteInstrument: UserInstrument | null | undefined;
  profileImage: string;
}
