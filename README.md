# Stack & Borrow

Bitcoin-backed loan calculator. Sats-first, tax-aware, with honest lender ranking — now in the **receipt booklet** aesthetic.

## What's in this folder

```
stack-and-borrow/
├── index.html              ← page shell the browser loads
├── package.json            ← lists dependencies
├── vite.config.js          ← build config
├── public/
│   ├── favicon.svg         ← bitcoin logo
│   └── lenders.json        ← lender data — EDIT THIS to update rates
└── src/
    ├── main.jsx            ← starts the React app
    ├── App.jsx             ← router + error boundary
    ├── lib/
    │   ├── format.js       ← display helpers (fmtNum, fmtSats, fmtMoney…)
    │   ├── math.js         ← loan-math primitives + lender ranking
    │   └── hooks.js        ← useLivePrices, useLenders, usePersistentState
    ├── system/
    │   ├── tokens.js       ← colors, fonts, currency metadata, profiles
    │   └── components.jsx  ← PaperFrame, BrandHeader, DashedRule, Row…
    └── pages/
        ├── Calculator.jsx  ← the main app (loan input → estimate → lenders)
        ├── Lenders.jsx     ← full directory, filterable, ranked
        └── About.jsx       ← terms of philosophy / FAQ
```

## How to run it on your computer

You need Node.js installed. Get it from https://nodejs.org (the LTS version).

Open a terminal in this folder and type:

```
npm install
npm run dev
```

It will print a URL like `http://localhost:5173`. Open that in your browser.

To stop, press `Ctrl + C` in the terminal.

## How to build for production

```
npm run build
```

This creates a `dist/` folder with everything you need to upload to Cloudflare Pages, your StartOS, or any web host.

## How to update lender rates without touching code

1. Open `public/lenders.json` in any text editor
2. Change rates, terms, or whatever needs updating
3. Update the `lastUpdated` date at the top
4. Save the file
5. If running locally — refresh the browser. If on Cloudflare Pages — commit and push to GitHub, deploy is automatic.

## Routes

| URL fragment | Page |
|---|---|
| `/` or `#` | Calculator (default) |
| `#lenders` | Full lenders directory |
| `#about` | Terms of philosophy |

Hash routing — no server config required. Works on any static host.

## What's new vs the previous version

- **New visual language**: cream paper, warm-black ink, muted bitcoin orange. Inspired by printed loan slips and editorial pamphlets.
- **New page**: dedicated `#lenders` directory with filters (US / EU / NO REHYPO / MULTISIG).
- **Lender ranking math**: now correctly resolves rate tiers per loan size for Strike, Ledn, and Arch (previously a flat rate was used).
- **No recharts dependency**: projection chart is now inline SVG (smaller bundle, faster paint). You can remove `recharts` from `dependencies` if you like.
- **Modular source**: the original 2,000-line `App.jsx` is split into `lib/`, `system/`, and `pages/` for maintainability.

## License

Your code, your call.
