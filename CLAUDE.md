# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mirae is a Korean-drama streaming UI built with **SvelteKit (Svelte 5, runes)**, **TypeScript**, **Tailwind CSS v4** (with custom `@theme` tokens in `src/app.css`), **Firebase Auth**, and **Bun**. It's TMDB-powered and deploys to Vercel via `@sveltejs/adapter-vercel`.

## Commands

Package manager is **Bun** (see `bun.lock`, `.npmrc` sets `engine-strict=true`).

```bash
bun install
bun dev            # vite dev server
bun run build      # production build (Vercel adapter)
bun preview        # preview production build
bun check          # svelte-kit sync && svelte-check
bun check:watch
bun lint           # prettier --check . && eslint .
bun format         # prettier --write .
```

`bun` is the package manager and runtime. `vite` does the actual bundling. `eslint` and `prettier` only lint/format — they never build.

There is no test runner configured. Per the user's `CLAUDE.md` "FORCED VERIFICATION" rule, run `bun check` and `bun lint` before declaring a task complete — and explicitly state that there are no tests rather than claiming a test suite passed.

## Environment

Set the following in `.env` (see `.env.example`):

- `TMDB_API_KEY` — read via `$env/dynamic/private` in `src/lib/server/api/tmdb-client.ts`, which **throws at module load** if missing. The server will not boot without it.
- `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_APP_ID` — used by `src/lib/firebase.ts` on the client.

## Deployment

Production target is Vercel via `@sveltejs/adapter-vercel`. No `vercel.json` is required — the adapter emits Vercel-compatible function output. Vercel auto-detects `bun.lock` and uses Bun for install/build.

For first-time setup: add the Vercel domain to **Firebase Console → Authentication → Authorized domains**, otherwise login fails with `auth/unauthorized-domain`.

## Path Aliases

Defined in `svelte.config.js` (use these, not relative paths):

- `$components` → `src/lib/components`
- `$stores` → `src/lib/stores`
- `$types` → `src/lib/types`
- `$api` → `src/lib/server/api` (server-only)
- `$utils` → `src/lib`
- `$lib` → `src/lib` (SvelteKit default)

## Architecture

### Layout

```
src/
├── app.css                       Tailwind v4 entry + @theme tokens + base layer
├── lib/
│   ├── constants.ts              Shared constants — see "Constants" section below
│   ├── helpers.ts                Pure helpers (tmdbImage, matchPercent, releaseYear, fetchTrailer, ...)
│   ├── firebase.ts               Firebase client init + authErrorMessage()
│   ├── utils.ts                  cn() classname helper (clsx + tailwind-merge)
│   ├── components/               Feature components and the auth/profile/ui subtrees
│   ├── fixtures/                 Mock seed data (e.g. MOCK_ACCOUNT for the account page)
│   ├── server/api/               TMDB client (server-only) — tmdb-client.ts + catalog.ts
│   ├── stores/                   Class-based runes stores + createContext<T>() pairs
│   └── types/                    Ambient .d.ts files (Movie, Account, TrackedDevice, ...)
└── routes/                       SvelteKit pages, layouts, and API endpoints
```

### Data flow

TMDB is **never** called from the browser. Two paths reach it, both via `$api/catalog.ts` which wraps `$api/tmdb-client.ts#tmdbFetch`:

1. **SvelteKit `+page.server.ts` loaders** (e.g. `src/routes/+page.server.ts`) call helpers in `$api/catalog.ts` directly. The root page loads popular/top-rated/trending/new-releases in parallel, then fans out one `discover/movie?with_genres=<id>` call per row in `CURATED_GENRE_ROWS` via `Promise.all` — keep this pattern when adding shelves.
2. **Internal `/api/*` endpoints** (`src/routes/api/movie/[id]`, `.../similar`, `src/routes/api/trailer/[movieId]`) are thin proxies to the same catalog helpers. The client-side `ModalStore` and `helpers.ts#fetchTrailer` hit these — do not bypass them and call TMDB directly from a `+page.svelte` or `.svelte.ts` file.

