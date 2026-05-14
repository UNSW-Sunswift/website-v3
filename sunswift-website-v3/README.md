# Sunswift Website App

Next.js 16 App Router website for Sunswift Racing.

## Local Development

Run the repository harness first from the repo root:

```bash
../init.sh
```

Then start the app:

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Webflow Copy Import

```bash
pnpm import:webflow
```

This refreshes `content/webflow-pages.json` from the current Webflow site.

## Browser Verification

Start the dev server in one shell, then run the browser check in another:

```bash
pnpm exec agent-browser install
pnpm verify:browser
```

`agent-browser install` is only needed the first time on a machine.
