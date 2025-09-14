import { RegisterDTO } from '../../dtos/RegisterDTO';
import { RegisterFormData } from '../../dtos/RegisterFormData';

/**
 * Transforma los datos del formulario al DTO esperado por el backend
 */

export const transformToRegisterDTO = (
  formData: RegisterFormData,
): RegisterDTO => {
  if (!formData.favoriteInstrument) {
    throw new Error('Favorite instrument is required');
  }
  if (formData.password !== formData.confirmPassword) {
    throw new Error('The passwords not match');
  }

  return {
    full_name: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    username: formData.username.trim(),
    password: formData.password,
    profile_image: formData.profileImage,
    favorite_instrument: formData.favoriteInstrument,
  };
};