When extending the catalog, add the helper to `$api/catalog.ts` (calling `tmdbFetch` for transport) and either expose it via a loader or a new `/api/...` `+server.ts` route, mirroring the existing thin-proxy style.

### State: Svelte 5 runes + context

All cross-component state is a **runes-based class store** instantiated **once in `src/routes/+layout.svelte`** and pushed into context with a `createContext<T>()` pair exported from each store file:

- `MovieStore` — `popularMovies`, randomly picks `selectedMovie` for the Billboard; tracks tried IDs in a `SvelteSet`
- `MovieCardStore` — hover-preview position/dimensions
- `ModalStore` — show-details modal, includes a `SvelteMap` cache for already-fetched `MovieDetails`
- `AuthStore` — Firebase `onAuthStateChanged` wrapper, exposes `user` + `ready` + `signOut`
- `AccountStore` — wraps `MOCK_ACCOUNT` from `$lib/fixtures/account.ts` (TODO: replace with real loader)
- `DeviceStore` — tracks the current browser session in `localStorage` keyed by Firebase `uid`
- `favoriteListStore` — factory function (not class) backed by `localStorage` under `STORAGE_KEYS.favorites`; guards `localStorage` access with `browser` from `$app/environment`

Pattern to follow when adding a new store: export `getXContext`/`setXContext` from a `*.svelte.ts` file, instantiate in `+layout.svelte`, and call `setXContext(...)` there. Consumers call `getXContext()` — do not `new` a store inside a component.

### Auth & route guarding

`src/routes/+layout.svelte` uses two arrays from `$lib/constants`:

- `AUTH_ROUTES` — `/login`, `/signup`, `/forgot`, `/reset`. Logged-in users are redirected to `/`.
- `PROTECTED_ROUTES` — `/account`, `/myList`, `/watch`. Guests are redirected to `/login?from=<path>`.

Pages outside both arrays are public (with guest-mode degraded interaction handled component-side via `getAuthContext().user`).

The auth subtree `src/routes/(auth)/...` shares a minimal layout (no Navbar/Footer). Form primitives live in `src/lib/components/auth/` (`AuthCard`, `TextField`, `PasswordField`, `PrimaryButton`, `OutlineButton`, `Banner`, `ResendButton`, `StrengthMeter`).

### Constants

Shared constants live in `src/lib/constants.ts`. **If a value is referenced in more than one file, or defines an external contract, put it here.** Magic numbers used by a single component stay in that component.

Current groups:

- **TMDB**: `TMDB_BASE_URL`, `TMDB_IMG_BASE`, `TMDB_IMG_SIZE`, `CURATED_GENRE_ROWS`. Use the `tmdbImage(path, size)` / `tmdbPoster(path)` / `tmdbBackdrop(path)` helpers in `helpers.ts` — never reconstruct `https://image.tmdb.org/t/p/...` inline.
- **Routing**: `AUTH_ROUTES`, `PROTECTED_ROUTES`.
- **Storage**: `STORAGE_KEYS.favorites`, `STORAGE_KEYS.devicesPrefix`.
- **Timings**: `HOVER_DELAY_MS`, `AUTH_REDIRECT_DELAY_MS`, `NAVBAR_STICKY_SCROLL_PX`, `HOVER_PREVIEW_Y_OFFSET_PX`.

### Types

Ambient global types live in `src/lib/types/`:

- `types.d.ts` — TMDB shapes (`Movie`, `MovieDetails`, `Genre`, `TMDBResponse`, `Trailer`, ...) and a few UI types (`PopupPosition`, `SimilarCardProps`, `CardState`, `ModalState`).
- `profile.d.ts` — `Account`, `TrackedDevice`, `DeviceKind`, plan/device types.

No `import` needed to use them — they're ambient. **When adding a new data shape used across multiple files, put it in `src/lib/types/` rather than declaring it inline.** Tiny one-off `Props` types stay inline in the component.

