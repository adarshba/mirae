# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mirae is a Korean-drama streaming UI built with **SvelteKit (Svelte 5, runes)**, **TypeScript**, **vanilla CSS** (token-driven design system, no framework), and **Bun**. It's TMDB-powered and ships through `svelte-adapter-bun` (production server is `bun run build/index.js`).

## Commands

Package manager is **Bun** (see `bun.lock`, `.npmrc` sets `engine-strict=true`).

```bash
bun install
bun dev            # vite dev server
bun run build      # production build (adapter-bun)
bun start          # bun run build/index.js
bun preview
bun check          # svelte-kit sync && svelte-check --tsconfig ./tsconfig.json
bun check:watch
bun lint           # prettier --check . && eslint .
bun format         # prettier --write .
```

There is no test runner configured. Per the user's `CLAUDE.md` "FORCED VERIFICATION" rule, run `bun check` and `bun lint` before declaring a task complete — and explicitly state that there are no tests rather than claiming a test suite passed.

## Environment

Set `TMDB_API_KEY` in `.env` (see `.env.example`). It is read via `$env/dynamic/private` in `src/lib/server/api/tmdb-client.ts` and `catalog.ts`, both of which **throw at module load** if it's missing — the server won't boot without it.

## Path Aliases

Defined in `svelte.config.js` (these override the defaults — use them, not relative paths):

- `$components` → `src/lib/components`
- `$stores` → `src/lib/stores`
- `$types` → `src/lib/types`
- `$api` → `src/lib/server/api` (server-only)
- `$utils` → `src/lib`

## Architecture

### Data flow

TMDB is **never** called from the browser. Two paths reach it:

1. **SvelteKit `+page.server.ts` loaders** (e.g. `src/routes/+page.server.ts`) call helpers in `$api/catalog.ts`, which wrap `$api/tmdb-client.ts`. The root page loads popular/top-rated/trending in parallel, then fans out one `discover/movie?with_genres=<id>` call per genre via `Promise.all` — keep this pattern when adding new shelves.
2. **Internal `/api/*` endpoints** (`src/routes/api/movie/[id]`, `.../similar`, `src/routes/api/trailer/[movieId]`) are thin proxies to the same `$api/catalog.ts` helpers. The client-side `ModalStore` and `helpers.ts#fetchTrailer` hit these — do not bypass them and call TMDB directly from a `+page.svelte` or `.svelte.ts` file.

When extending the catalog, add the helper to `$api/catalog.ts` and either expose it via a loader or a new `/api/...` `+server.ts` route, mirroring the existing thin-proxy style.

### State: Svelte 5 runes + context

All cross-component state is a **runes-based class store** instantiated **once in `src/routes/+layout.svelte`** and pushed into context with a `createContext<T>()` pair exported from each store file:

- `MovieStore` — `popularMovies`, randomly picks `selectedMovie` via `$effect`
- `MovieCardStore` — hover-preview position/dimensions
- `ModalStore` — show-details modal, includes a `SvelteMap` cache for already-fetched `MovieDetails`
- `favoriteListStore` — factory function (not class) backed by `localStorage` under key `"favorites"`; guards `localStorage` access with `browser` from `$app/environment`

Pattern to follow when adding a new store: export `getXContext`/`setXContext` from a `*.svelte.ts` file, instantiate in `+layout.svelte`, and call `setXContext(...)` there. Consumers call `getXContext()` — do not `new` a store inside a component.

### Types

Global ambient types live in `src/lib/types/types.d.ts` (no imports needed). The file is in a transitional state: there are both `Show`/`ShowDetails` (new) and `Movie`/`MovieDetails` (legacy) sets, plus a deliberate `TMDBRespones` → `TMDBResponse` alias. Most code still uses the `Movie*` names — match surrounding code rather than mixing conventions in a single file.

### Components

`src/lib/components/` holds presentational pieces (`Billboard`, `ContentRow`, `Thumbnail`, `HoverPreview`, `Navbar`, `ShowDetails`, `VideoPlayer` (Plyr-based), `RelatedCard`). `HoverPreview` and `ShowDetails` are mounted once in `+layout.svelte` and driven entirely by store state — components that want to open the modal or trigger a hover should mutate the corresponding store, not render their own modal/preview.

## Styling: vanilla CSS design system

There is no CSS framework — styling is a hand-rolled design system under `src/styles/`:

- `theme.css` — two-layer design tokens: **L1 primitives** (`--color-gray-*`, `--space-*`, `--radius-*`) and **L2 semantic** (`--bg-app`, `--btn-primary-bg`, `--accent-match`, `--z-modal`). Components and `utils.css` reference **only L2**; L1 primitives stay in `theme.css`. Also holds the font import (Sharp Sans), body reset, and breakpoint reference (sm 640, md 768, lg 1024).
- `text.css` — typography classes (`.text-display`, `.text-h1`–`.text-h3`, `.text-body`, `.text-body-sm`, `.text-meta`, `.text-caption`, `.text-button`).
- `utils.css` — reusable **semantic** classes only: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-icon`, `.card`, `.modal-overlay`, `.gradient-fade-bottom`/`-top`, `.badge-match`, `.badge-rating`, `.flex-center`, `.no-scrollbar`, `.sr-only`. **No atomic Tailwind-style helpers** (`.p-3`, `.flex`, etc.) — those belong in component `<style>` blocks.

All three are imported once at the top of `src/routes/+layout.svelte`.

Component `<style>` rules (enforced by review):

1. One root class per component, kebab-case matching the filename (`.billboard`, `.content-row`). Modifiers use BEM (`__elem`, `--variant`); state uses `.is-*` toggled with `class:`.
2. **No raw hex, no raw px** for tokenized values — use `var(--space-*)`, `var(--color-*)`, etc. Exceptions: viewport units, dynamic geometry, and ad-hoc one-offs (document with a one-line comment).
3. Dynamic geometry from JS goes through CSS custom properties via `style="--x: {x}px"`, not inline `style="top: …"`. See `HoverPreview.svelte` for the pattern.
4. `:global()` only for documented third-party overrides (Plyr's `--plyr-*` vars in `VideoPlayer.svelte`) or for icons passed to slot-less Lucide components.

## Linting & Formatting

- ESLint flat config (`eslint.config.js`) extends `js.recommended`, `typescript-eslint`, `eslint-plugin-svelte` (+ its prettier config), and `eslint-config-prettier`. It honors `.gitignore` via `@eslint/compat`'s `includeIgnoreFile`.
- `no-undef` is intentionally off (TS handles it).
- `svelte/no-navigation-without-resolve` is off due to a conflict with typed `resolve()` + dynamic routes — don't re-enable it without addressing that.
- Prettier config (`.prettierrc`) uses only `prettier-plugin-svelte`. Drives both `bun format` and `bun lint`.

## TypeScript

`tsconfig.json` extends `.svelte-kit/tsconfig.json` (generated by `svelte-kit sync`). Key flags: `strict: true`, `checkJs: true`, `allowJs: true`, `moduleResolution: "bundler"`, `rewriteRelativeImportExtensions: true`. Always run `bun check` (which runs `svelte-kit sync` first) after touching types, route files, or path aliases — stale `.svelte-kit/tsconfig.json` is a common source of phantom errors.
