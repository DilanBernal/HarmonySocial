# Testing Guide - User API & Friendships

## Instrucciones para Pruebas

### 1. Configuración

Asegúrate de que tu proyecto esté ejecutándose:

```bash
cd Backend
npm run dev
```

### 2. Pruebas con curl o Postman

#### Registro de Usuario

```bash
curl -X POST http://localhost:4666/api/user \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Juan Pérez",
    "email": "juan@example.com",
    "username": "juanperez",
    "password": "Password123!",
    "profile_image": "https://example.com/photo.jpg",
    "favorite_instrument": 0,
    "is_artist": false
  }'
```

#### Login

```bash
curl -X POST http://localhost:4666/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "userOrEmail": "juan@example.com",
    "password": "Password123!"
  }'
```

#### Obtener Todos los Usuarios

```bash
curl -X GET http://localhost:4666/api/users
```

#### Obtener Usuario por ID

```bash
curl -X GET http://localhost:3000/users/id/1
```

#### Obtener Usuario por Email

```bash
curl -X GET http://localhost:3000/users/email/juan@example.com
```

#### Actualizar Usuario

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Juan Carlos Pérez",
    "is_artist": true
  }'
```

#### Recuperar Contraseña

```bash
curl -X POST http://localhost:3000/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

#### Verificar Email (requiere token del email)

```bash
curl -X POST http://localhost:3000/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL"
  }'
```

#### Eliminar Usuario

```bash
curl -X DELETE http://localhost:3000/user/1
```

### 3. Casos de Prueba Recomendados

1. **Validaciones de Registro**:
   - Username inválido: `123`
   - Email inválido: `invalid-email`
   - Contraseña débil: `123`
   - Usuario duplicado

2. **Login**:
   - Credenciales válidas
   - Credenciales inválidas
   - Usuario inexistente

3. **Búsquedas**:
   - ID válido/inválido
   - Email válido/inválido
   - Usuario existente/no existente

4. **Actualizaciones**:
   - Datos válidos
   - Datos inválidos
   - Email/username duplicados
   - Usuario inexistente

5. **Recuperación de Contraseña**:
   - Email existente
   - Email no existente
   - Token válido/inválido

## Pruebas de Gestión de Amistades

### 1. Endpoints para Pruebas

#### Crear Nueva Solicitud de Amistad

```bash
curl -X POST http://localhost:4666/api/friendship \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "from_user_id": 1,
    "to_user_id": 2
  }'
```

#### Aceptar Solicitud de Amistad

```bash
curl -X PUT http://localhost:4666/api/friendship/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "from_user_id": 1,
    "to_user_id": 2
  }'
```

#### Rechazar Solicitud de Amistad

```bash
curl -X PUT http://localhost:4666/api/friendship/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "from_user_id": 1,
    "to_user_id": 2
  }'
```

#### Obtener Amistades de un Usuario

```bash
curl -X GET http://localhost:4666/api/friendship/user/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Eliminar Amistad

```bash
curl -X DELETE http://localhost:4666/api/friendship \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "from_user_id": 1,
    "to_user_id": 2
  }'
```

#### Eliminar Amistad por ID

```bash
curl -X DELETE http://localhost:4666/api/friendship/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Casos de Prueba Recomendados para Amistades

1. **Validación de Nueva Solicitud**:
   - Usuarios válidos
   - Usuario remitente inexistente
   - Usuario destinatario inexistente
   - Solicitud duplicada (ya existe una relación)
   - Solicitud a uno mismo (mismo ID de usuario)

2. **Aceptar/Rechazar Solicitudes**:
   - Solicitud en estado PENDING (flujo correcto)
   - Solicitud inexistente
   - Solicitud ya aceptada
   - Solicitud ya rechazada
   - Usuarios no existen

3. **Consulta de Amistades**:
   - Usuario con amistades
   - Usuario sin amistades
   - Usuario inexistente

4. **Eliminación de Amistades**:
   - Amistad existente
   - Amistad inexistente
   - ID de amistad inválido

### 3. Pruebas de Estados de Amistad

Para probar el flujo completo:

1. **Crear una solicitud** de amistad del usuario 1 al usuario 2
2. **Verificar** que aparece en estado PENDING
3. **Aceptar la solicitud** desde el usuario 2
4. **Verificar** que cambia a estado ACCEPTED
5. **Eliminar la amistad**
6. **Verificar** que ya no aparece en las consultas

