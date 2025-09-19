---
applyTo: '**'
---
# Guidance for AI coding agents working on HarmonySocial

This file captures the essential knowledge an AI coding agent needs to be productive in this repository.

1) Big picture
- **Monorepo with multiple apps:** `Backend/` (Node + Express + TypeScript, hexagonal), `Frontend/` (React Native), `harmony-social-web/` (Next.js). Focus changes to the relevant folder per task.
- **Backend architecture:** Hexagonal (ports & adapters). Business logic lives in `Backend/src/application/` and domain interfaces in `Backend/src/domain/ports`. Infrastructure (express controllers, TypeORM adapters, env/config) is in `Backend/src/infrastructure/`.

2) Where to make changes
- HTTP endpoints: `Backend/src/infrastructure/router/*` (e.g., `ArtistRouter.ts`) wires routes to controllers.
- Controllers: `Backend/src/infrastructure/controller/*` (e.g., `ArtistController.ts`). Follow controller patterns: validate input, call service, return `ApplicationResponse` mapping to HTTP codes.
- Application services: `Backend/src/application/services/*` implement business rules and return `ApplicationResponse<T>` objects.
- Data adapters: `Backend/src/infrastructure/adapter/*` implement domain ports (e.g., `ArtistAdapter.ts` implements `domain/ports/data/ArtistPort`). Use `AppDataSource` for TypeORM repository access.

3) Error / response conventions
- The codebase uses a central `ApplicationResponse` / `ApplicationError` pattern. Services return `ApplicationResponse` and controllers map `ErrorCodes` to HTTP statuses. When adding code, return proper `ApplicationResponse.failure(...)` or success helpers.
- Unexpected errors: services catch errors and call `logger.error(...)` and return `ApplicationResponse` with `ErrorCodes.SERVER_ERROR`.

4) Database and envs
- TypeORM DataSource: `Backend/src/infrastructure/config/con_database.ts` (export `AppDataSource`) and `connectDB()` used in `src/index.ts`.
- Required env vars are declared in `Backend/src/infrastructure/config/environment-vars.ts`. Important names: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA`, `DB_SYNC`, `JWT_SECRET`, `AZURE_STORAGE_CONNECTION_STRING`, `ALLOWED_URLS`, `SMTP_*`, `EMAIL_FROM`, `FRONTEND_URL`.

5) Local dev & CI commands
- Backend install: run `npm install` inside `Backend/`.
- Start in dev: `npm run dev` (uses `nodemon src/index.ts`). In VS Code the task `Backend: Run Dev` is already configured and used.
- Tests: `npm run test` (jest). Formatting: `npm run format` (prettier).

6) Conventions & patterns to follow
- Hexagonal separation: don't inject ORM or Express types into domain/application layers. Use ports (interfaces) in `domain/ports` and implement adapters in `infrastructure/adapter`.
- DTO usage: request & response shapes live in `Backend/src/application/dto/requests` and `/responses`. Services expect those DTOs; use them for validation and mapping.
- Logger: use `LoggerPort` (available in `domain/ports/utils/LoggerPort`) for structured logging (controllers call `logger.error` / `logger.appError`).
- Dates: entities and adapters set `created_at` and `updated_at` consistently using `new Date(Date.now())`.

7) Adding an endpoint — minimal checklist (example: artists)
- Add route in `Backend/src/infrastructure/router/ArtistRouter.ts` and wire methods to `ArtistController`.
- Implement controller methods consistent with `ArtistController.ts` patterns: parse DTO, call `ArtistService`, map `ApplicationResponse` to HTTP codes using `ErrorCodes`.
- Implement service logic in `Backend/src/application/services/ArtistService.ts` returning `ApplicationResponse` objects.
- Implement or update adapter in `Backend/src/infrastructure/adapter/data/ArtistAdapter.ts` to access DB via `AppDataSource.getRepository(...)`.
- Update `Backend/src/infrastructure/entities/*` and TypeORM entities if schema changes.

8) Files & docs to consult
- API docs: `Backend/docs/API_DOCUMENTATION.md`
- Endpoint creation guide: `Backend/docs/CREAR_ENPOINT_GUIUDE.md`
- Tests: look at `Backend/tests/` for how unit/integration tests instantiate services and adapters.

9) Formatting and tests
- Run `npm run format` in `Backend/` to match repo Prettier rules.
- Run `npm run test` to validate behavior. Tests use `jest` + `ts-jest`.

10) When unsure, safe defaults
- Follow existing controller/service/adapter patterns exactly.
- Prefer returning `ApplicationResponse.failure(...)` over throwing raw errors; controllers expect to map these.

If anything here is unclear or you want more detail (examples for frontend or `harmony-social-web/`), tell me which area and I'll expand or refine this file.
