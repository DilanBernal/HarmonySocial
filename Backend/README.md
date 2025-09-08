# HarmonySocial Backend

> Backend para la aplicación HarmonySocial desarrollado con Node.js, Express y TypeScript.

## Características

- Arquitectura hexagonal (puertos y adaptadores)
- Gestión de usuarios (registro, autenticación, actualización)
- Sistema de gestión de amistades (solicitudes, aceptación, rechazo)
- Validación de datos con express-validator
- Autenticación con JWT

## Documentación

La API está completamente documentada en los siguientes archivos:

- [Documentación de la API](./docs/API_DOCUMENTATION.md)
- [Guía de Pruebas](./docs/TESTING_GUIDE.md)
- [Guía para Crear Endpoints](./docs/CREAR_ENPOINT_GUIUDE.md)

## Principales Endpoints

### Usuarios

- `POST /api/user` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/user/id/:id` - Obtener usuario por ID

### Amistades

- `POST /api/friendship` - Crear solicitud de amistad
- `PUT /api/friendship/accept` - Aceptar solicitud de amistad
- `PUT /api/friendship/reject` - Rechazar solicitud de amistad
- `GET /api/friendship/user/:id` - Obtener amistades de un usuario

## Configuración y Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en modo desarrollo:

```bash
npm run dev
```

3. Compilar para producción:

```bash
npm run build
```

4. Ejecutar pruebas:

```bash
npm run test
```

## Estructura de Carpetas

El proyecto sigue una arquitectura hexagonal:

- `src/domain`: Modelos y puertos (interfaces)
- `src/application`: Servicios y lógica de negocio
- `src/infrastructure`: Adaptadores, controladores y configuración
