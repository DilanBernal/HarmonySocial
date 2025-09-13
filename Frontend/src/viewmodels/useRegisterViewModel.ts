import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import {
  RegisterDTO,
  INITIAL_REGISTER_FORM,
  REGISTER_STEPS,
  transformToRegisterDTO,
} from '../core/dtos/RegisterDTO';
import { StepValidation } from '../core/types/StepValidation';
import { RegisterFormData } from '../core/dtos/RegisterFormData';
// Agregar import del servicio
import { AuthUserService } from '../core/services/user/auth/AuthUserService';
import { UseRegisterViewModelReturn } from './types/RegisterViewModelTypes';
import { stepValidationSchemas } from './types/stepValidationSchemas';

// Clave para persistencia local
const STORAGE_KEY = '@harmony_register_form';

export const useRegisterViewModel = (): UseRegisterViewModelReturn => {
  const [formData, setFormData] = useState<RegisterFormData>(
    INITIAL_REGISTER_FORM,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidations, setStepValidations] = useState<
    Record<number, StepValidation>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = REGISTER_STEPS.length;
  const isCurrentStepValid = stepValidations[currentStep]?.isValid || false;

  // Auto-save cuando cambian los datos
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Instancia del servicio
  const authService = useRef(new AuthUserService()).current;

  /**
   * Guarda progreso en almacenamiento local
   */
  const saveProgress = useCallback(async () => {
    try {
      const progressData = {
        formData,
        currentStep,
        stepValidations,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [formData, currentStep, stepValidations]);

  /**
   * Carga progreso desde almacenamiento local
   */
  const loadProgress = useCallback(async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const progressData = JSON.parse(savedData);

        // Solo cargar si los datos son recientes (menos de 24 horas)
        const dayInMs = 24 * 60 * 60 * 1000;
        if (Date.now() - progressData.timestamp < dayInMs) {
          setFormData(progressData.formData || INITIAL_REGISTER_FORM);
          setCurrentStep(progressData.currentStep || 1);
          setStepValidations(progressData.stepValidations || {});
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  /**
   * Valida el paso actual
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const schema =
      stepValidationSchemas[currentStep as keyof typeof stepValidationSchemas];
    const stepFields = REGISTER_STEPS[currentStep - 1]?.fields || [];

    // Extraer solo los campos del paso actual
    const stepData = stepFields.reduce(
      (acc: Record<string, any>, field: string) => {
        acc[field] = formData[field as keyof RegisterFormData];
        return acc;
      },
      {} as Partial<RegisterFormData>,
    );

    try {
      await schema.validate(stepData, { abortEarly: false });

      setStepValidations(prev => ({
        ...prev,
        [currentStep]: { isValid: true, errors: {} },
      }));

      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};

        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });

        setStepValidations(prev => ({
          ...prev,
          [currentStep]: { isValid: false, errors },
        }));
      }

      return false;
    }
  }, [currentStep, formData]);

  // Cargar progreso al inicializar
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-guardar con debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProgress();
    }, 1000); // Guarda después de 1 segundo de inactividad

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveProgress]);

  /**
   * Actualiza un campo del formulario
   */
  const updateField = useCallback(
    <K extends keyof RegisterFormData>(
      field: K,
      value: RegisterFormData[K],
    ) => {
      setFormData((prev: RegisterFormData) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  // Re-validar cuando cambian los datos o el paso
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateCurrentStep();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [validateCurrentStep]);

  /**
   * Navega al siguiente paso
   */
  const goToNextStep = useCallback(async () => {
    const isValid = await validateCurrentStep();

    if (!isValid) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps, validateCurrentStep]);

  /**
   * Navega al paso anterior
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  /**
   * Navega a un paso específico
   */
  const goToStep = useCallback(
    async (step: number) => {
      if (step < 1 || step > totalSteps) {
        return;
      }

      // Si va hacia atrás, permitir sin validación
      if (step < currentStep) {
        setCurrentStep(step);
        return;
      }

      // Si va hacia adelante, validar pasos intermedios
      for (let i = currentStep; i < step; i++) {
        setCurrentStep(i);
        const isValid = await validateCurrentStep();
        if (!isValid) {
          return;
        }
      }

      setCurrentStep(step);
    },
    [currentStep, totalSteps, validateCurrentStep],
  );

  /**
   * Verifica si se puede navegar a un paso específico
   */
  const canNavigateToStep = useCallback(
    (step: number): boolean => {
      if (step < 1 || step > totalSteps) {
        return false;
      }

      // Siempre puede ir hacia atrás
      if (step <= currentStep) {
        return true;
      }

      // Para ir hacia adelante, verificar que pasos anteriores sean válidos
      for (let i = 1; i < step; i++) {
        if (!stepValidations[i]?.isValid) {
          return false;
        }
      }

      return true;
    },
    [currentStep, totalSteps, stepValidations],
  );

  /**
   * Obtiene información del paso
   */
  const getStepInfo = useCallback((step: number) => {
    return REGISTER_STEPS[step - 1];
  }, []);

  /**
   * Envía el registro al backend
   */
  const submitRegistration = useCallback(async () => {
    setIsLoading(true);

    try {
      // Validar todos los pasos
      for (let i = 1; i <= totalSteps; i++) {
        setCurrentStep(i);
        const isValid = await validateCurrentStep();
        if (!isValid) {
          throw new Error(`Step ${i} validation failed`);
        }
      }

      // Transformar datos al DTO del backend
      const registerDTO: RegisterDTO = transformToRegisterDTO(formData);

      // Llamada real al API usando el servicio
      const response = await authService.register(registerDTO);

      console.log('Registration successful:', response.data);

      // Limpiar datos guardados en éxito
      await AsyncStorage.removeItem(STORAGE_KEY);

      return response.data; // Retornar datos de respuesta
    } catch (error: any) {
      console.error('Registration failed:', error);

      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error del servidor (4xx, 5xx)
        const errorMessage =
          error.response.data?.message || 'Error del servidor';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Error de red
        throw new Error('Error de conexión. Verifica tu internet.');
      } else {
        // Error de validación u otro
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, totalSteps, validateCurrentStep, authService]);

  /**
   * Resetea el formulario
   */
  const resetForm = useCallback(async () => {
    setFormData(INITIAL_REGISTER_FORM);
    setCurrentStep(1);
    setStepValidations({});
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // Estado
    formData,
    currentStep,
    totalSteps,
    stepValidations,
    isCurrentStepValid,
    isLoading,

    // Navegación
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Formulario
    updateField,
    validateCurrentStep,
    submitRegistration,

    // Utilidades
    getStepInfo,
    canNavigateToStep,
    resetForm,

    // Persistencia
    saveProgress,
    loadProgress,
  };
};
