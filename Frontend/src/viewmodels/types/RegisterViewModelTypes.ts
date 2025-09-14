import {
  Control,
  UseFormGetFieldState,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { RegisterFormData } from '../../core/dtos/RegisterFormData';

export type UseRegisterViewModelReturn = {
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData, any>;
  getFieldState: UseFormGetFieldState<RegisterFormData>;
  getValues: () => any;
  errors: object | any;
  reset: () => void;
};
