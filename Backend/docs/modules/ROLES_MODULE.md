# Módulo: Roles

## Propósito

Agrupar permisos asignables a usuarios para control de acceso (RBAC) y retirar flags como is_artist.

## Modelo

- Role: id, name (único), description, created_at
- UserRole: id, user_id, role_id, created_at

## Flujos

1. Creación de rol (admin).
2. Asignación y remoción de roles a usuarios.
3. Obtención de roles de un usuario y usuarios por rol.

## Endpoints (prefijos /api/roles y /api/user-roles)

- POST /roles
- GET /roles
- GET /roles/:id
- PUT /roles/:id
- DELETE /roles/:id
- POST /user-roles (assign)
- DELETE /user-roles/:userId/:roleId
- GET /user-roles/roles/:userId
- GET /user-roles/users/:roleName

## Integración con Permisos

- Roles agregan lista de permissions; flatten se incluye en JWT.

## Errores

- 409 nombre duplicado.
- 404 role/user no encontrado.
