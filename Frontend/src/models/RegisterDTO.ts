import { UserInstrument } from './User';

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
  favoriteInstrument: UserInstrument | null;

  // Paso 3: Imagen de perfil
  profileImage: string;
}

/**
 * Estado de validación por cada paso
 */
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Configuración de cada paso del registro
 */
export interface RegisterStep {
  id: number;
  title: string;
  description: string;
  fields: (keyof RegisterFormData)[];
}

export const REGISTER_STEPS: RegisterStep[] = [
  {
    id: 1,
    title: 'Datos básicos',
    description: 'Información personal y de acceso',
    fields: ['fullName', 'username', 'email', 'password', 'confirmPassword'],
  },
  {
    id: 2,
    title: 'Instrumento favorito',
    description: 'Selecciona tu instrumento principal',
    fields: ['favoriteInstrument'],
  },
  {
    id: 3,
    title: 'Foto de perfil',
    description: 'Elige tu imagen de perfil',
    fields: ['profileImage'],
  },
];

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

/**
 * Transforma los datos del formulario al DTO esperado por el backend
 */
export const transformToRegisterDTO = (
  formData: RegisterFormData,
): RegisterDTO => {
  if (!formData.favoriteInstrument) {
    throw new Error('Favorite instrument is required');
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
