# Pushing this to GitHub

These files are a drop-in replacement for `src/`, `package.json`, and `README.md` in your `stack-and-borrow` repo. The `public/` directory in here matches what's already in your repo — included for completeness, but you can skip it.

## Quick path (overwrite)

From the root of your local `stack-and-borrow` clone:

```bash
# back up the current source just in case
mv src src.backup-$(date +%Y%m%d)

# copy the new tree over the top
cp -r /path/to/production/src ./src
cp /path/to/production/package.json ./package.json
cp /path/to/production/README.md ./README.md

# refresh dependencies (recharts removed)
rm -rf node_modules package-lock.json
npm install

# verify locally
npm run dev
```

Open http://localhost:5173 and click through:
- `/` — Calculator
- `/#lenders` — Lenders directory
- `/#about` — Terms of philosophy

## Then commit + push

```bash
git add -A
git status   # sanity check the diff
git commit -m "Redesign: receipt aesthetic, lender ranking by tier, new Lenders page"
git push
```

Cloudflare Pages will auto-deploy.

## What changed at a glance

- `src/App.jsx` — slimmed to router + ErrorBoundary
- `src/lib/{format,math,hooks}.js` — new
- `src/system/{tokens.js,components.jsx}` — new
- `src/pages/{Calculator,Lenders,About}.jsx` — new
- `package.json` — removed `recharts` dependency
- `README.md` — updated structure

Your `public/lenders.json` is unchanged. Your `public/favicon.svg` is unchanged. Your `index.html` is unchanged (still fine).

## If something looks off after deploy

- **Old localStorage state showing**: clear localStorage keys prefixed `stackandborrow:` to start fresh. Existing keys (`currency`, `desiredLoan`, `activeProfile`, `activeCase`, `profiles`) are honored for continuity.
- **Live BTC price showing fallback**: mempool.space hit a rate limit. Click the `RETRY ↻` button under the price.
- **Lender list empty**: `public/lenders.json` didn't load. Check the file path is `/lenders.json` from your deploy root.

## Want me to revert?

```bash
mv src src.receipt-attempt
mv src.backup-YYYYMMDD src
```

— and push again. The original code is preserved in your `src.backup-…` folder.
