# Workflow

How work flows from idea → issue → branch → commit → PR → merge. Keep it boring and consistent so history stays grep-able.

## The flow

1. **Open an issue first.** Use a template from `.github/ISSUE_TEMPLATE/`. Every PR resolves a tracked issue. If the change is genuinely trivial (typo, comment, dep bump), skip the issue and say so in the PR body — but default to opening one.
2. **Branch off `main`.** Name it `<type>/<issue-number>-<short-slug>` (e.g. `feat/42-favorites-store`, `fix/57-modal-backdrop`). Type matches the commit prefix below.
3. **Commit in small, semantic units** following Conventional Commits (see below). One logical change per commit.
4. **Open a PR using the template.** Title mirrors the commit format. Body must include `Closes #<issue>` so GitHub auto-closes on merge.
5. **Run `bun run verify` before pushing.** Type-check + lint must pass. There is no test runner; state that in the PR test plan.
6. **Squash-merge by default.** Final commit message on `main` keeps the Conventional Commit format.

## Commit messages

Format: `<type>(<scope>)?: <subject>`

```
feat(modal): show backdrop behind trailer while it loads
fix(similar-card): fall back to poster when backdrop_path is null
chore: drop unused screenshots/
refactor(modalStore): remove dead loading state
docs(workflow): add issue→PR flow
```

### Types

| Type       | Use for                                                             |
| ---------- | ------------------------------------------------------------------- |
| `feat`     | New user-facing capability or new module.                           |
| `fix`      | Bug fix. The subject names the bug, not the fix.                    |
| `refactor` | Internal restructure with no behaviour change.                      |
| `perf`     | Performance improvement with no behaviour change.                   |
| `chore`    | Tooling, deps, config, file moves, cleanup.                         |
| `docs`     | Documentation only.                                                 |
| `style`    | Formatting / whitespace. Almost never needed — prettier handles it. |
| `test`     | Test-only changes. (No runner today; reserve for when one lands.)   |
| `revert`   | Reverts a prior commit. Body must reference the SHA being reverted. |

### Scope

Optional, lowercase, one word. Usually the directory or store/component touched (`modal`, `auth`, `tmdb`, `routes`). Skip if the change is repo-wide.

### Subject

- Imperative mood: "add", not "added" / "adds".
- Lowercase, no trailing period.
- ≤ 72 characters.
- Describe the _change_, not the file. `fix(modal): show backdrop` not `fix: update TitleDetailsModal.svelte`.

### Body (optional)

Wrap at 100 chars. Explain _why_ if non-obvious, list constraints, link related issues. Skip if the subject is self-evident.

### Footer

- `Closes #<n>` — for the issue this commit resolves on merge.
- `Refs #<n>` — for issues this touches but doesn't close.
- `BREAKING CHANGE:` — followed by a description, when public API or env shape changes.

## Branch naming

`<type>/<issue>-<slug>` — type matches commit type, slug is 2–4 kebab-case words.

```
feat/42-favorites-store
fix/57-modal-backdrop
chore/61-remove-screenshots
refactor/64-modal-loading-state
```

Never branch off another feature branch unless you explicitly need to stack PRs.

## Pull requests

- **Title** uses the Conventional Commit format. On squash-merge this becomes the commit on `main`, so write it like a commit.
- **Body** follows `.github/pull_request_template.md`. Mandatory fields: Summary, Linked issue (`Closes #N`), Test plan. Add Screenshots for UI changes.
- **Size**: aim for ≤ 400 LOC diff. Split larger work into stacked PRs.
- **Self-review** before requesting review. Read your own diff in the GitHub UI; you will spot something.
- **Don't merge with red CI.** Don't bypass hooks (`--no-verify`) to push.

## Issues

Two templates under `.github/ISSUE_TEMPLATE/`:

- **`feature.md`** — user-visible capability. Captures motivation, acceptance criteria, out-of-scope.
- **`bug.md`** — broken behaviour. Captures steps to reproduce, expected vs actual, env.

Label issues at creation. Link related issues in the body, not just by reference in commits.

## Quick checklist before opening a PR

- [ ] Issue exists and is linked via `Closes #N`.
- [ ] Branch name matches `<type>/<issue>-<slug>`.
- [ ] Every commit follows Conventional Commits.
- [ ] `bun run verify` passes locally.
- [ ] PR title is a valid Conventional Commit.
- [ ] PR body has Summary + Test plan; UI changes have screenshots.
