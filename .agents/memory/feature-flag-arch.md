---
name: Feature Flag System architecture
description: High-level layout and non-obvious decisions for the Feature Flag Management System
---

# Feature Flag System Architecture

## Stack
- **Backend:** Python FastAPI in `python-api/` — SQLAlchemy + PostgreSQL (Replit built-in)
- **Frontend:** React + Vite in `artifacts/feature-flags/` — Wouter, TanStack Query, Orval-generated hooks
- **API contract:** OpenAPI spec in `lib/api-spec/openapi.yaml`; codegen produces hooks/schemas in `lib/api-client-react/` and `lib/api-zod/`

## Key decisions (why, not what)
- API prefix is `/api` and is NOT stripped by the Replit proxy — routers must mount with that prefix explicitly, and the frontend must call through it.
- Environment context is deliberately split across 3 files (context def / provider component / hook) because combining them in one file broke Vite Fast Refresh — components and hooks need to live in separate exports for HMR to treat them correctly.
- CORS is wildcard + no-credentials in dev (safe because the Replit proxy sends same-origin credentialed requests), restricted via `ALLOWED_ORIGINS` in production.
- The evaluation engine (`python-api/engines/evaluate.py`) resolves environment by slug first, then case-insensitive name; it raises `ValueError` (not a silent pick) when a name matches more than one environment, since silently choosing the wrong environment for a flag evaluation is a worse failure mode than an explicit error.
- `@workspace/db` (Drizzle/Postgres) and the original Express `artifacts/api-server/src/*` scaffold are unused leftovers from the platform default scaffold — the real backend is the Python FastAPI app in `python-api/`, wired into the `api-server` artifact's `artifact.toml` service command. Don't assume either of those default TS files represents the live backend for this project.
- Orval-generated `use*` query hooks type their `options.query` as the strict TanStack `UseQueryOptions`, which requires `queryKey` if you pass any partial query options object (e.g. to conditionally disable a query with `enabled`). Build the queryKey explicitly via the matching `get*QueryKey` export rather than passing a bare `{ enabled }` object, or the workspace typecheck fails.

## Testing note
- Unit tests for the evaluation engine use an isolated in-memory SQLite session (see `python-api/tests/conftest.py`) purely for test speed/isolation — this does not change the production DB, which remains Postgres via `DATABASE_URL`. Model `server_default` timestamp expressions use Postgres `NOW()`, which SQLite doesn't support, so test fixtures must always pass `created_at`/`updated_at` explicitly rather than relying on the server default.
