# API Documentation

## Endpoints Implementados

### Autenticación

#### POST `/login`

- **Descripción**: Autentica un usuario y devuelve un token
- **Body**:

```json
{
  "userOrEmail": "string", // Username o email
  "password": "string"
}
```

- **Respuestas**:
  - `200`: Login exitoso
  - `401`: Credenciales inválidas
  - `400`: Error de validación

### Gestión de Usuarios

#### POST `/users/register`

- **Descripción**: Registra un nuevo usuario y asigna rol `common_user`.
- **Body**:

```json
{
  "full_name": "string",
  "email": "string",
  "username": "string",
  "password": "string",
  "profile_image": "string",
  "favorite_instrument": 0
}
```

- **Respuestas**:
  - `201`: Usuario creado exitosamente (estado SUSPENDED hasta verificación email)
  - `409`: Email o username ya existe
  - `406`: Error de validación

#### GET `/users/all`

- **Descripción**: Lista usuarios filtrados (por diseño actual: `common_user`). Requiere autenticación.
- **Respuestas**:
  - `200`: Usuarios obtenidos exitosamente

#### GET `/users/id/:id`

- **Descripción**: Obtiene un usuario por ID
- **Parámetros**: `id` (number)
- **Respuestas**:
  - `200`: Usuario encontrado
  - `404`: Usuario no encontrado
  - `400`: ID inválido

#### GET `/users/email/:email`

- **Descripción**: Obtiene un usuario por email
- **Parámetros**: `email` (string)
- **Respuestas**:
  - `200`: Usuario encontrado
  - `404`: Usuario no encontrado
  - `400`: Email inválido

#### PUT `/users/:id`

- **Descripción**: Actualiza un usuario
- **Parámetros**: `id` (number)
- **Body**:

```json
{
  "full_name": "string?",
  "email": "string?",
  "username": "string?",
  "profile_image": "string?",
  "favorite_instrument": "number?",
  "current_password": "string?", // Requerido si se cambia contraseña
  "new_password": "string?" // Nueva contraseña
}
```

- **Respuestas**:
  - `200`: Usuario actualizado
  - `404`: Usuario no encontrado
  - `409`: Email o username ya en uso
  - `400`: Error de validación

#### DELETE `/users/:id`

- **Descripción**: Eliminación lógica de un usuario
- **Parámetros**: `id` (number)
- **Respuestas**:
  - `204`: Usuario eliminado
  - `404`: Usuario no encontrado

### Recuperación de Contraseña

#### POST `/forgot-password`

- **Descripción**: Envía email de recuperación de contraseña
- **Body**:

```json
{
  "email": "string"
}
```

- **Respuestas**:
  - `200`: Email enviado (si existe)
  - `400`: Email inválido

#### POST `/reset-password`

- **Descripción**: Restablece la contraseña con token
- **Body**:

