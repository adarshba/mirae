# Type Safety

Detail behind the type rules in `CLAUDE.md`. Hard constraints first, then organization, then examples.

## Hard constraints

- **No `any`.** Use proper domain types, generics, unions, discriminated unions, mapped types, inference, or schema validation.
- **No `as` casting.** Fix upstream typing, narrow with guards, or use typed APIs.
- **No `as unknown as T`.** Bypasses TypeScript safety entirely.
- **No `!` non-null assertions.** Branch on the nullable instead.
- **No inline shared types in `.svelte` or service files.** Shared shapes live in `src/lib/types/*.types.ts`.

If an external SDK is genuinely untyped, isolate the unsafe boundary in a wrapper and mark it `// FIXME: <reason>`. Treat as tech debt.

## Type organization

Ambient global types live in `src/lib/types/`:

- `title.types.ts` — TMDB shapes (`Title`, `TitleDetails`, `Genre`, `TmdbResponse`, `Trailer`, `TitleGenreRow`).
- `ui.types.ts` — `PopupPosition`, `SimilarCardProps`, `CardState`, `ModalState`.
- `account.types.ts` — `Account`, `TrackedDevice`, `DeviceKind`, plan/device types.

Files use `declare global { } export {}` so types are available without import. Add new shared shapes here. One-off `Props` types stay inline in the component.

## Inline type restrictions

Avoid:

- Large inline object types.
- Deeply nested inline interfaces.
- Repeated anonymous structures.

Allowed:

- Tiny one-off local generics.
- Short callback parameter typing for readability.
- Component-local `Props` types.

Bad:

```ts
const titles: {
  id: string;
  title: string;
  thumbnail: string;
}[] = [];
```

Good:

```ts
const titles: Title[] = [];
```

## `unknown`

Allowed only for external/dynamic data. Narrow immediately with a guard. Never cast.

Good:

```ts
const payload: unknown = await response.json();
if (isTitle(payload)) {
  return payload;
}
```

Bad:

```ts
const payload = (await response.json()) as Title;
```

## Type modeling

Prefer:

- Discriminated unions.
- Literal types.
- `readonly` structures for non-mutable data.
- Exact domain models.

Avoid:

- Loose object maps (`Record<string, any>`).
- Optional-everything interfaces.
- Catch-all index signatures.

## Type imports

Use `import type` for type-only imports:

```ts
import type { Title } from '$types/title.types';
```

For ambient types in `src/lib/types/`, no import is needed.

## DOM typing

Prefer typed selectors:

```ts
const video = document.querySelector<HTMLVideoElement>('video');
if (!video) return;
```

Not:

```ts
const video = document.querySelector('video') as HTMLVideoElement;
```

## Svelte rules

Inside `.svelte` files:

- Keep type logic minimal.
- Import all domain types from `$types/*.types.ts`.
- Avoid large inline prop typing.

Good:

```ts
import type { TitleCardProps } from '$types/ui.types';
let { title, thumbnail }: TitleCardProps = $props();
```

Bad:

```ts
let {
  title,
  thumbnail
}: {
  title: string;
  thumbnail: string;
} = $props();
```

## Architecture

- Types represent business contracts.
- Single source of truth per shape. Duplicate type definitions are forbidden.
- Casting is not a substitute for modeling. If casting feels necessary, the upstream typing is probably wrong.
- Runtime validation > trust-based assertions for external payloads.
- Type safety has higher priority than development speed.
