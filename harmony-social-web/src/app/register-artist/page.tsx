"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useArtistRequest from '../../hooks/useArtistRequest';
import type { ArtistRequestDTO } from '../../types/artist/ArtistRequestDTO';
import styles from './styles.module.css';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistRequestSchema, ArtistFormValues } from '../../validations/artistSchema';

export default function ArtistRequestPage() {
  const router = useRouter();
  const { loading, serverErrors, submit } = useArtistRequest();
  const { register, handleSubmit, formState: { errors }, setError, reset, setFocus, getValues } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistRequestSchema) as unknown as Resolver<ArtistFormValues>,
    defaultValues: { artist_name: '', biography: '', formation_year: undefined, country_code: '' },
  });

  useEffect(() => {
    setFocus('artist_name');
  }, [setFocus]);

  const [countries, setCountries] = useState<Array<{ cca3: string; name: { common: string } }>>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3');
        if (!res.ok) throw new Error('No se pudo obtener la lista de países');
        const data = await res.json() as Array<{ cca3?: string; name?: { common?: string } }>;
        if (!mounted) return;
        // filter valid entries and map and sort alphabetically by common name
        const mapped = data
          .filter((c): c is { cca3: string; name: { common: string } } => !!c && typeof c.cca3 === 'string' && !!c.name && typeof c.name.common === 'string')
          .map((c) => ({ cca3: c.cca3, name: { common: c.name.common } }));
        mapped.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(mapped);
      } catch (e) {
        console.error('Error loading countries', e);
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    }
    loadCountries();
    return () => { mounted = false; };
  }, []);

  // initial focus set via react-hook-form setFocus in another effect

  async function onSubmit(dto: ArtistFormValues) {
    if (loading) return;
    const res = await submit(dto as ArtistRequestDTO);
    if (res.ok && res.status === 201) {
      reset();
      router.push('/register-artist/pending');
      return;
    }
    if (res.status === 401 || res.status === 403) {
      alert('No autorizado. Inicia sesión.');
      router.push('/login');
      return;
    }

    // Prefer structured fieldErrors returned by the hook
    if (res.status === 400) {
      const fe = (res as unknown as Record<string, unknown>)['fieldErrors'] as Record<string, string> | undefined;
      if (fe) {
        Object.keys(fe).forEach((k) => {
          if (['artist_name', 'biography', 'formation_year', 'country_code'].includes(k)) {
            setError(k as keyof ArtistFormValues, { type: 'server', message: fe[k] });
          }
        });
      }
    } else if (res.status === 400 && res.errors) {
      // fallback: try to parse Joi-like details array
      const details = (res.errors as unknown) as { details?: unknown };
      const arr = Array.isArray(details.details) ? details.details : undefined;
      if (arr) {
        arr.forEach((d: unknown) => {
          if (typeof d === 'string') {
            const m = d.match(/"?(artist_name|biography|formation_year|country_code)"?/i);
            if (m) setError(m[1] as keyof ArtistFormValues, { type: 'server', message: d });
            else setError('artist_name', { type: 'server', message: d });
          }
        });
      }
    }
    if (res.status === 409 && res.errors && typeof res.errors === 'object') {
      const msg = (res.errors as unknown as Record<string, unknown>)['message'];
      if (typeof msg === 'string') setError('artist_name', { type: 'manual', message: msg });
    }
  }

  return (
    <main className={styles.container}>
      <h1>Solicitar ser Artista</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <label className={styles.label} htmlFor="artist_name">Nombre artístico *</label>
        <input
          id="artist_name"
          className={styles.input}
          {...register('artist_name')}
          aria-invalid={!!errors.artist_name}
          aria-describedby={errors.artist_name ? 'artist_name_error' : undefined}
        />
        { errors.artist_name && (
          <div id="artist_name_error" className={styles.error}>{errors.artist_name.message}</div>
        ) }

        <label className={styles.label} htmlFor="biography">Biografía</label>
        <textarea
          id="biography"
          className={styles.textarea}
          {...register('biography')}
          aria-invalid={!!errors.biography}
        />
        { errors.biography && <div className={styles.error}>{errors.biography.message}</div> }

        <label className={styles.label} htmlFor="formation_year">Año de formación</label>
        <input
          id="formation_year"
          type="number"
          className={styles.input}
          {...register('formation_year')}
          aria-invalid={!!errors.formation_year}
        />
        { errors.formation_year && <div className={styles.error}>{errors.formation_year.message}</div> }

<p> valor del selecr{getValues("country_code")}</p>
        <label className={styles.label} htmlFor="country_code">País (selecciona para usar CCA3)</label>
        <select id="country_code" className={styles.select} {...register('country_code')} aria-invalid={!!errors.country_code}>
          <option value="">-- Selecciona un país --</option>
          {countries.map((c) => (
            <option key={c.cca3} value={c.cca3}>{c.name.common} ({c.cca3})</option>
          ))}
        </select>
        { loadingCountries && <div className={styles.label}>Cargando países...</div> }
        { errors.country_code && <div className={styles.error}>{errors.country_code.message}</div> }

        { (() => {
          if (!serverErrors || typeof serverErrors !== 'object') return null;
          const maybeMessage = (serverErrors as Record<string, unknown>)['message'];
          if (typeof maybeMessage === 'string') return <div className={styles.serverError}>{maybeMessage}</div>;
          return null;
        })() }

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={loading} aria-busy={loading}>
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </main>
  );
}