```json
{
  "token": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

- **Respuestas**:
  - `200`: Contraseña restablecida
  - `400`: Token inválido o contraseñas no coinciden

### Verificación de Email

#### POST `/verify-email`

- **Descripción**: Verifica y activa una cuenta de usuario
- **Body**:

```json
{
  "token": "string"
}
```

- **Respuestas**:
  - `200`: Email verificado y cuenta activada
  - `400`: Token inválido

## Validaciones Implementadas

### Username

- Formato: `/^[a-zA-Z0-9_*\-#$!|°.+]{2,50}$/`
- Entre 2 y 50 caracteres
- Permite letras, números y símbolos específicos

### Nombre Completo

- Formato: `/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/`
- Solo letras y espacios
- Incluye caracteres con acentos

### Contraseña

- Formato: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(.){8,}$/`
- Mínimo 8 caracteres
- Al menos una minúscula, mayúscula, número y símbolo especial

### Email

- Formato: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
- Formato estándar de email

### Imagen de Perfil

- Formato: `/^(https?|ftp|http):\/\/[^\s/$.?#].[^\s]*$/`
- URL válida con protocolo

## Estados de Usuario

- `ACTIVE = 1`: Usuario activo
- `BLOCKED = 2`: Usuario bloqueado
- `DELETED = 3`: Usuario eliminado
- `SUSPENDED = 4`: Usuario suspendido (por defecto al registrar)
- `FROZEN = 5`: Usuario congelado

## Instrumentos Disponibles

- `GUITAR = 0`
- `PIANO = 1`
- `BASS = 2`

### Gestión de Amistades

#### POST `/friendships`

- **Descripción**: Crea una nueva solicitud de amistad entre dos usuarios
- **Requiere autenticación**: Sí
- **Body**:

```json
{
  "user_id": "number", // ID del usuario que envía la solicitud
  "friend_id": "number" // ID del usuario al que se le envía la solicitud
}
```

- **Respuestas**:
  - `201`: Solicitud de amistad creada exitosamente
  - `200`: Mensaje informativo (si ya existe una relación entre los usuarios)
  - `400`: Error de validación o usuarios inexistentes
  - `401`: No autorizado
  - `500`: Error del servidor

#### PUT `/friendships/accept`

- **Descripción**: Acepta una solicitud de amistad pendiente
- **Requiere autenticación**: Sí
- **Query params**: `id` (number) - ID de la amistad
- **Respuestas**:
  - `200`: Amistad aceptada correctamente o mensaje informativo si ya fue procesada
  - `400`: Error de validación o solicitud inexistente
  - `401`: No autorizado
  - `500`: Error del servidor

#### PUT `/friendships/reject`

- **Descripción**: Rechaza una solicitud de amistad pendiente
- **Requiere autenticación**: Sí
- **Query params**: `id` (number) - ID de la amistad
- **Respuestas**:
  - `200`: Amistad rechazada correctamente o mensaje informativo si ya fue procesada
  - `400`: Error de validación o solicitud inexistente
  - `401`: No autorizado
  - `500`: Error del servidor

#### GET `/friendships/user/:id`

- **Descripción**: Obtiene todas las amistades de un usuario específico
- **Requiere autenticación**: Sí
- **Parámetros**: `id` (number) - ID del usuario
- **Respuestas**:
  - `200`: Amistades obtenidas correctamente
  - `400`: Error de validación o usuario inexistente
  - `401`: No autorizado
  - `500`: Error del servidor

#### DELETE `/friendships/:id`

- **Descripción**: Elimina una amistad por su ID
- **Requiere autenticación**: Sí
- **Parámetros**: `id` (number) - ID de la amistad
- **Respuestas**:
  - `200`: Amistad eliminada correctamente
  - `400`: Error de validación o amistad inexistente
  - `401`: No autorizado
  - `500`: Error del servidor

#### DELETE `/friendships/users`

- **Descripción**: Elimina una amistad entre dos usuarios específicos
- **Requiere autenticación**: Sí
- **Body**:

```json
{
  "user_id": "number", // ID del primer usuario
  "friend_id": "number" // ID del segundo usuario
}
```

- **Respuestas**:
  - `200`: Amistad eliminada correctamente
  - `400`: Error de validación o amistad inexistente
  - `401`: No autorizado
  - `500`: Error del servidor

## Estados de Amistad

- `PENDING`: Solicitud de amistad pendiente de aprobación
- `ACCEPTED`: Amistad aceptada y activa
- `REJECTED`: Solicitud de amistad rechazada

## Validaciones Implementadas en Amistades

- Se verifica que ambos usuarios existan antes de crear una amistad
- Se verifica que no exista ya una relación entre los usuarios
- Se valida el estado actual de la amistad antes de aceptar o rechazar
- Se manejan casos especiales:
  - Si ya son amigos, se notifica
  - Si hay una solicitud pendiente, se notifica
  - Si la solicitud fue rechazada, se puede crear una nueva

## Notas Importantes

1. Los nuevos usuarios se registran con estado `SUSPENDED` y deben verificar su email
2. Al cambiar contraseña se regenera el `security_stamp`
3. Los tokens de recuperación y verificación incluyen el `security_stamp` del usuario
4. Las búsquedas por email no revelan si el usuario existe (por seguridad)
5. Todos los endpoints manejan errores de manera consistente con códigos HTTP apropiados
6. Las solicitudes de amistad requieren confirmación del destinatario
7. Una amistad en estado REJECTED se elimina y se crea una nueva si se vuelve a solicitar

## Roles y Permisos (RBAC)

El sistema implementa Roles y Permisos para controlar acceso.

### Roles Base

- `common_user`: Acceso básico lectura limitada.
- `artist`: Capacidades extendidas sobre perfil artístico.
- `admin`: Control total (gestiona roles, permisos, usuarios, artistas).

### Permisos (CorePermission)

```
artist.create | artist.update | artist.delete | artist.accept | artist.reject
user.read | user.update | user.delete
role.read | role.create | role.update | role.delete | role.assign
permission.read | permission.create | permission.update | permission.delete | role-permission.assign
```

### Endpoints Clave

- Roles: `/api/roles` (CRUD)
- User-Roles: `/api/user-roles` (assign/remove/list)
- Permissions: `/api/permissions` (CRUD)
- Role-Permissions: `/api/role-permissions/*` (assign/unassign/list)

### JWT Payload Ejemplo

```json
{
  "id": 1,
  "username": "demo",
  "roles": ["artist"],
  "permissions": ["user.read", "artist.update"]
}
```

### Middleware

- `authenticateToken` -> valida token.
- `enrichPermissionsFromToken` -> adjunta roles/permissions.
- `requirePermissions("artist.create")` -> aplica verificación.

## Artists

CRUD de artistas con control de estados y endpoints de aceptación / rechazo.

### Enum Status

- `PENDING`: creado y pendiente de revisión.
- `ACTIVE`: perfil aceptado.
- `REJECTED`: perfil rechazado (no vuelve a PENDING).
- `DELETED`: eliminado lógicamente.

### Reglas de Estado

- Creación: siempre `PENDING` (ignora status enviado).
- Update (PUT /:id): NO puede cambiar `status`.
- Aceptar: solo si actual = `PENDING` pasa a `ACTIVE`.
- Rechazar: solo si actual = `PENDING` pasa a `REJECTED`.
- Delete lógico: cambia a `DELETED` (no elimina fila física).
- Cualquier transición inválida → 409 (BUSINESS_RULE_VIOLATION).

### Campos Artist

| Campo          | Tipo   | Requerido (create) | Notas                |
| -------------- | ------ | ------------------ | -------------------- |
| id             | number | No                 | Autogenerado         |
| artist_name    | string | Sí                 | 2-100 chars          |
| biography      | string | No                 | Máx 1000 chars       |
| formation_year | number | No                 | 1900-actual          |
| country_code   | string | No                 | ISO-2                |
| status         | enum   | No                 | Forzado internamente |
| created_at     | date   | No                 | Set por sistema      |
| updated_at     | date   | No                 | Set por sistema      |

### Endpoints

#### Crear artista

POST `/api/artists`
Body JSON:

```
{
	"artist_name": "Nombre",
	"biography": "Texto opcional",
	"formation_year": 2010,
	"country_code": "US"
}
```

Respuestas:

- 201: ArtistResponse (status=PENDING)
- 400: VALIDATION_ERROR
- 500: SERVER_ERROR

#### Obtener por id

GET `/api/artists/:id`
Respuestas:

- 200: ArtistResponse
- 404: VALUE_NOT_FOUND

#### Buscar artistas

GET `/api/artists?name=foo&country=US&status=PENDING`
Query Params (opcionales):

- name: substring case-insensitive sobre artist_name
- country: country_code exacto
- status: enum
  Respuestas:
- 200: { data: ArtistResponse[] }

#### Actualizar artista

PUT `/api/artists/:id`
Body (todos opcionales, status ignorado si se envía):

```
{
	"artist_name": "Nuevo Nombre",
	"biography": "Otra bio",
	"formation_year": 2012,
	"country_code": "AR"
}
```

Respuestas:

- 200: ArtistResponse
- 400: VALIDATION_ERROR
- 404: VALUE_NOT_FOUND

#### Eliminar (lógico)

DELETE `/api/artists/:id`
Respuestas:

- 200: ArtistResponse (status=DELETED)
- 404: VALUE_NOT_FOUND

#### Aceptar artista

PUT `/api/artists/:id/accept`
Respuestas:

- 200: ArtistResponse (status=ACTIVE)
- 404: VALUE_NOT_FOUND
- 409: BUSINESS_RULE_VIOLATION (si no está PENDING)

#### Rechazar artista

PUT `/api/artists/:id/reject`
Respuestas:

- 200: ArtistResponse (status=REJECTED)
- 404: VALUE_NOT_FOUND
- 409: BUSINESS_RULE_VIOLATION (si no está PENDING)

### Códigos de Error (ApplicationError)

- VALUE_NOT_FOUND: recurso inexistente.
- VALIDATION_ERROR: fallo de Joi.
- BUSINESS_RULE_VIOLATION: transición de estado inválida.
- DATABASE_ERROR: fallo capa de datos.
- SERVER_ERROR: error inesperado.

### Ejemplos en requests

Ver `docs/requests/artists.http` para ejemplos ejecutables.

### Nota de Migración

Si la tabla `artists` aún no tiene la columna `status` enum:

```
ALTER TABLE artists ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING';
```

Actualizar valores existentes según corresponda (p.ej. todos a PENDING inicialmente) antes de exponer aceptación/rechazo.

## Diagramas Arquitectura (Mermaid)

### Capas Hexagon / Ports & Adapters

```mermaid
flowchart LR
  subgraph MobileApp[Cliente Mobile]
  end
  subgraph WebApp[Cliente Web]
  end
  MobileApp --> API
  WebApp --> API

  subgraph Infrastructure[Infrastructure Layer]
    API[Express Routers / Controllers]
    Adapters[Adapters (Data, Utils)]
    Middleware[Auth / Authorization / Validation]
  end

  subgraph Application[Application Layer]
    Services[Application Services]
  end

  subgraph Domain[Domain Layer]
    Models[Models]
    Ports[Ports]
    ValueObjects[(Value Objects)]
  end

  API --> Services
  Services --> Ports
  Ports --> Adapters
  Adapters --> DB[(PostgreSQL)]
  Adapters --> SMTP[(SMTP Server)]
  Adapters --> Azure[(Azure Blob Storage)]

  classDef layer fill:#222,stroke:#555,color:#fff;
  class Infrastructure,Application,Domain layer;
```

## Documentación por Módulo

Para mayor detalle ver archivos en `docs/modules`:

- `USERS_MODULE.md`
- `ARTISTS_MODULE.md`
- `ROLES_MODULE.md`
- `FRIENDSHIPS_MODULE.md`
- `SONGS_MODULE.md`
- `PERMISSIONS_GUIDE.md`
- `SEEDING_GUIDE.md`
