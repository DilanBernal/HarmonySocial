import { RegisterDTO } from '../core/dtos/RegisterDTO';
import { transformToRegisterDTO } from '../core/utils/transforms/transformToRegisterDTO';
import { INITIAL_REGISTER_FORM } from '../config/const/InitialRegisterForm';
import { RegisterFormData } from '../core/dtos/RegisterFormData';
// Agregar import del servicio
import { AuthUserService } from '../core/services/user/auth/AuthUserService';
import { UseRegisterViewModelReturn } from './types/RegisterViewModelTypes';
import { completeValidationSchemas } from './types/stepValidationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const useRegisterViewModel = (): UseRegisterViewModelReturn => {
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

  const UserService: AuthUserService = new AuthUserService();

  const onSubmit = async () => {
    console.log('sending register petition');
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

      const serviceResponse = await UserService.register(userDTO);

      console.log(serviceResponse);
    } catch (error) {
      console.error(error);
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
  };
};
