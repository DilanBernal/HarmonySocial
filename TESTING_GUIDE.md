# Testing Guide - User API & Friendships

Este documento provee instrucciones para probar la API de HarmonySocial.

## Documentación Detallada

Para instrucciones detalladas sobre cómo probar los endpoints, consulta el directorio de documentación:

- [Guía Detallada de Pruebas](./docs/TESTING_GUIDE.md)

## Resumen de Endpoints Principales

### User API

- `POST /api/user` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/users` - Listar todos los usuarios
- `GET /api/user/id/:id` - Obtener usuario por ID
- `PUT /api/user/:id` - Actualizar usuario
- `DELETE /api/user/:id` - Eliminar usuario

### Friendship API

- `POST /api/friendship` - Crear solicitud de amistad
- `PUT /api/friendship/accept` - Aceptar solicitud de amistad
- `PUT /api/friendship/reject` - Rechazar solicitud de amistad
- `GET /api/friendship/user/:id` - Obtener amistades de un usuario
- `DELETE /api/friendship` - Eliminar amistad
- `DELETE /api/friendship/:id` - Eliminar amistad por ID

## Herramientas Recomendadas

- Postman o Insomnia para pruebas de API
- REST Client (extensión de VSCode) para ejecutar archivos .http
- curl para pruebas desde la línea de comandos

## Entorno de Pruebas

Todas las pruebas deben ejecutarse contra el servidor de desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4666` por defecto.
