"use client";
import React, { useState } from 'react';
import styles from '../styles.module.css';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/services/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin({ userOrEmail: email, password });
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        router.push('/hs_admin/pending');
      } else {
        setError('Credenciales inválidas');
      }
    } catch {
      setError('Error en el servidor');
    } finally { setLoading(false); }
  }

  return (
    <main className={styles.container}>
      <h1>Admin login</h1>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.label}>Email</label>
        <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className={styles.label}>Password</label>
        <input type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className={styles.serverError}>{error}</div>}
        <div className={styles.actions}>
          <button className={styles.submit} disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </div>
      </form>
    </main>
  );
}
