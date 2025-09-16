"use client";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-harmony-bg text-white flex flex-col items-center justify-center px-4">
      <header className="w-full max-w-4xl flex flex-col items-center py-12">
        <img src="/file.svg" alt="Harmony Social Logo" className="w-20 h-20 mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-harmony-blue-light text-center mb-4 drop-shadow-lg">
          Harmony Social
        </h1>
        <p className="text-lg md:text-xl text-harmony-blue-light text-center max-w-2xl mb-6">
          La plataforma donde puedes aprender música, compartir tus canciones originales o covers, y conectar con una comunidad que te apoya a crecer como artista.
        </p>
        <a href="/register" className="bg-harmony-blue hover:bg-harmony-accent text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 mt-2">
          ¡Únete gratis!
        </a>
      </header>

      <section className="w-full max-w-4xl grid md:grid-cols-2 gap-8 my-12">
        <div className="card">
          <h2 className="text-2xl font-bold text-harmony-accent mb-2">Aprende y enseña música</h2>
          <p className="text-harmony-blue-light mb-2">Accede a recursos educativos, tutoriales interactivos y recibe consejos de expertos y otros músicos.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-harmony-accent mb-2">Comparte tu talento</h2>
          <p className="text-harmony-blue-light mb-2">Sube tus canciones originales o covers, recibe likes, comentarios y comparte tu pasión con el mundo.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-harmony-accent mb-2">Comunidad inclusiva</h2>
          <p className="text-harmony-blue-light mb-2">Sin importar tu nivel o recursos, aquí puedes aprender, enseñar y disfrutar de la música en un ambiente seguro y diverso.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-harmony-accent mb-2">Gamificación y perfiles</h2>
          <p className="text-harmony-blue-light mb-2">Crea tu perfil, gana logros y motívate a seguir aprendiendo e interactuando con la app.</p>
        </div>
      </section>

      <footer className="w-full max-w-4xl text-center text-harmony-blue-light py-8 border-t border-harmony-card mt-8">
        <p className="mb-2">Contribuyendo a la <span className="text-harmony-accent font-semibold">Educación de calidad (ODS 4)</span> y el acceso igualitario a la música.</p>
        <p className="text-xs">&copy; {new Date().getFullYear()} Harmony Social. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
