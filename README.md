# Diablo Auto Detailing Website

Single page SvelteKit site for Diablo Auto Detailing.

## Live site

- https://jakerslam.github.io/Diablo-Auto-Detailing-Website/

## Stack

- SvelteKit
- TypeScript
- Tailwind CSS

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
