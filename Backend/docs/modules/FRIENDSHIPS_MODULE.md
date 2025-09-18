# Módulo: Amistades

## Propósito

Manejar solicitudes y relaciones de amistad entre usuarios (similar a social graph simple).

## Modelo

- id
- user_id
- friend_id
- status (PENDING, ACCEPTED, REJECTED)
- created_at / updated_at

## Reglas

- No duplicar relaciones activas.
- Permitir nueva solicitud si la anterior fue REJECTED (el backend la recrea tras eliminar la vieja).

## Endpoints (prefijo /api/friendships)

- POST / (crear solicitud)
- PUT /accept?id=ID
- PUT /reject?id=ID
- GET /user/:id
- DELETE /:id
- DELETE /users (body user_id, friend_id)

## Estados

- PENDING -> ACCEPTED / REJECTED (transiciones únicas).

## Validaciones

- Ambos usuarios deben existir.
- Evitar auto-solicitudes.

## Errores Clave

- 400 validación o ya existe relación.
- 404 inexistente.
