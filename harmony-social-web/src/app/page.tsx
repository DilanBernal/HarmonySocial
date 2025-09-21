"use client";
import Image from 'next/image';
import landingStyles from './styles/landing.module.css';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-harmony-bg text-white flex flex-col items-center justify-center px-4">
      <header className="w-full max-w-4xl flex flex-col items-center py-12 relative">
        <div className="absolute inset-0 -z-10">
          <Image src="https://tse3.mm.bing.net/th/id/OIP._SWuM6c_aSwD1UXqceiq7gHaFJ?rs=1&pid=ImgDetMain&o=7&rm=3" alt="background 1" fill style={{ objectFit: 'cover', opacity: 0.06 }} />
        </div>
        <div className="absolute right-0 top-6 -z-10">
          <Image src="https://tse1.explicit.bing.net/th/id/OIP.eaU7ch0f_makLZAzCcCyoAHaFS?rs=1&pid=ImgDetMain&o=7&rm=3" alt="background 2" width={220} height={140} style={{ objectFit: 'cover', opacity: 0.06 }} />
        </div>
        <Image src="/file.svg" alt="Harmony Social Logo" width={80} height={80} className="mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-harmony-blue-light text-center mb-4 drop-shadow-lg">
          Harmony Social
        </h1>
        <p className="text-lg md:text-xl text-harmony-blue-light text-center max-w-2xl mb-6">
          Aprende música, comparte tu trabajo y solicita tu perfil de artista. El registro es inmediato; la aprobación de un perfil como artista será revisada por nuestro equipo.
        </p>
        <a href="/register-artist" className="bg-harmony-blue hover:bg-harmony-accent text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 mt-2">
          Regístrate gratis
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

      <section className="w-full max-w-6xl my-12">
        <h2 className="text-3xl font-bold text-harmony-accent text-center mb-6">Historias de aprendizaje</h2>
  <div className={"gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 " + landingStyles.gallery}>
          <div className="gallery-card overflow-hidden rounded-lg shadow-lg">
            <Image src="https://tse3.mm.bing.net/th/id/OIP._SWuM6c_aSwD1UXqceiq7gHaFJ?rs=1&pid=ImgDetMain&o=7&rm=3" alt="estudiando musica 1" width={600} height={360} className="w-full h-56 object-cover" />
          </div>
          <div className="gallery-card overflow-hidden rounded-lg shadow-lg">
            <Image src="https://tse1.explicit.bing.net/th/id/OIP.eaU7ch0f_makLZAzCcCyoAHaFS?rs=1&pid=ImgDetMain&o=7&rm=3" alt="estudiando musica 2" width={600} height={360} className="w-full h-56 object-cover" />
          </div>
          <div className="gallery-card overflow-hidden rounded-lg shadow-lg">
            <Image src="https://tse2.mm.bing.net/th/id/OIP.hh-_Oot4VJuC2w8GZC5QbQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3" alt="estudiando musica 3" width={600} height={360} className="w-full h-56 object-cover" />
          </div>
          <div className="gallery-card overflow-hidden rounded-lg shadow-lg">
            <Image src="https://tse1.explicit.bing.net/th/id/OIP.-X8onKnNfwQtLh-x5Gny4wHaD4?rs=1&pid=ImgDetMain&o=7&rm=3" alt="estudiando musica 4" width={600} height={360} className="w-full h-56 object-cover" />
          </div>
          <div className="gallery-card overflow-hidden rounded-lg shadow-lg md:col-span-2">
            <Image src="https://64.media.tumblr.com/24f2cf27ea3b757bcc7c0c792390c7ca/573aa293c81985ba-85/s1280x1920/41614f2021f12804efe3fcc403a5093f49162e22.jpg" alt="estudiando musica 5" width={1200} height={800} className="w-full h-80 object-cover" />
          </div>
        </div>
      </section>

      <footer className="w-full max-w-4xl text-center text-harmony-blue-light py-8 border-t border-harmony-card mt-8">
        <p className="mb-2">Contribuyendo a la <span className="text-harmony-accent font-semibold">Educación de calidad (ODS 4)</span> y el acceso igualitario a la música.</p>
        <p className="text-xs">&copy; {new Date().getFullYear()} Harmony Social. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
