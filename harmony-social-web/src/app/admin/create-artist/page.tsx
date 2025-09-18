"use client";
import React, { useState } from 'react';
import styles from './styles.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { artistRequestSchema, type ArtistFormValues } from '@/validations/artistSchema';

export default function AdminCreateArtistPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistRequestSchema) as Resolver<ArtistFormValues, unknown>,
    defaultValues: { artist_name: '', biography: '', formation_year: undefined, country_code: '' },
  });

  const onSubmit: SubmitHandler<ArtistFormValues> = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('Authorization');
      const res = await fetch('/api/artists/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (res.status === 201) {
        const json = await res.json();
        setMessage(`Artista creado con id ${json.id}`);
      } else if (res.status === 401 || res.status === 403) {
        setMessage('No autorizado. Revisa tus permisos.');
      } else {
        const err = await res.json().catch(() => null);
        setMessage((err && err.message) || 'Error creando artista');
      }
    } catch {
      setMessage('Error de red al crear artista');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <h1>Crear artista (Admin)</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.label}>Nombre artístico *</label>
        <input className={styles.input} {...register('artist_name')} />
        {errors.artist_name && <div className={styles.error}>{errors.artist_name.message}</div>}

        <label className={styles.label}>Biografía</label>
        <textarea className={styles.textarea} {...register('biography')} />

        <label className={styles.label}>Año de formación</label>
        <input type="number" className={styles.input} {...register('formation_year')} />

        <label className={styles.label}>Código de país (CCA3 o ISO-2)</label>
        <input className={styles.input} {...register('country_code')} />

        {message && <div className={styles.serverError}>{message}</div>}

        <div className={styles.actions}>
          <button className={styles.submit} disabled={loading}>{loading ? 'Creando...' : 'Crear artista'}</button>
        </div>
      </form>
    </main>
  );
}
