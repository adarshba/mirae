# Architecture

## Layout

```
src/
├── app.css                       Tailwind v4 entry + @theme tokens + base layer
├── lib/
│   ├── cn.ts                     cn() classname helper (clsx + tailwind-merge)
│   ├── tmdb.ts                   getTmdbImageUrl / getTmdbPosterUrl / getTmdbBackdropUrl / fetchTrailer / handleNoImageError
│   ├── titleFormat.ts            formatReleaseYear, calculateMatchPercent, convertMinsToHrs
│   ├── firebaseClient.ts         Firebase client init + authErrorMessage()
│   ├── constants/                *.constants.ts (tmdb, routes, storage, timing)
│   ├── components/               Feature components + auth/ profile/ ui/ player/ subtrees
│   ├── fixtures/                 Mock seed data (e.g. account.fixtures.ts)
│   ├── server/api/               TMDB client (server-only) — tmdbClient.ts + catalogService.ts
│   ├── stores/                   Class-based runes stores (*.svelte.ts) + createContext<T>() pairs
│   └── types/                    Ambient *.types.ts (title, ui, account)
└── routes/                       SvelteKit pages, layouts, API endpoints
```

## Data flow

TMDB is never called from the browser. Two paths reach it, both via `$api/catalogService.ts` which wraps `$api/tmdbClient.ts#tmdbFetch`:

1. **`+page.server.ts` loaders** call helpers in `$api/catalogService.ts` directly. The root loader fetches popular/top-rated/trending/new-releases in parallel, then fans out one `discover/movie?with_genres=<id>` call per row in `CURATED_GENRE_ROWS` via `Promise.all`. Mirror this pattern when adding shelves.
2. **Internal `/api/*` endpoints** (`src/routes/api/title/[id]`, `.../similar`, `src/routes/api/trailer/[titleId]`) are thin proxies to the same catalog helpers. The client-side `ModalStore` and `tmdb.ts#fetchTrailer` hit these.

When extending the catalog: add the helper to `$api/catalogService.ts` (calling `tmdbFetch` for transport) and expose it either via a loader or a new `/api/...` `+server.ts` route mirroring the existing thin-proxy style.

## State: Svelte 5 runes + context

All cross-component state is a runes-based class store instantiated once in `src/routes/+layout.svelte` and pushed into context via a `createContext<T>()` pair exported from each store file.

- `TitleStore` — `popularTitles`; randomly picks `selectedTitle` for the Billboard. Tracks tried IDs in a `SvelteSet`.
- `TitleCardStore` — hover-preview position/dimensions and currently-hovered title.
- `ModalStore` — details modal. Includes a `SvelteMap` cache of fetched `TitleDetails`.
- `AuthStore` — Firebase `onAuthStateChanged` wrapper. Exposes `user`, `ready`, `signOut`.
- `AccountStore` — wraps `MOCK_ACCOUNT` (`$lib/fixtures/account.fixtures.ts`). TODO: real loader.
- `DeviceStore` — tracks current browser session in `localStorage` keyed by Firebase `uid`.
- `favoritesStore` — factory function (not class) backed by `localStorage` under `STORAGE_KEYS.favorites`. Guards `localStorage` access with `browser` from `$app/environment`.

Adding a new store:

1. Create `src/lib/stores/myThingStore.svelte.ts`.
2. Export the class plus `[getMyThingContext, setMyThingContext] = createContext<MyThingStore>()`.
3. Instantiate it in `src/routes/+layout.svelte` and call `setMyThingContext(...)` there.
4. Consumers call `getMyThingContext()`. Never `new` the store in a component.

## Auth & route guarding

`src/routes/+layout.svelte` reads two arrays from `$lib/constants/routes.constants.ts`:

- `AUTH_ROUTES` — `/login`, `/signup`, `/forgot`, `/reset`. Logged-in users redirect to `/`.
- `PROTECTED_ROUTES` — `/account`, `/my-list`, `/watch`. Guests redirect to `/login?from=<path>`.

Pages outside both arrays are public. Components opt into degraded guest interaction via `getAuthContext().user`.

The auth subtree `src/routes/(auth)/...` shares a minimal layout (no Navbar/Footer). Form primitives live in `src/lib/components/auth/`: `AuthCard`, `TextField`, `PasswordField`, `PrimaryButton`, `OutlineButton`, `Banner`, `ResendButton`, `StrengthMeter`.

## Components

`src/lib/components/`:

