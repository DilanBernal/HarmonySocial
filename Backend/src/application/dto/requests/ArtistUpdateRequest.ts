// DTO para actualizar un artista
import Joi from "joi";

export interface ArtistUpdateRequest {
  artist_name?: string;
  biography?: string;
  verified?: boolean;
  formation_year?: number;
  country_code?: string;
}

export const ArtistUpdateRequestSchema = Joi.object<ArtistUpdateRequest>({
  artist_name: Joi.string().min(2).max(100).optional(),
  biography: Joi.string().max(1000).optional(),
  verified: Joi.boolean().optional(),
  formation_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  country_code: Joi.string().max(6).optional(),
});
