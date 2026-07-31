# Afribet Frontend

Standalone React and Vite frontend for reviewing the Afribet user interface.

This repository intentionally contains no backend code, backend credentials, or local API proxy. Screens and local interactions can be reviewed independently; features that require persistent accounts, payments, or server data will remain inactive until an API is configured later.

## Demo experience

- Register or sign in with any valid email and password; credentials never leave the browser.
- Each demo email receives a local $1,000 balance.
- Sports odds can be selected on desktop or mobile, combined in the bet slip, and placed as simulated bets.
- Demo sessions, balances, bet slips, and bet history are stored only in browser storage and can be cleared at any time.

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
