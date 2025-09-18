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

- Creación: siempre PENDING.
- Update: no modifica status.
- Accept: PENDING -> ACTIVE (asigna rol artist a user asociado).
- Reject: PENDING -> REJECTED.
- Delete lógico: status -> DELETED.

## Endpoints (prefijo /api/artists)

- POST /
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
