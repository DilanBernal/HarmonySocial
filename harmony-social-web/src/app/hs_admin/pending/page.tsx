"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import { getPendingArtists, acceptArtist, rejectArtist } from '@/services/adminArtistService';

type PendingArtist = { id: number; artist_name: string; country_code?: string };

export default function AdminPendingPage() {
  const [items, setItems] = useState<PendingArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getPendingArtists();
      setItems((res || []) as PendingArtist[]);
    } catch {
      setError('No se pudo cargar');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function onAccept(id: number) {
    await acceptArtist(id);
    setItems((s) => s.filter((x) => x.id !== id));
  }

  async function onReject(id: number) {
    await rejectArtist(id);
    setItems((s) => s.filter((x) => x.id !== id));
  }

  return (
    <main className={styles.container}>
      <h1>Artistas pendientes</h1>
      {loading && <div>Cargando...</div>}
      {error && <div className={styles.serverError}>{error}</div>}
      <ul>
        {items.map((a) => (
          <li key={a.id} style={{ marginBottom: 12 }}>
            <strong>{a.artist_name}</strong> — {a.country_code}
            <div style={{ marginTop: 6 }}>
              <button className={styles.button} onClick={() => onAccept(a.id)}>Aceptar</button>
              <button className={styles.button} style={{ marginLeft: 8 }} onClick={() => onReject(a.id)}>Rechazar</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
