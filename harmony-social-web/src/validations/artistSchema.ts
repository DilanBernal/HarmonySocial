import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const artistRequestSchema = z.object({
  artist_name: z.string().min(2, 'El nombre artístico debe tener al menos 2 caracteres.').max(100, 'El nombre artístico no puede exceder 100 caracteres.'),
  biography: z.string().max(1000, 'La biografía no puede exceder 1000 caracteres.').optional().or(z.literal('')),
  formation_year: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? val : n;
  }, z.number().int().min(1900, `El año debe estar entre 1900 y ${currentYear}.`).max(currentYear, `El año debe estar entre 1900 y ${currentYear}.`).optional()),
  country_code: z.preprocess((val) => {
    if (typeof val === 'string') {
      const s = val.trim();
      return s === '' ? undefined : s.toUpperCase();
    }
    return val;
  }, z.string().refine((s) => typeof s === 'string' && (s.length === 2 || s.length === 3), { message: 'Código de país inválido. Debe ser ISO-2 o CCA3.' }).regex(/^[A-Z]{2,3}$/, 'Código de país inválido.').optional()),
});

export type ArtistFormValues = z.infer<typeof artistRequestSchema>;

export default artistRequestSchema;
