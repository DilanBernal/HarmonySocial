# Testing Guide - User API

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

### 4. Notas Importantes

- Todos los nuevos usuarios se crean con estado `SUSPENDED`
- Los emails de verificación y recuperación requieren configuración SMTP
- Los tokens tienen expiración (configurada en TokenAdapter)
- Las contraseñas se encriptan antes de guardar
- Las búsquedas devuelven usuarios sin información sensible
