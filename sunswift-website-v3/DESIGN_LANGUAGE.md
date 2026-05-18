# Sunswift Website Design Language

This file is for future maintainers and AI-assisted editing sessions. Use it
when changing public pages, admin screens, or shared components so new work
continues to feel native to the website.

## Core Direction

Sunswift is technical, student-built, and cinematic. The interface should feel
precise and engineered, not decorative or generic.

- Primary mood: dark editorial, high contrast, measured motion, clean blocks.
- Public pages: cinematic imagery, large lightweight headings, sparse copy,
  hard section joins unless a component explicitly uses a vignette.
- Admin pages: quiet operational UI, clear labels, obvious actions, no visual
  ambiguity.
- Avoid: generic shadcn card stacks, purple/blue SaaS gradients, soft bokeh,
  marketing hero layouts, and repeated explanatory copy.

## Colour

- Base dark: near-black `#050607` / `#0a0c0e`.
- Light canvas: warm off-white `#f6f5f1`.
- Accent: Sunswift yellow via `accent-yellow`.
- Use yellow sparingly for action, state, active lines, and calibration effects.
- Hard colour transitions are preferred for page section joins unless the
  feature is explicitly cinematic, such as achievements, dropdowns, or hero
  boot effects.

## Layout

- Sections should click together cleanly with stable edges and no accidental
  gradient seams.
- Cards are for repeated items, modals, and editing surfaces. Do not nest cards.
- Use generous side padding on public grid pages and keep grid rhythm obvious.
- Public partner/logo grids should feel architectural: square cells, consistent
  gaps, and clear hover/focus states.
- Admin forms should group fields by task, not data model. Add helper text when
  a non-technical editor needs to know what happens next.

## Typography

- Public display headings use very light weights, large scale, and tight but
  readable line-height.
- Do not use negative letter spacing.
- Admin headings use normal product UI hierarchy: clear page title, short help,
  then task panels.
- Use mono uppercase labels for metadata, not body copy.

## Motion

- Motion must be purposeful and interruptible.
- Prefer transform and opacity. Do not animate layout properties.
- Dropdowns can use opacity, transform, and subtle filter/grid reveal.
- Hero and cinematic sections may use one deliberate transition, but avoid
  stacked effects that fight scroll.
- Always honor `prefers-reduced-motion`.

## Imagery

- Public pages should use real product/team/place imagery or intentional
  placeholders that match the page context.
- Heavy gallery images should avoid full `quality={100}` unless there is a
  specific inspection/detail reason.
- Editable public imagery should flow through Site Images CMS when the image is
  part of a public page design rather than imported content.

## Admin UX

- Use plain language: "Upload replacement images" beats "Public S3".
- File inputs should have clear button-like styling and adjacent instructions.
- Save buttons should name the object being saved when possible.
- Batch actions should make selection state and consequences obvious.
- Compact/density controls must visibly change the layout when toggled.

## Verification Expectations

- Public homepage changes must update `scripts/test-homepage-design.mjs` and
  browser contracts when selectors or visual invariants change.
- Admin UI changes that touch regression hooks must update the harness evidence
  in `feature_list.json` and append `claude-progress.md`.
- Use `agent-browser` screenshots for visual changes after the dev/prod server
  is running.
