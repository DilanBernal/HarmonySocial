import { useState } from 'react';
import { RegisterDTO } from '../core/dtos/RegisterDTO';
import { transformToRegisterDTO } from '../core/utils/transforms/transformToRegisterDTO';
import { INITIAL_REGISTER_FORM } from '../config/const/InitialRegisterForm';
import { RegisterFormData } from '../core/dtos/RegisterFormData';
import { useAppServices } from '../services/AppServices';
import { UseRegisterViewModelReturn } from './types/RegisterViewModelTypes';
import { completeValidationSchemas } from './types/stepValidationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const useRegisterViewModel = (): UseRegisterViewModelReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { services, addSubscription } = useAppServices();

  const {
    control,
    reset,
    getFieldState,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_REGISTER_FORM,
    resolver: yupResolver(completeValidationSchemas),
    mode: 'onChange',
    delayError: 0,
  });

  const onSubmit = () => {
    console.log('Sending register petition');
    setIsLoading(true);
    setError(null);

    try {
      const userRegisterForm: RegisterFormData = {
        fullName: getValues('fullName'),
        username: getValues('username'),
        email: getValues('email'),
        password: getValues('password'),
        confirmPassword: getValues('confirmPassword'),
        favoriteInstrument: getValues('favoriteInstrument'),
        profileImage: getValues('profileImage'),
      };
      const userDTO: RegisterDTO = transformToRegisterDTO(userRegisterForm);

      const subscription = services.auth.register(userDTO).subscribe({
        next: response => {
          console.log('Registration successful:', response);
          setIsLoading(false);

          // Aquí podrías redirigir al login o mostrar mensaje de éxito
          // navigation.navigate('Login');
        },
        error: registrationError => {
          console.error('Registration error:', registrationError);
          setError(registrationError.message || 'Error en el registro');
          setIsLoading(false);
        },
      });

      addSubscription(subscription);
    } catch (syncError) {
      console.error('Sync registration error:', syncError);
      setError('Error preparando los datos de registro');
      setIsLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    getFieldState,
    getValues,
    errors,
    setValue,
    reset,
    isLoading,
    error,
  };
};
