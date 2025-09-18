// DTO para crear un artista
import Joi from "joi";

export interface ArtistCreateRequest {
  artist_name: string;
  biography?: string;
  verified: boolean;
  formation_year: number;
  country_code?: string;
}

export const ArtistCreateRequestSchema = Joi.object<ArtistCreateRequest>({
  artist_name: Joi.string().min(2).max(100).required(),
  biography: Joi.string().max(1000).optional(),
  verified: Joi.boolean().required(),
  formation_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  country_code: Joi.string().max(6).optional(),
});