- **Top level** — feature components: `Billboard`, `TitleRow`, `TitleThumbnail`, `TitleHoverPreview`, `TitleDetailsModal`, `SimilarTitleCard`, `TrailerPlayer`, `Navbar`, `Footer`.
- **`auth/`** — login/signup form primitives.
- **`profile/`** — `Avatar`, `ProfileDropdown`.
- **`ui/`** — `bits-ui`-based shadcn-svelte primitives.
- **`player/`** — full video player tree: `VideoPlayer`, `PlayerControls`, `PlayerPopover`, `PlayerControlButton`, `PictureInPictureButton`, `SubtitlesMenu`, `SpeedMenu`, `EpisodesMenu`, `VolumeControl`, `ScrubBar`, `PlayerTopBar`, `UpNextCard`, plus `player.fixtures.ts` and `playerTime.ts`.

`TitleHoverPreview` and `TitleDetailsModal` are mounted once in `+layout.svelte` and driven entirely by store state. Components that want to open the modal or trigger a hover mutate the store; they do not render their own modal/preview.

## Constants

Located in `src/lib/constants/`. Anything referenced by more than one file or defining an external contract goes here. Magic numbers used by a single component stay local.

- `tmdb.constants.ts` — `TMDB_BASE_URL`, `TMDB_IMG_BASE`, `TMDB_IMG_SIZE`, `CURATED_GENRE_ROWS`. Use the `getTmdbImageUrl(path, size)` / `getTmdbPosterUrl(path)` / `getTmdbBackdropUrl(path)` helpers in `$lib/tmdb` — never reconstruct image URLs inline.
- `routes.constants.ts` — `AUTH_ROUTES`, `PROTECTED_ROUTES`.
- `storage.constants.ts` — `STORAGE_KEYS` (favorites, devicesPrefix).
- `timing.constants.ts` — `HOVER_DELAY_MS`, `AUTH_REDIRECT_DELAY_MS`, `NAVBAR_STICKY_SCROLL_PX`, `HOVER_PREVIEW_Y_OFFSET_PX`.

## Types

Ambient global types live in `src/lib/types/`. No `import` is needed at the call site.

- `title.types.ts` — TMDB shapes (`Title`, `TitleDetails`, `Genre`, `TmdbResponse`, `Trailer`, …) and `TitleGenreRow`.
- `ui.types.ts` — `PopupPosition`, `SimilarCardProps`, `CardState`, `ModalState`.
- `account.types.ts` — `Account`, `TrackedDevice`, `DeviceKind`, plan/device types.

Add new shared shapes here. One-off `Props` types stay inline in the component.

## Styling: Tailwind v4 + design tokens

Single CSS entry at `src/app.css`, imported once from `src/routes/+layout.svelte`:

1. `@import 'tailwindcss';` and plugins.
2. Pretendard font import.
3. `@theme { ... }` block defining design tokens (colors, spacing, brand, auth vars).
4. `@layer base` — body/html/scrollbar/typography resets.
5. `@layer components` — shared semantic classes (`.btn`, `.btn-primary`, `.btn-icon`, `.text-display`, `.text-h1`, `.badge-match`, `.no-scrollbar`, …).

Component `<style>` rules:

1. Prefer Tailwind utilities in `class="..."` for layout. Reserve `<style>` for rules that can't be expressed atomically.
2. No raw hex, no raw px for tokenized values. Use `var(--space-6)`, `var(--text-primary)`, etc. Viewport units and dynamic geometry are fine.
3. Dynamic geometry from JS goes through CSS custom properties (`style="--x: {x}px"`), not inline `style="top: …"`. See `TitleHoverPreview.svelte`.
4. `:global()` only for documented third-party overrides (Plyr `--plyr-*` vars) or icons passed to slot-less Lucide components.

## TypeScript config

`tsconfig.json` extends `.svelte-kit/tsconfig.json` (generated by `svelte-kit sync`). Key flags: `strict: true`, `checkJs: true`, `allowJs: true`, `moduleResolution: "bundler"`, `rewriteRelativeImportExtensions: true`.

Always run `bun check` (which runs `svelte-kit sync` first) after touching types, route files, or path aliases. Stale `.svelte-kit/tsconfig.json` is a common source of phantom errors.

## Linting

ESLint flat config (`eslint.config.js`) extends `js.recommended`, `typescript-eslint`, `eslint-plugin-svelte`, `eslint-config-prettier`. Honors `.gitignore` via `@eslint/compat`'s `includeIgnoreFile`.

- `no-undef` is intentionally off (TS handles it).
- `svelte/no-navigation-without-resolve` is off (conflicts with typed `resolve()` + dynamic routes). Don't re-enable without addressing that.
- `no-restricted-imports` is set to **error** to enforce path-alias and module-rename guardrails.

Prettier (`.prettierrc`) uses `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`. Drives both `bun format` and `bun lint`.

## Deployment

Vercel via `@sveltejs/adapter-vercel`. No `vercel.json`. Vercel auto-detects `bun.lock` and uses Bun for install/build.
