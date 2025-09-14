import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import { RegisterDTO } from '../core/dtos/RegisterDTO';
import { transformToRegisterDTO } from '../core/utils/transforms/transformToRegisterDTO';
import { INITIAL_REGISTER_FORM } from '../config/const/InitialRegisterForm';
import { REGISTER_STEPS } from '../core/dtos/REGISTER_STEPS';
import { StepValidation } from '../core/types/StepValidation';
import { RegisterFormData } from '../core/dtos/RegisterFormData';
// Agregar import del servicio
import { AuthUserService } from '../core/services/user/auth/AuthUserService';
import { UseRegisterViewModelReturn } from './types/RegisterViewModelTypes';
import { completeValidationSchemas } from './types/stepValidationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Clave para persistencia local
const STORAGE_KEY = '@harmony_register_form';

export const useRegisterViewModel = (): UseRegisterViewModelReturn => {
  const {
    control,
    reset,
    getFieldState,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_REGISTER_FORM,
    resolver: yupResolver(completeValidationSchemas),
    mode: 'onBlur',
    delayError: 0,
  });

  return {
    control,
    handleSubmit,
    getFieldState,
    getValues,
    errors,
    reset,
  };
};
