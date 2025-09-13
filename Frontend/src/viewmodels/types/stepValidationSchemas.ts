import * as Yup from 'yup';
import { UserInstrument } from '../../core/models/User';

// Esquemas de validación por paso
export const stepValidationSchemas = {
  1: Yup.object({
    fullName: Yup.string()
      .min(2, 'Mínimo 2 caracteres')
      .required('El nombre es obligatorio')
      .matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç.'-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜüÇç.'-]+){0,5}$/,
        'El nombre no está en el formato correcto',
      ),
    username: Yup.string()
      .required('El username es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(20, 'Máximo 20 caracteres')
      .matches(
        /^[a-zA-Z0-9_*\-#$!|°.+]{3,20}$/,
        'El username está en formato incorrecto',
      ),
    email: Yup.string()
      .email('Email inválido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .min(8, 'Mínimo 8 caracteres')
      .required('La contraseña es obligatoria')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(.){8,}$/,
        'La contraseña debe tener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
      .required('Confirma tu contraseña'),
  }),

  2: Yup.object({
    favoriteInstrument: Yup.mixed<UserInstrument>()
      .oneOf(
        [UserInstrument.GUITAR, UserInstrument.PIANO, UserInstrument.BASS],
        'Selecciona un instrumento válido',
      )
      .required('Selecciona tu instrumento favorito'),
  }),

  3: Yup.object({
    profileImage: Yup.string().required('Selecciona una imagen de perfil'),
  }),
};