Para probar el rechazo:

1. **Crear una solicitud** de amistad del usuario 1 al usuario 3
2. **Rechazar la solicitud** desde el usuario 3
3. **Verificar** que cambia a estado REJECTED

### 4. Notas Importantes

- Todos los nuevos usuarios se crean con estado `SUSPENDED`
- Los emails de verificación y recuperación requieren configuración SMTP
- Los tokens tienen expiración (configurada en TokenAdapter)
- Las contraseñas se encriptan antes de guardar
- Las búsquedas devuelven usuarios sin información sensible
- Las solicitudes de amistad siempre comienzan en estado PENDING
- Solo el usuario destinatario puede aceptar o rechazar una solicitud
- Las amistades son bidireccionales (se puede consultar desde cualquiera de los usuarios)

---

# Pruebas Unitarias Automatizadas (Jest)

## ¿Cómo ejecutar las pruebas automáticas?

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Ejecuta todas las pruebas unitarias:
   ```bash
   npm test
   ```

Esto ejecutará todos los tests ubicados en la carpeta `tests/` usando Jest y TypeScript.

## Cobertura de pruebas

- **Servicios principales:**
  - UserService
  - AuthService
  - FriendshipService
- **Utilidades y clases compartidas:**
  - ApplicationResponse
  - ApplicationError
  - Validaciones regex

**Tipos de casos cubiertos:**

- Casos exitosos (flujos correctos)
- Casos de error (validaciones, datos inválidos, usuarios inexistentes, errores de servidor)
- Casos edge (duplicados, estados inconsistentes, etc.)

**Mocking:**

- Todas las dependencias externas (puertos, base de datos, email, logger, etc.) están mockeadas.
- Las pruebas NO dependen de la base de datos real ni de servicios externos.

## Archivos de prueba

```
tests/
├── auth/
│   └── AuthService.spec.ts
├── friendship/
│   └── FriendshipService.spec.ts
├── shared/
│   ├── ApplicationError.spec.ts
│   └── ApplicationResponse.spec.ts
├── user/
│   ├── UserService.spec.ts
│   └── userService.spec.ts
└── utils/
    └── regex.spec.ts
```

## Ejemplo de salida exitosa

```
PASS  tests/shared/ApplicationResponse.spec.ts
PASS  tests/auth/AuthService.spec.ts
PASS  tests/shared/ApplicationError.spec.ts
PASS  tests/utils/regex.spec.ts
PASS  tests/user/ userService.spec.ts
PASS  tests/user/UserService.spec.ts
PASS  tests/friendship/FriendshipService.spec.ts

Test Suites: 7 passed, 7 total
Tests:       148 passed, 148 total
```

---

# Automated Unit Testing (English)

## How to run automated tests?

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run all unit tests:
   ```bash
   npm test
   ```

This will run all tests in the `tests/` folder using Jest and TypeScript.

## Test coverage

- **Main services:**
  - UserService
  - AuthService
  - FriendshipService
- **Utilities and shared classes:**
  - ApplicationResponse
  - ApplicationError
  - Regex validations

**Tested scenarios:**

- Success cases (happy paths)
- Error cases (validation, invalid data, not found, server errors)
- Edge cases (duplicates, inconsistent states, etc.)

**Mocking:**

- All external dependencies (ports, database, email, logger, etc.) are mocked.
- Tests do NOT depend on a real database or external services.

## Test files

```
tests/
├── auth/
│   └── AuthService.spec.ts
├── friendship/
│   └── FriendshipService.spec.ts
├── shared/
│   ├── ApplicationError.spec.ts
│   └── ApplicationResponse.spec.ts
├── user/
│   ├── UserService.spec.ts
│   └── userService.spec.ts
└── utils/
    └── regex.spec.ts
```

## Example of successful output

```
PASS  tests/shared/ApplicationResponse.spec.ts
PASS  tests/auth/AuthService.spec.ts
PASS  tests/shared/ApplicationError.spec.ts
PASS  tests/utils/regex.spec.ts
PASS  tests/user/ userService.spec.ts
PASS  tests/user/UserService.spec.ts
PASS  tests/friendship/FriendshipService.spec.ts

Test Suites: 7 passed, 7 total
Tests:       148 passed, 148 total
```

---
