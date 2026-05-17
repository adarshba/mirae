# Naming Conventions

Detail behind the quick-reference rules in `CLAUDE.md`. Read the principles, then the per-kind rules.

## Principles

- Prioritize clarity over brevity.
- Use one canonical domain term — don't mix `title` / `movie` / `media` / `content` / `film` in new code.
- Prefer semantic naming over visual naming.
- Avoid abbreviations unless industry-standard.
- Never use vague filenames: `utils`, `helpers`, `common`, `misc`, `manager`.

## Files

### Svelte components — `PascalCase.svelte`

Name by responsibility or domain meaning.

Good: `TitleRow.svelte`, `EpisodeCard.svelte`, `ContinueWatchingRail.svelte`.

Bad: `BigCard.svelte`, `LeftPanel.svelte`, `RedBox.svelte` (visual, not semantic).

### Routes — kebab-case folders

`my-list/`, `watch-history/`, `continue-watching/`.

### TypeScript modules — camelCase with semantic suffix

Good: `catalogService.ts`, `authStore.svelte.ts`, `subtitleParser.ts`, `recommendationEngine.ts`.

Bad: `helpers.ts`, `utils.ts`, `misc.ts`.

### Dot-suffix file kinds

- `*.types.ts` — ambient or shared type declarations.
- `*.constants.ts` — exported constants (`UPPER_SNAKE_CASE`).
- `*.fixtures.ts` — mock data for development.

## Symbols

### Functions — verb-first camelCase

`fetchTitle()`, `loadRecommendations()`, `generateThumbnail()`, `getTmdbPosterUrl()`, `formatReleaseYear()`, `calculateMatchPercent()`.

### Variables — descriptive camelCase

Good: `titleResponse`, `thumbnailUrl`, `playbackSession`.

Bad: `res`, `tmp`, `obj`, `data` (when something more specific applies).

### Types & interfaces — PascalCase

`Title`, `PlaybackSession`, `RecommendationResponse`.

### Constants — `UPPER_SNAKE_CASE`

Exported from `*.constants.ts` files. e.g. `HOVER_DELAY_MS`, `CURATED_GENRE_ROWS`.

## Domain consistency

The canonical noun for a watchable item in this codebase is **`title`**. All new identifiers, props, store fields, response keys, and route segments use `title`.

External TMDB endpoint paths (`discover/movie`, `movie/{id}/videos`, `search/movie`) are an outside contract — keep TMDB's wording when constructing those URLs. Translate to `title` at the response/return boundary.

## Refactor rules

When renaming:

1. Preserve business meaning.
2. Update all imports, type refs, string literals, and dynamic references.
3. Detect duplicate semantic terms and pick one.
4. For shared boundary contracts (API response keys, URL segments), coordinate with consumers — don't break them silently.
5. Prefer consistency over personal preference.
