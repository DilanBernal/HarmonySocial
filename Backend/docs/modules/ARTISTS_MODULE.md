# Módulo: Artistas

## Propósito

Gestionar perfiles de artistas con flujo de revisión (aceptar/rechazar) y transición automática de rol al ser aceptado.

## Modelo

- id
- artist_name
- biography
- formation_year
- country_code
- status (PENDING, ACTIVE, REJECTED, DELETED)
- user_id (relación con usuario creador)

## Reglas de Estado

Creación pública: POST `/api/artists` — crea siempre un artista en estado `PENDING`.
Creación por administrador: POST `/api/artists/admin` — crea el artista en estado `ACTIVE` y `verified=true`.

- Update: no modifica status.
- Accept: PENDING -> ACTIVE (asigna rol artist a user asociado).
- Reject: PENDING -> REJECTED.
- Delete lógico: status -> DELETED.

## Endpoints (prefijo /api/artists)

## Endpoints (prefijo /api/artists)

POST / (public): crea solicitud PENDING

- GET / (filtros name, country, status)
- GET /:id
- PUT /:id
- DELETE /:id
- PUT /:id/accept
- PUT /:id/reject

## Permisos Requeridos

- artist.create
- artist.update
- artist.delete
- artist.accept
- artist.reject

## Errores Clave

- 409 transiciones inválidas.
- 404 no encontrado.

Nota: La ruta `POST /admin` está pensada para uso por personal con permiso `ARTIST_CREATE` y crea perfiles activos sin asociar usuario automáticamente.