### Components

`src/lib/components/` is organized:

- **Top level** — feature components (`Billboard`, `ContentRow`, `Thumbnail`, `HoverPreview`, `Navbar`, `Footer`, `ShowDetails`, `RelatedCard`, `VideoPlayer`).
- **`auth/`** — login/signup form primitives.
- **`profile/`** — `Avatar`, `ProfileDropdown`.
- **`ui/`** — `bits-ui`-based shadcn-svelte primitives (alert, avatar, button, checkbox, dialog, dropdown-menu, input, label, scroll-area, separator).

`HoverPreview` and `ShowDetails` are mounted once in `+layout.svelte` and driven entirely by store state — components that want to open the modal or trigger a hover should mutate the corresponding store, not render their own modal/preview.

## Styling: Tailwind v4 + design tokens

Single CSS entry at `src/app.css`, imported once from `src/routes/+layout.svelte`. It contains:

1. `@import 'tailwindcss';` and any plugins.
2. The Pretendard font import.
3. A `@theme { ... }` block defining design tokens (colors, spacing, brand palette, auth-specific vars).
4. `@layer base` for body/html/scrollbar/typography resets.
5. `@layer components` for shared semantic classes (`.btn`, `.btn-primary`, `.btn-icon`, `.text-display`, `.text-h1`, `.text-body`, `.badge-match`, `.no-scrollbar`, ...).

Component `<style>` block rules:

1. Prefer Tailwind utilities in `class="..."` for layout. Keep `<style>` blocks for component-specific rules that can't be expressed atomically.
2. **No raw hex, no raw px** for tokenized values — use the CSS variables defined in `@theme` (e.g. `var(--space-6)`, `var(--text-primary)`). Viewport units and dynamic geometry are fine.
3. Dynamic geometry from JS goes through CSS custom properties via `style="--x: {x}px"`, not inline `style="top: …"`. See `HoverPreview.svelte`.
4. `:global()` only for documented third-party overrides (Plyr's `--plyr-*` vars in `VideoPlayer.svelte`) or for icons passed to slot-less Lucide components.

## Linting & Formatting

- ESLint flat config (`eslint.config.js`) extends `js.recommended`, `typescript-eslint`, `eslint-plugin-svelte` (+ its prettier config), and `eslint-config-prettier`. It honors `.gitignore` via `@eslint/compat`'s `includeIgnoreFile`.
- `no-undef` is intentionally off (TS handles it).
- `svelte/no-navigation-without-resolve` is off due to a conflict with typed `resolve()` + dynamic routes — don't re-enable it without addressing that.
- Prettier config (`.prettierrc`) uses `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`. Drives both `bun format` and `bun lint`.

## TypeScript

`tsconfig.json` extends `.svelte-kit/tsconfig.json` (generated by `svelte-kit sync`). Key flags: `strict: true`, `checkJs: true`, `allowJs: true`, `moduleResolution: "bundler"`, `rewriteRelativeImportExtensions: true`. Always run `bun check` (which runs `svelte-kit sync` first) after touching types, route files, or path aliases — stale `.svelte-kit/tsconfig.json` is a common source of phantom errors.

## Outstanding work (search the codebase for `TODO` / `FIXME`)

- `ShowDetails.svelte` add-to-list button always adds; should toggle (see `HoverPreview.svelte` for the correct pattern).
- `DeviceStore.signOutDevice` / `signOutAll` only update local state; they don't revoke Firebase tokens.
- `reset/[token]/+page.svelte` "Sign out other devices" checkbox is wired but never read by the submit handler.
- `searchMovies` in `catalog.ts` post-filters by `original_language === 'ko'`, breaking TMDB pagination.
- `MovieStore.pickRandom` never resets its `tried` set — if every popular movie fails trailer lookup, the Billboard stalls silently.
- `AccountStore` uses `MOCK_ACCOUNT` from `$lib/fixtures/account.ts`. Real billing/profile loader not wired.
