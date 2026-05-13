// ============================================================
// FORMAT — display helpers. Pure functions, no React.
// ============================================================

// Narrow no-break space — thousands separator (Swedish/European style).
const THIN = '\u202F';

export const SATS_PER_BTC = 100_000_000;

// Format an integer with thin-space thousands separators.
// fmtNum(1234567) → "1 234 567"
export function fmtNum(n) {
  if (n == null || isNaN(n)) return '—';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(Math.round(n));
  return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, THIN);
}

// Format sats — falls back to BTC at large values.
export function fmtSats(sats) {
  if (sats == null || isNaN(sats)) return '—';
  if (Math.abs(sats) >= 1e8) return (sats / 1e8).toFixed(4) + ' BTC';
  return fmtNum(sats) + ' sats';
}

// Format an amount expressed in USD into the given currency.
// fmtMoney(50000, "EUR") → "€46 296"
export function fmtMoney(usd, currency, currencyMeta, btcSpotUsd) {
  if (usd == null || isNaN(usd)) return '—';
  if (currency === 'SAT') {
    return fmtSats((usd / btcSpotUsd) * SATS_PER_BTC);
  }
  const meta = currencyMeta[currency];
  if (!meta) return '$' + fmtNum(usd);
  const val = usd / meta.fxToUsd;
  if (meta.position === 'post') return fmtNum(val) + ' ' + meta.symbol;
  return meta.symbol + fmtNum(val);
}

// Compact dollar formatter: $1.42M, $182.5K, $11.5B.
export function fmtMoneyCompact(usd) {
  if (usd == null || isNaN(usd)) return '—';
  const sign = usd < 0 ? '−' : '';
  const abs = Math.abs(usd);
  if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(1) + 'K';
  return sign + '$' + abs.toFixed(0);
}

// Format a percentage with sign.
// fmtPct(29) → "+29.00%"
export function fmtPct(n, dp = 2) {
  if (n == null || isNaN(n)) return '—';
  return (n >= 0 ? '+' : '') + n.toFixed(dp) + '%';
}
