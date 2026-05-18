# AI UI Change Checklist

Use this checklist before and after AI-assisted UI edits.

## Before Editing

- Read `../AGENTS.md`, `../claude-progress.md`, `../feature_list.json`, and
  `DESIGN_LANGUAGE.md`.
- Identify whether the change is public-page, admin-page, or shared-component
  work.
- Locate the verification hooks before changing markup:
  `data-*` selectors, `scripts/test-homepage-design.mjs`, and browser scripts.
- Keep unrelated dirty files untouched.

## During Editing

- Preserve existing component patterns unless the pattern is the bug.
- Keep public sections block-aligned and high contrast.
- Keep admin labels understandable for non-technical editors.
- Prefer links for navigation and buttons for actions.
- Avoid hiding functionality behind unlabeled icons.
- Add stable `data-*` hooks when a new behavior should be verified.
- If you change automated verification expectations, update the harness docs in
  the same batch.

## Visual Review

- Check desktop, mobile, and a zoomed-out/wide view when the layout is public.
- Confirm no text becomes unreadable mid-scroll.
- Confirm hover/focus states work by keyboard and mouse.
- Confirm compact/density toggles actually change the visible layout.
- Confirm file upload controls read as controls, not plain text.

## Verification

- Run the focused static harness first:
  `node scripts/test-homepage-design.mjs`.
- Then run local binaries for typecheck/lint/build if Corepack blocks `pnpm`:
  `./node_modules/.bin/tsc --noEmit`,
  `./node_modules/.bin/eslint --quiet`, and
  `./node_modules/.bin/next build`.
- For browser checks, start the app and use `agent-browser` on affected routes.
- Log evidence in `../claude-progress.md` and `../feature_list.json`.
