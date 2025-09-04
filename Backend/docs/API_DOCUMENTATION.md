# API Documentation - User Management

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

#### POST `/user`

- **Descripción**: Registra un nuevo usuario
- **Body**:

```json
{
  "full_name": "string",
  "email": "string",
  "username": "string",
  "password": "string",
  "profile_image": "string",
  "favorite_instrument": "number",
  "is_artist": "boolean"
}
```

- **Respuestas**:
  - `201`: Usuario creado exitosamente
  - `409`: Usuario ya existe
  - `406`: Error de validación

#### GET `/users`

- **Descripción**: Obtiene todos los usuarios
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
  "is_artist": "boolean?",
  "current_password": "string?", // Requerido si se cambia contraseña
  "new_password": "string?" // Nueva contraseña
}
```

- **Respuestas**:
  - `200`: Usuario actualizado
  - `404`: Usuario no encontrado
  - `409`: Email o username ya en uso
  - `400`: Error de validación

#### DELETE `/user/:id`

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

## Notas Importantes

1. Los nuevos usuarios se registran con estado `SUSPENDED` y deben verificar su email
2. Al cambiar contraseña se regenera el `security_stamp`
3. Los tokens de recuperación y verificación incluyen el `security_stamp` del usuario
4. Las búsquedas por email no revelan si el usuario existe (por seguridad)
5. Todos los endpoints manejan errores de manera consistente con códigos HTTP apropiados
