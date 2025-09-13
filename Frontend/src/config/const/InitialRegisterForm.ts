import { RegisterFormData } from '../../core/dtos/RegisterFormData';

/**
 * Valores iniciales para el formulario de registro
 */

export const INITIAL_REGISTER_FORM: RegisterFormData = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  favoriteInstrument: null,
  profileImage: '',
};
