import { UserInstrument } from '../models/User';

/**
 * Datos del formulario durante el flujo de registro
 * Incluye campos adicionales para validación
 */

export interface RegisterFormData {
  // Paso 1: Datos básicos
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Paso 2: Instrumento favorito
  favoriteInstrument: UserInstrument | null | undefined;

  // Paso 3: Imagen de perfil
  profileImage: string;
}
