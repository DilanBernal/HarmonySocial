# Módulo: Usuarios

## Propósito

Gestión del ciclo de vida del usuario (registro, autenticación, verificación, recuperación de contraseña, actualización y eliminación lógica) y exposición de datos básicos.

## Modelo Principal

- full_name
- email (único)
- username (único)
- password (hash interno)
- favorite_instrument (enum numérico)
- status (SUSPENDED, ACTIVE, BLOCKED, DELETED, FROZEN)
- roles (many-to-many mediante user_roles)

## Flujos Clave

1. Registro
   - Asigna rol por defecto `common_user`.
   - Envía correo de verificación (token con security_stamp).
2. Login
   - Devuelve JWT con: id, username, roles[], permissions[] (flatten).
3. Verificación Email
   - Cambia estado SUSPENDED -> ACTIVE si token válido.
4. Recuperación de Contraseña
   - Genera token temporal + email.
5. Reset Password
   - Valida token + security_stamp y actualiza hash.
6. Actualización de Perfil
   - Puede cambiar datos básicos; contraseña requiere current_password.
7. Eliminación Lógica
   - Marca estado DELETED.

## Endpoints (prefijo /api/users)

- POST /register
- POST /login
- GET /all (filtra a common_user por diseño actual)
- GET /id/:id
- GET /email/:email
- GET /basic-info
- PUT /:id
- DELETE /:id
- POST /forgot-password
- POST /reset-password
- POST /verify-email

## Validaciones Destacadas

- username regex; email RFC básico; password fuerte.
- Unicidad de email/username.

## Errores Comunes

- 409 conflictos de email/username.
- 401 credenciales inválidas.

## Dependencias Externas

- SMTP (envío email)

## Seguridad

- JWT en Authorization Bearer.
- roles y permissions para futuras restricciones (lectura usuarios, etc.).
