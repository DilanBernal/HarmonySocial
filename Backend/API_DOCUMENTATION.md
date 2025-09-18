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

### Artists

Base: `/api/artists`

| Método | Ruta        | Descripción                                                                                                                                                                                                                     | Auth               |
| ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| POST   | /           | Crea una solicitud de artista (queda en estado `PENDING`). Público: cualquier usuario puede enviar una solicitud; la entidad creada no se asocia a un usuario hasta que sea aceptada por un admin.                              | No                 |
| POST   | /admin      | Crea un artista **aceptado** en una sola operación (`status = ACTIVE`, `verified = true`). Requiere permiso `ARTIST_CREATE` (admin). No asocia `artist_user_id` por defecto; si se desea, puede vincularse manualmente después. | Sí (ARTIST_CREATE) |
| GET    | /           | Buscar artistas (filtros opcionales)                                                                                                                                                                                            | No                 |
| GET    | /:id        | Obtener artista por id                                                                                                                                                                                                          | No                 |
| PUT    | /:id        | Actualizar artista (requiere permiso)                                                                                                                                                                                           | Sí                 |
| PUT    | /:id/accept | Aceptar solicitud (cambiar PENDING -> ACTIVE). Requiere permiso `ARTIST_ACCEPT`.                                                                                                                                                | Sí                 |
| PUT    | /:id/reject | Rechazar solicitud (PENDING -> REJECTED). Requiere permiso `ARTIST_REJECT`.                                                                                                                                                     | Sí                 |

POST / (public) - Body ejemplo:

```
{
	"artist_name": "Mi Nombre Artístico",
	"biography": "Breve biografía...",
	"formation_year": 2010,
	"country_code": "COL" // acepta CCA3 u ISO-2
}
```

Respuesta 201:

```
{ "id": 123 }
```

POST /admin (admin) - Body igual a POST /; crea artista activo y verificado.

Errores esperados: 400 (validación), 401/403 (sin permisos), 409 (violación de regla de negocio), 500.
