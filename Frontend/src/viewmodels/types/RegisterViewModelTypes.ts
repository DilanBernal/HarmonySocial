import { REGISTER_STEPS } from '../../core/dtos/REGISTER_STEPS';
import { StepValidation } from '../../core/types/StepValidation';
import { RegisterFormData } from '../../core/dtos/RegisterFormData';

export interface UseRegisterViewModelReturn {
  // Estado del formulario
  formData: RegisterFormData;
  currentStep: number;
  totalSteps: number;

  // Estado de validación
  stepValidations: Record<number, StepValidation>;
  isCurrentStepValid: boolean;
  isLoading: boolean;

  // Acciones de navegación
  goToNextStep: () => Promise<void>;
  goToPreviousStep: () => void;
  goToStep: (step: number) => Promise<void>;

  // Acciones de formulario
  updateField: <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => void;
  validateCurrentStep: () => Promise<boolean>;
  submitRegistration: () => Promise<void>;

  // Utilidades
  getStepInfo: (step: number) => (typeof REGISTER_STEPS)[0];
  canNavigateToStep: (step: number) => boolean;
  resetForm: () => void;

  // Persistencia
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}
