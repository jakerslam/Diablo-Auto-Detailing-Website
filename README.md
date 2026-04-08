# Diablo Auto Detailing Website

Single page SvelteKit site for Diablo Auto Detailing.

## Live site

- [Diablo Auto Detailing App](https://jakerslam.github.io/Diablo-Auto-Detailing-Website/)

## Stack

- SvelteKit
- TypeScript
- Tailwind CSS
- shadcn-style Svelte UI primitives (`src/lib/components/ui/*`)

## Local development

1. `npm install`
2. `npm run dev`

## Production build

1. `npm run build`
2. `npm run preview`

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

To configure:

- Push to `main`.
- Set a secret named `PUBLIC_GHL_FORM_ENDPOINT` with your GoHighLevel endpoint.

The workflow publishes the generated `./build` output to GitHub Pages.

## Tracking Debug Mode

The site loads the external tracking script in `src/routes/+layout.svelte` with:

- `data-tracking-id="tk_6b8e14ba48b440209f9eb1d4b6196105"`
- `data-debug="true"`

To verify it is working:

1. Reload the deployed page.
2. Open browser console (`Cmd/Ctrl + Option/Alt + J`).
3. Confirm logs like `[LC Tracking] Tracker initialized successfully` and `[LC Tracking] Tracking initial page view`.
4. If logs are missing:
   - Confirm `<script src="https://link.msgsndr.com/js/external-tracking.js">` is present in the page source.
   - Confirm the tracking ID matches exactly.
   - Confirm the script is not blocked by an adblocker, CSP, or network restrictions.

## Form Integration (GoHighLevel)

For automatic submission syncing, keep the form in `src/routes/+page.svelte` as a native HTML form:

- Wrapped in `<form>...</form>`
- Includes an `input[type="email"]` field
- Uses `<input type="submit">`
- Does not bind custom JS to `submit` or submit-button click events

If you need a quick re-check, ensure those selectors still exist before publishing.
