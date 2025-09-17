# API Documentation

## Roles y Control de Acceso

### Objetivo

Separar la lógica de privilegios mediante roles y (en fase posterior) permisos. Se eliminan banderas como `is_artist` y se reemplaza por asignaciones dinámicas de roles.

### Tablas (Modelo Actual)

- `roles`: (id, name, description, created_at, updated_at)
- `user_roles`: (id, user_id, role_id, created_at)
- (Pendiente en fase permisos) `permissions`, `role_permissions`.

### Roles Semilla Sugeridos

- `common_user`: Rol por defecto al registrarse.
- `artist`: Se asigna al aprobar un perfil de artista (o manualmente por admin).
- `admin`: Puede crear artistas sin aprobación y aprobar/rechazar.

### Endpoints Roles

Base: `/api/roles`

| Método | Ruta | Descripción            | Auth |
| ------ | ---- | ---------------------- | ---- |
| POST   | /    | Crea un rol            | Sí   |
| GET    | /    | Lista roles            | Sí   |
| GET    | /:id | Obtiene rol por id     | Sí   |
| PUT    | /:id | Actualiza nombre/descr | Sí   |
| DELETE | /:id | Elimina rol            | Sí   |

Body Crear:

```
{ "name": "artist", "description": "Rol para perfiles de artistas" }
```

### Endpoints User-Roles

Base: `/api/user-roles`

| Método | Ruta             | Descripción                                  |
| ------ | ---------------- | -------------------------------------------- |
| POST   | /                | Asigna rol a usuario (body {userId, roleId}) |
| DELETE | /:userId/:roleId | Quita rol de usuario                         |
| GET    | /roles/:userId   | Lista roles de un usuario                    |
| GET    | /users/:roleName | Lista IDs de usuarios que tienen ese rol     |

### Flujo de Registro

1. Usuario se registra -> se asigna `common_user` automáticamente (pendiente conectar a UserService).
2. Si crea perfil de artista -> estado PENDING hasta aprobación.
3. Al aprobar perfil (endpoint accept artista) -> asignar rol `artist` si no existe.

### Artist vs Artist-Users

`/api/artists` maneja entidad Artist (biografía, status). Próximo endpoint `/api/artist-users` listará usuarios (app_user) con rol `artist` y permitirá buscarlos como cuentas reclamadas. Si Artist tiene `artist_user_id` null, un usuario podrá reclamarlo (fase futura).

### JWT (Pendiente Integración)

Se añadirá `roles: ["common_user","artist"]` en el payload tras login. Más adelante: `perms` para permisos derivados.

### Errores Relevantes

| Código                  | Uso                               |
| ----------------------- | --------------------------------- |
| VALUE_NOT_FOUND         | Rol o asignación inexistente      |
| BUSINESS_RULE_VIOLATION | Duplicidad de nombre de rol, etc. |
| SERVER_ERROR            | Error inesperado                  |

### Migración (Borrador)

1. Crear tablas `roles`, `user_roles`.
2. Poblar roles base.
3. Asignar `common_user` a usuarios existentes.
4. (Posterior) eliminar columna `is_artist` de `app_user` y usar rol `artist`.
5. Mantener `artist_user` por compatibilidad temporal (sin nuevas escrituras).

### Próximos (Permisos - No Implementado Aún)

Se agregarán tablas `permissions` y `role_permissions` para granularidad y middleware de autorización.
