/**
 * Estado de validación por cada paso
 */

export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
