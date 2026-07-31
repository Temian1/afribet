# Afribet Frontend

Standalone React and Vite frontend for reviewing the Afribet user interface.

This repository intentionally contains no backend code, backend credentials, or local API proxy. Screens and local interactions can be reviewed independently; features that require persistent accounts, payments, or server data will remain inactive until an API is configured later.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

To connect an API in a future environment, copy `.env.example` to `.env` and set `VITE_API_BASE`. Local `.env` files are ignored by Git.
