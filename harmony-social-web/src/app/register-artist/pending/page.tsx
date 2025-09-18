import React from 'react';
import Link from 'next/link';
import styles from '../styles.module.css';

export default function PendingPage() {
  return (
    <main className={styles.container}>
      <h1>Solicitud enviada</h1>
      <p>Tu solicitud ha sido creada y está en estado <strong>PENDIENTE</strong>. Quedate pendiente.</p>
      <p>Mientras tanto, puedes descargar la aplicación web y registrarte como usuario</p>
      <div className={styles.actions}>
        <Link href="/" className={styles.button}>Ir al inicio</Link>
        <Link href="/profile" aria-disabled="true" className={styles.button}>Descargar la app</Link>
      </div>
    </main>
  );
}
