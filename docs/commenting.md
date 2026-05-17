# Commenting Policy

Detail behind the comment rules in `CLAUDE.md`.

## Default: no comments

Well-named code doesn't need narration. Prefer:

- Clear naming.
- Small functions.
- Focused abstractions.

A comment is only justified when removing it would confuse a future reader who can already see the code.

## Forbidden

- Tutorial / step-by-step narration.
- Redundant restatement of what the code does.
- Historical storytelling ("we used to do X, now we do Y").
- Dead commented-out code — use git history.

Bad:

```ts
// Increment index
index++;
```

Bad:

```ts
// Fetch user from API
const user = await fetchUser();
```

Bad:

```ts
// Old implementation
// const result = oldParser(data);
```

## Allowed labels

Use only these structured labels. One line. Explain _why_, not _what_.

### `TODO`

Actionable future work outside current scope.

```ts
// TODO: Replace polling with websocket subscriptions.
```

### `FIXME`

Known broken or incorrect behavior currently tolerated. Stronger than TODO.

```ts
// FIXME: Pagination breaks when cursor becomes stale.
```

### `HACK`

Temporary workaround. Explain why it exists.

```ts
// HACK: iOS Safari fails fullscreen transitions without a microtask delay.
```

### `BUG`

Known unexpected runtime behavior.

```ts
// BUG: Safari occasionally drops subtitle track state after seek.
```

### `NOTE`

Context for counterintuitive logic. Use sparingly — only when code alone can't communicate intent.

```ts
// NOTE: Recommendation ordering must remain stable for analytics replay consistency.
```

### `XXX`

Danger zone or structural risk marker. Reserved for fragile logic; should immediately attract reviewer attention.

```ts
// XXX: This relies on undocumented Firebase retry behavior.
```

### `MARK`

Logical section divider for genuinely large files. Don't use in small files.

```ts
// MARK: Player Lifecycle
```

## JSDoc

Use for:

- Public functions exported across feature boundaries.
- Shared utilities with non-obvious contracts.
- Complex business logic.
- Non-obvious side effects.

Avoid for:

- Trivial getters/setters.
- Small obvious functions.
- Redundant restatements of types.

Good:

```ts
/**
 * Maps connected OAuth providers to internal platform integrations.
 * Unknown providers are ignored.
 */
```

## Length

One-line comments preferred. If you need a paragraph, the code probably needs refactoring instead.

Good:

```ts
// HACK: iOS Safari fails fullscreen transitions without a microtask delay.
```

Bad:

```ts
// This waits 50ms before fullscreen because otherwise the video does not
// work properly on iOS devices when transitioning from inline playback.
```
