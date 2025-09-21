# Integración: Artist Request (Solicitar ser artista)

Archivos añadidos:
- `src/hooks/useArtistRequest.ts` — hook que maneja validación cliente, estado de envío y mapeo de errores.
- `src/services/artistService.ts` — función `createArtist` que llama a `POST /api/artists`.
- `src/app/register-artist/page.tsx` — página con el formulario para crear la solicitud.
- `src/app/register-artist/pending/page.tsx` — pantalla de confirmación (PENDING).
- `src/app/register-artist/styles.module.css` — estilos minimalistas para ambas pantallas.

Dónde colocarlo:
- Los archivos ya están agregados bajo `harmony-social-web/src/` y siguen la estructura de Next.js App Router.

Configuración y variables:
- `NEXT_PUBLIC_BACKEND_URL` (opcional): URL base del backend. Por defecto usa `http://localhost:4666`.
- Token de autenticación: el hook/servicio busca localmente `localStorage.getItem('token')` o `localStorage.getItem('Authorization')`. Asegúrate de que el login guarde el token en alguna de esas claves (preferiblemente `token`).

Comportamiento y validaciones (cliente):
- `artist_name`: requerido, 2–100 caracteres.
- `biography`: opcional, hasta 1000 caracteres.
- `formation_year`: opcional, entero entre 1900 y año actual.
- `country_code`: opcional, ISO-2 (2 letras).
- Validaciones no bloqueantes: se muestran inline y evitan el envío si existen errores.

Cómo probar manualmente:
1. Arranca el backend en `http://localhost:4666`.
2. Asegúrate de estar autenticado en la web y que `localStorage` contiene `token` con valor `Bearer <token>` o solo el token.
3. Abre la página `/register-artist` en la app Next.js.
4. Rellena el formulario y haz clic en "Enviar solicitud".
5. Casos esperados:
  - `201`: redirige a `/register-artist/pending` y muestra la pantalla de confirmación.
  - `400`: se muestran errores de validación retornados por el backend inline o como mensaje.
  - `401/403`: se muestra alerta "No autorizado. Inicia sesión." y redirige a `/login`.
  - `409`: se muestra el mensaje de conflicto del backend.
  - `500` / fallo de red: se muestra un mensaje genérico y se puede reintentar.

Ejemplo curl equivalente:

```
curl -X POST "http://localhost:4666/api/artists" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"artist_name":"Mi Nombre","biography":"...","formation_year":2010,"country_code":"AR"}'
```

Supuestos y preguntas abiertas:
- ¿Cuál es la clave exacta donde la web guarda el token en `localStorage`? El servicio comprueba `token` y `Authorization`.
- ¿Se permiten peticiones de usuarios no autenticados? El backend requiere permiso `artist.create` según docs; asumimos que el usuario debe estar autenticado.

Posibles mejoras futuras:
- Reutilizar componentes de UI existentes (botones, inputs) para mantener consistencia en toda la app.
- Compartir validaciones con el backend (schema Joi/JSON Schema) para evitar duplicación.
