# Módulo: Canciones

## Estado

Implementación base (CRUD y endpoints correspondientes) – detalles específicos pueden ampliarse.

## Propósito

Gestionar entidades Song asociadas posiblemente a artistas/usuarios.

## Modelo (estimado)

- id
- title
- artist_id / user_id (según diseño)
- duration
- created_at / updated_at

## Endpoints (prefijo /api/songs)

Consultar `songs.routes.ts` para la lista exacta.

## Validaciones

- Título requerido.
- Duración positiva.

## Extensiones Futuras

- Asociar permisos song.create / song.update.
- Relación explícita con Artist.
- Paginación y búsqueda avanzada.
