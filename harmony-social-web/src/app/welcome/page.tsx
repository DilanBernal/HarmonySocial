import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-harmony-bg text-white">
      <div className="bg-harmony-card rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-harmony-accent">¡Bienvenido a Harmony Social!</h1>
        <p className="text-lg mb-6 text-harmony-blue-light text-center">Tu cuenta ha sido confirmada exitosamente. Ahora puedes disfrutar de todas las funcionalidades de la app.</p>
  <Link href="/" className="bg-harmony-blue hover:bg-harmony-accent text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">Ir al inicio</Link>
      </div>
    </div>
  );
}
