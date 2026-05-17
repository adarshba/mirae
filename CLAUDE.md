# CLAUDE.md

Operational rules for Claude Code in this repo. Deep reference lives in `docs/`.

## Project

Mirae — Korean-drama streaming UI. SvelteKit (Svelte 5 runes) + TypeScript + Tailwind v4 + Firebase Auth + TMDB. Deploys to Vercel. Package manager is **Bun**.

## Commands

```bash
bun install
bun dev            # vite dev server
bun run build      # production build (Vercel adapter)
bun check          # svelte-kit sync && svelte-check
bun lint           # prettier --check . && eslint .    (read-only; CI-safe)
bun format         # prettier --write .                (write)
bun run lint:fix   # prettier --write . && eslint . --fix
bun run verify     # bun check && bun lint             (use before declaring task complete)
```

No test runner is configured. Before declaring a task complete: run `bun run verify`, and state explicitly that there are no tests.

## Environment

`.env` (see `.env.example`):

- `TMDB_API_KEY` — server-only. `src/lib/server/api/tmdbClient.ts` throws at module load if missing.
- `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_APP_ID` — client (`src/lib/firebaseClient.ts`).

For first-time Vercel deploy: add the Vercel domain to Firebase Console → Authentication → Authorized domains.

## Path Aliases

Defined in `svelte.config.js`. Always use these, never relative paths across feature boundaries.

- `$components` → `src/lib/components`
- `$stores` → `src/lib/stores`
- `$types` → `src/lib/types`
- `$api` → `src/lib/server/api` (server-only)
- `$utils` → `src/lib`
- `$lib` → `src/lib`

## Forbidden patterns

Hard constraints. Treat each as a compile error.

- Never use `any`.
- Never use `as` casting. No `as unknown as T`. No `!` non-null assertions.
- Never call TMDB from the browser. Route through `$api/catalogService.ts` via a `+page.server.ts` loader or an `/api/...` `+server.ts` proxy.
- Never reconstruct TMDB image URLs inline. Use `getTmdbPosterUrl` / `getTmdbBackdropUrl` from `$lib/tmdb`.
- Never `new` a store inside a component. Instantiate once in `src/routes/+layout.svelte` and read via `getXContext()`.
- Never declare shared types inline in `.svelte` or service files. They belong in `src/lib/types/*.types.ts`.
- Never use raw hex or raw px for tokenized values in `<style>` blocks. Use `var(--space-N)` / `var(--text-primary)` etc.
- Never use vague filenames: `utils.ts`, `helpers.ts`, `common.ts`, `misc.ts`, `manager.ts`.
- Never commit `.env` or anything containing real credentials.

## Naming rules

Detail in `docs/naming.md`. Quick reference:

- **Components**: `PascalCase.svelte` describing responsibility (`TitleRow.svelte`, not `BigCard.svelte`).
- **Routes**: kebab-case folders (`my-list/`, `watch-history/`).
- **TS modules**: camelCase with semantic suffix (`catalogService.ts`, `authStore.svelte.ts`).
- **Type files**: `*.types.ts`. Constants: `*.constants.ts`. Fixtures: `*.fixtures.ts`.
- **Functions**: verb-first (`fetchTitle`, `getTmdbPosterUrl`, `formatReleaseYear`).
- **Constants**: `UPPER_SNAKE_CASE`.
- **Domain noun**: `title` is canonical. Don't mix `movie` / `media` / `content` / `film` in new code. External TMDB endpoint paths (`discover/movie`, `movie/{id}/videos`) keep TMDB's wording — those are an outside contract.

## Type safety rules

Detail in `docs/types.md`. Hard rules:

- Shared types live in `src/lib/types/*.types.ts` and are ambient (no import needed). One-off `Props` types stay inline in the component.
- Narrow `unknown` with a type guard before use. Never cast it.
- For external/dynamic payloads, validate at the boundary or write a guard. Don't trust the wire.

## Architecture rules

Detail in `docs/architecture.md`. Quick reference:

- Data flow: `+page.server.ts` loaders OR `/api/...` `+server.ts` → `$api/catalogService.ts` → `$api/tmdbClient.ts#tmdbFetch`. Two paths, no others.
- State: class-based runes stores in `src/lib/stores/*.svelte.ts`, paired with `createContext<T>()`. Instantiated once in `+layout.svelte`.
- `TitleHoverPreview` and `TitleDetailsModal` mount once in `+layout.svelte` and are driven by store state. Don't re-render them locally.
- Route guards: `AUTH_ROUTES` and `PROTECTED_ROUTES` from `$lib/constants/routes.constants.ts`. Logged-in users on auth routes redirect to `/`. Guests on protected routes redirect to `/login?from=<path>`.
- Constants: anything used by more than one file goes in `src/lib/constants/*.constants.ts`. Single-component magic numbers stay local.

## Comments

Detail in `docs/commenting.md`. Default to no comments. Allowed labels: `TODO`, `FIXME`, `HACK`, `BUG`, `NOTE`, `XXX`, `MARK`. One line. Explain _why_, never _what_. No commented-out code (use git).

## Workflow

- For 3+ step or architectural tasks, plan first. For multi-file refactors, work in phases of ≤5 files and verify between phases.
- Before editing a file, re-read it. Tool results can be stale.
- After every structural rename, search for: direct refs, type refs, string literals, dynamic imports, re-exports, tests/mocks. Grep is not semantic.
- Run `bun run verify` before reporting any task complete. If it fails, the task is not done.
- Fix root causes. Never bypass with `--no-verify`, `// @ts-ignore`, `as unknown as T`, or feature-flagged skips.
- Follow `docs/workflow.md` for the issue → branch → commit → PR flow. Commits use Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `perf:`). PR bodies must include `Closes #<issue>`.

## Outstanding work

Search `TODO` / `FIXME` in the codebase for current items. Known longer-lived ones:

- `DeviceStore.signOutDevice` / `signOutAll` update local state only; full revoke needs Firebase Admin SDK.
- `searchTitles` in `catalogService.ts` post-filters by `original_language === 'ko'`, breaking TMDB pagination.
- `AccountStore` uses `MOCK_ACCOUNT`. Real billing/profile loader not wired.

## Deep reference

- [`docs/architecture.md`](docs/architecture.md) — layout, data flow, stores, styling, auth.
- [`docs/naming.md`](docs/naming.md) — full naming convention spec.
- [`docs/types.md`](docs/types.md) — type safety, casting, type modeling.
- [`docs/commenting.md`](docs/commenting.md) — comment policy with examples.
- [`docs/workflow.md`](docs/workflow.md) — issue, branch, commit, and PR conventions.
