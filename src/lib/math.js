// ============================================================
// MATH — the loan-math primitives. Pure, no React. Ported from
// the original App.jsx so behavior is identical.
// ============================================================

import { SATS_PER_BTC } from './format.js';

export { SATS_PER_BTC };

// Simple interest over a fractional-year term.
export const computeInterest = (principalUsd, aprPct, termMonths) =>
  principalUsd * (aprPct / 100) * (termMonths / 12);

// Naive CAGR projection — used for back-of-envelope scenario math.
export const projectBtcPrice = (currentPrice, cagrPct, years) =>
  currentPrice * Math.pow(1 + cagrPct / 100, years);

// At what BTC price does the loan hit liqLtv (default 80%)?
// loan / (collateral × liqLtv) = liquidation price
export const computeLiquidationPrice = (loanUsd, collateralBtc, liqLtvPct = 80) =>
  loanUsd / (collateralBtc * (liqLtvPct / 100));

// Convert a currency-denominated value into USD for internal math.
export function toUsd(val, currency, currencyMeta, btcSpotUsd) {
  if (currency === 'SAT') return (val / SATS_PER_BTC) * btcSpotUsd;
  return val * currencyMeta[currency].fxToUsd;
}

// Convert USD back into a display value (without the symbol).
export function usdTo(usd, currency, currencyMeta, btcSpotUsd) {
  if (currency === 'SAT') return (usd / btcSpotUsd) * SATS_PER_BTC;
  return usd / currencyMeta[currency].fxToUsd;
}

// Resolve which rate-tier applies for a given loan size.
// Tiers ascend by maxLoanUsd; `null` = "and above". Falls back to
// the last tier if loan exceeds the table. Mirrors original App.jsx.
export function resolveTier(lender, loanUsd) {
  const tiers = lender.rateTiers || [];
  if (tiers.length === 0) {
    return { aprPct: 10, originationFeePct: lender.originationFeePct ?? 0 };
  }
  for (const t of tiers) {
    if (t.maxLoanUsd === null || loanUsd < t.maxLoanUsd) {
      return {
        aprPct: t.aprPct,
        originationFeePct: t.originationFeePct !== undefined
          ? t.originationFeePct
          : lender.originationFeePct ?? 0,
      };
    }
  }
  const last = tiers[tiers.length - 1];
  return {
    aprPct: last.aprPct,
    originationFeePct: last.originationFeePct !== undefined
      ? last.originationFeePct
      : lender.originationFeePct ?? 0,
  };
}

// Rank lenders for a given loan + region. Total cost = interest + origination.
// Optionally apply a per-region rate adjustment (some lenders charge more
// outside their home market).
export function rankLenders(allLenders, { loanUsd, region, ltvPct, termMonths }) {
  return allLenders
    .filter((l) => {
      if (!l.country) return true;
      if (l.country.includes('global')) return true;
      if (region === 'us' && l.country.includes('us')) return true;
      if (region === 'ca' && l.country.includes('ca')) return true;
      if (region === 'eu' && l.country.includes('eu')) return true;
      if (region === 'ch' && (l.country.includes('ch') || l.country.includes('eu'))) return true;
      if (region === 'uk' && (l.country.includes('uk') || l.country.includes('eu'))) return true;
      if (region === 'au' && l.country.includes('au')) return true;
      if (region === 'jp' && l.country.includes('jp')) return true;
      return false;
    })
    .filter((l) => loanUsd >= (l.minLoanUsd ?? 0) && ltvPct <= (l.maxLtv ?? 100))
    .map((l) => {
      const { aprPct, originationFeePct } = resolveTier(l, loanUsd);
      const regional = l.regionalRateAdjustment
        ? (l.regionalRateAdjustment[region] ?? l.regionalRateAdjustment.default ?? 0)
        : 0;
      const feeApplies = !(l.feeWaivedFor || []).includes(region);
      const effectiveOrigFee = feeApplies ? originationFeePct : 0;
      const effectiveApr = aprPct + regional + effectiveOrigFee;
      const interest = computeInterest(loanUsd, aprPct + regional, termMonths);
      const origFeeUsd = loanUsd * (effectiveOrigFee / 100);
      const totalCost = interest + origFeeUsd;
      return {
        ...l,
        apr: aprPct + regional,
        baseApr: aprPct,
        regionalAdjustment: regional,
        originationFeePctEffective: effectiveOrigFee,
        effectiveApr,
        interest,
        origFeeUsd,
        totalCost,
        isTiered: (l.rateTiers || []).length > 1,
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);
}
