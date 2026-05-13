// ============================================================
// DESIGN TOKENS — colors, fonts, currency + profile metadata.
// No React. Imported by everything visual.
// ============================================================

// Color palette — receipt aesthetic. Cream paper, warm-black ink,
// muted bitcoin orange. Forest green for positive callouts;
// rust for warnings. All chosen to sit calmly on cream.
export const SB = {
  cream:     '#f6f1e8',
  creamWarm: '#efe8da',
  ink:       '#1a1612',
  inkFill:   'rgba(26, 22, 18, 0.95)',
  inkSoft:   'rgba(26,22,18,0.78)',
  inkMute:   'rgba(26,22,18,0.55)',
  inkFaint:  'rgba(26,22,18,0.32)',
  inkLine:   'rgba(26,22,18,0.18)',

  orange:     '#c1690e',
  orangeSoft: 'rgba(193,105,14,0.55)',
  orangeWash: 'rgba(193,105,14,0.08)',
  rust:       '#9c3416',
  rustWash:   'rgba(156,52,22,0.08)',
  forest:     '#2f5d3a',
  forestWash: 'rgba(47,93,58,0.08)',

  stage: '#0a0a0b',

  serif: "'Fraunces', Georgia, serif",
  sans:  "'Geist', system-ui, -apple-system, sans-serif",
  mono:  "'Geist Mono', ui-monospace, 'SF Mono', monospace",
};

// Currency metadata. `taxRate` is the rough capital-gains rate used
// for the tax-aware sell path. `position` controls symbol placement.
// `minLoan` / `maxLoan` bound the input range per currency.
export const CURRENCY_META = {
  SAT: { symbol: 'sats', label: 'SAT', position: 'post', region: 'global', taxRate: 0,  fxToUsd: null,  minLoan: 1_000_000, maxLoan: 5_000_000_000 },
  USD: { symbol: '$',    label: 'USD', position: 'pre',  region: 'us',     taxRate: 20, fxToUsd: 1.0,    minLoan: 1000,      maxLoan: 5_000_000 },
  EUR: { symbol: '€',    label: 'EUR', position: 'pre',  region: 'eu',     taxRate: 26, fxToUsd: 1.08,   minLoan: 1000,      maxLoan: 4_600_000 },
  GBP: { symbol: '£',    label: 'GBP', position: 'pre',  region: 'uk',     taxRate: 20, fxToUsd: 1.27,   minLoan: 800,       maxLoan: 3_900_000 },
  CAD: { symbol: 'C$',   label: 'CAD', position: 'pre',  region: 'ca',     taxRate: 25, fxToUsd: 0.73,   minLoan: 1000,      maxLoan: 6_800_000 },
  AUD: { symbol: 'A$',   label: 'AUD', position: 'pre',  region: 'au',     taxRate: 22, fxToUsd: 0.66,   minLoan: 1500,      maxLoan: 7_500_000 },
  JPY: { symbol: '¥',    label: 'JPY', position: 'pre',  region: 'jp',     taxRate: 20, fxToUsd: 0.0067, minLoan: 100_000,   maxLoan: 750_000_000 },
  CHF: { symbol: 'Fr',   label: 'CHF', position: 'pre',  region: 'ch',     taxRate: 0,  fxToUsd: 1.13,   minLoan: 900,       maxLoan: 4_400_000 },
  SEK: { symbol: 'kr',   label: 'SEK', position: 'post', region: 'eu',     taxRate: 30, fxToUsd: 0.094,  minLoan: 10_000,    maxLoan: 53_000_000 },
};

// Step sizes per currency for the loan-amount slider.
export const CURRENCY_STEP = {
  USD: 1000, EUR: 1000, GBP: 1000, CAD: 1000, AUD: 1000, CHF: 1000,
  SEK: 10_000, JPY: 100_000, SAT: 1_000_000,
};

// CAGR projections for each "auditor." Bear/Base/Bull, all editable.
export const DEFAULT_PROFILES = {
  saylor: {
    name: 'M. SAYLOR',
    persona: 'Maximalist',
    blurb: "Sees BTC as the apex monetary good. Long-term ~$13M target by 2045.",
    initials: 'MS',
    cases: { bear: 15, base: 29, bull: 50 },
  },
  wood: {
    name: 'C. WOOD',
    persona: 'Disruptor',
    blurb: "ARK's published bull case ~$2.4M by 2030; base ~$1.5M; bear ~$700K.",
    initials: 'CW',
    cases: { bear: 25, base: 40, bull: 65 },
  },
  schiff: {
    name: 'P. SCHIFF',
    persona: 'Permabear',
    blurb: "Has called BTC zero for over a decade. His 'bull case' is barely surviving.",
    initials: 'PS',
    cases: { bear: -20, base: -8, bull: 0 },
  },
};

// Fixed system constants.
export const LTV_PCT = 50;
export const LIQ_LTV_PCT = 80;
export const TERM_MONTHS = 12;
