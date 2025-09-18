"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { artistRequestSchema, type ArtistFormValues } from '@/validations/artistSchema';
import { createArtistAsAdmin } from '@/services/adminArtistService';
import { useRouter } from 'next/navigation';

export default function AdminCreateArtistPage() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('Authorization')) : null;
    if (!token) router.replace('/hs_admin/login');
  }, [router]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ArtistFormValues>({
    resolver: zodResolver(artistRequestSchema) as Resolver<ArtistFormValues, unknown>,
    defaultValues: { artist_name: '', biography: '', formation_year: undefined, country_code: '' },
  });

  const onSubmit: SubmitHandler<ArtistFormValues> = async (data) => {
    setLoading(true); setMessage(null);
    try {
      const res = await createArtistAsAdmin(data);
      if (res && res.id) setMessage(`Artista creado: ${res.id}`);
    } catch (e) { setMessage('Error creando artista'); }
    setLoading(false);
  };

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
