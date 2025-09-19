import axios, { AxiosResponse } from 'axios';
import { ArtistRequestDTO } from '../types/artist/ArtistRequestDTO';

export async function createArtist(body: ArtistRequestDTO): Promise<{ status: number; data: Record<string, unknown> | null }> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4666';
  const url = `${base}/api/artists`;

  const token = (typeof window !== 'undefined')
    ? (localStorage.getItem('token') || localStorage.getItem('Authorization') || '')
    : '';

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = token.startsWith('Bearer') ? token : `Bearer ${token}`;

  const payload: Record<string, unknown> = {
    artist_name: body.artist_name,
  };
  if (body.biography) payload.biography = body.biography;
  if (body.formation_year !== undefined && body.formation_year !== '') payload.formation_year = Number(body.formation_year);
  if (body.country_code) payload.country_code = body.country_code;

  try {
    const response: AxiosResponse = await axios.post(url, payload, { headers });
    const data = (response.data && typeof response.data === 'object') ? response.data as Record<string, unknown> : null;
    return { status: response.status, data };
  } catch (err) {
    // Handle axios errors safely without using `any`
    if (axios.isAxiosError(err)) {
      const status = err.response?.status || 0;
      const data = err.response?.data && typeof err.response.data === 'object' ? err.response.data : null;
      console.error('createArtist axios error', err.message);
      return { status, data };
    }
    console.error('createArtist unknown error', err);
    return { status: 0, data: null };
  }
}

const artistService = { createArtist };
export default artistService;
