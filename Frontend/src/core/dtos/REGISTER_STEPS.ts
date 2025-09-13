import { RegisterStep } from '../types/RegisterStep';

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
