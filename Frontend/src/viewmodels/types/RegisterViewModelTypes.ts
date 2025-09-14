import {
  Control,
  UseFormGetFieldState,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
} from 'react-hook-form';
import { RegisterFormData } from '../../core/dtos/RegisterFormData';

export type UseRegisterViewModelReturn = {
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData, any>;
  onSubmit: (any: any) => any;
  getFieldState: UseFormGetFieldState<RegisterFormData>;
  getValues: UseFormGetValues<RegisterFormData>;
  errors: object | any;
  setValue: UseFormSetValue<RegisterFormData>;
  reset: () => void;
};
