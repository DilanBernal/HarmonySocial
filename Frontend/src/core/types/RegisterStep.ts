import { RegisterFormData } from '../dtos/RegisterFormData';

/**
 * Configuración de cada paso del registro
 */

export interface RegisterStep {
  id: number;
  title: string;
  description: string;
  fields: (keyof RegisterFormData)[];
}
