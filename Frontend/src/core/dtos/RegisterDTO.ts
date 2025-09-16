import { UserInstrument } from '../models/User';

/**
 * DTO para el registro de usuario que coincide exactamente
 * con la estructura esperada por el backend
 */
export interface RegisterDTO {
  full_name: string;
  email: string;
  username: string;
  password: string;
  profile_image: string;
  favorite_instrument: UserInstrument;
}
