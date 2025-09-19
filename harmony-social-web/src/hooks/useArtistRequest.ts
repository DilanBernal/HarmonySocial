import { useState } from 'react';
import { createArtist } from '../services/artistService';
import { ArtistRequestDTO } from '../types/artist/ArtistRequestDTO';
import { validateArtistRequest, ValidationErrors } from '../validations/artistValidation';

export function useArtistRequest() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverErrors, setServerErrors] = useState<Record<string, unknown> | null>(null);

  async function submit(dto: ArtistRequestDTO) {
    setServerErrors(null);
    const v = validateArtistRequest(dto);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      return { ok: false, status: 400, errors: v, fieldErrors: v };
    }

    setLoading(true);
    try {
      const res = await createArtist(dto);
      if (res.status === 201) {
        return { ok: true, status: 201, data: res.data };
      }

      // handle known statuses
      if (res.status === 400) {
        // try to normalize backend validation response
        // backend returns { message: 'Validation error', details: [ ... ] } (Joi)
        const data = res.data as unknown;
        let fieldErrors: Record<string, string> | undefined;
        if (data && typeof data === 'object') {
          const maybeDetails = (data as Record<string, unknown>)['details'];
          if (Array.isArray(maybeDetails)) {
            fieldErrors = {};
            maybeDetails.forEach((d) => {
              if (typeof d === 'string') {
                const m = d.match(/"?(artist_name|biography|formation_year|country_code)"?/i);
                if (m) fieldErrors![m[1]] = d;
              }
            });
          }
        }
        setServerErrors(res.data);
        return { ok: false, status: 400, errors: res.data, fieldErrors };
      }
      if (res.status === 401 || res.status === 403) {
        setServerErrors(res.data || { message: 'No autorizado. Inicia sesión.' });
        return { ok: false, status: res.status, errors: res.data };
      }
      if (res.status === 409) {
        setServerErrors(res.data || { message: 'Conflicto de negocio.' });
        return { ok: false, status: 409, errors: res.data };
      }

  setServerErrors(res.data || { message: 'Error del servidor.' });
  return { ok: false, status: res.status || 500, errors: res.data };
    } catch {
      setServerErrors({ message: 'Fallo de red o error inesperado.' });
      return { ok: false, status: 0, errors: { general: 'Fallo de red o error inesperado.' } };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    errors,
    serverErrors,
    submit,
  } as const;
}

export default useArtistRequest;
