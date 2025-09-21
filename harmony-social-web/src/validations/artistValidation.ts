import { ArtistRequestDTO } from '../types/artist/ArtistRequestDTO';

export interface ValidationErrors {
  artist_name?: string;
  biography?: string;
  formation_year?: string;
  country_code?: string;
  general?: string;
}

const currentYear = new Date().getFullYear();

export function validateArtistRequest(dto: ArtistRequestDTO): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!dto.artist_name || dto.artist_name.trim().length < 2) {
    errors.artist_name = 'El nombre artístico debe tener al menos 2 caracteres.';
  } else if (dto.artist_name.trim().length > 100) {
    errors.artist_name = 'El nombre artístico no puede exceder 100 caracteres.';
  }

  if (dto.biography && dto.biography.length > 1000) {
    errors.biography = 'La biografía no puede exceder 1000 caracteres.';
  }

  if (dto.formation_year !== undefined && dto.formation_year !== '') {
    const y = Number(dto.formation_year);
    if (Number.isNaN(y) || !Number.isInteger(y)) {
      errors.formation_year = 'Año de formación inválido.';
    } else if (y < 1900 || y > currentYear) {
      errors.formation_year = `El año debe estar entre 1900 y ${currentYear}.`;
    }
  }

  // Accept either ISO-2 (2 letters) or CCA3 (3 letters)
  if (dto.country_code && !/^[A-Za-z]{2,3}$/.test(dto.country_code)) {
    errors.country_code = 'Código de país inválido.';
  }

  return errors;
}

export default validateArtistRequest;
