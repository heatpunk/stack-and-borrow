// ============================================================
// LANDING PAGE — receipt-style hero overview.
// Marketing surface: tagline, sample estimate, what's-included
// list, pull quote. Sample numbers are intentionally static —
// the real numbers live in the Calculator (#calculator).
// ============================================================

import React from 'react';
import { SB } from '../system/tokens.js';
import {
  PaperFrame,
  BrandHeader,
  DashedRule,
  Row,
  Stamp,
  Button,
  PageNav,
  FineFooter,
  LivePriceBadge,
} from '../system/components.jsx';

export default function LandingPage({ live }) {
  return (
    <PaperFrame>
      <style>{`
        @keyframes lp-caret { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
      `}</style>

      <BrandHeader
        currentPage="I"
        pageOf="IV"
        rightSlot={
          <LivePriceBadge
            btcUsd={live?.btcUsd}
            loading={live?.loading}
            error={live?.error}
            onRefresh={live?.refresh}
          />
        }
      />

      {/* HERO */}
      <div style={{ position: 'relative', marginTop: 4 }}>
        <div style={{
          fontFamily: SB.mono,
          fontSize: 9, letterSpacing: '0.22em',
          color: SB.inkMute,
          fontWeight: 700,
          marginBottom: 10,
        }}>
          YOUR LOAN ESTIMATE
        </div>
        <h1 style={{
          margin: 0,
          fontFamily: SB.serif,
          fontSize: 36, fontWeight: 600,
          lineHeight: 1.02,
          letterSpacing: '-0.025em',
          color: SB.ink,
        }}>
          Keep your sats.<br />
          <span style={{ color: SB.orange, fontStyle: 'italic', fontWeight: 500 }}>Free some cash.</span>
        </h1>
        <div style={{
          fontFamily: SB.sans,
          fontSize: 13, lineHeight: 1.55,
          color: SB.inkSoft,
          marginTop: 14,
          maxWidth: 320,
          textWrap: 'pretty',
        }}>
          Type any amount. We compare nine lenders and show what it costs
          versus selling — net of tax, in sats.
        </div>

        {/* Stamp */}
        <div style={{ position: 'absolute', top: -6, right: -6 }}>
          <Stamp line1="TAX" line2="AWARE" size={82} />
        </div>
      </div>

      <DashedRule />

      {/* Amount input preview (static — real input is on Calculator) */}
      <div style={{
        padding: '14px 14px 14px',
        background: SB.orangeWash,
        border: `1.5px dashed ${SB.orangeSoft}`,
      }}>
        <div style={{
          fontFamily: SB.mono,
          fontSize: 9, letterSpacing: '0.22em',
          color: SB.orange, fontWeight: 700,
        }}>
          AMOUNT REQUESTED
        </div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 4,
          marginTop: 8,
        }}>
          <span style={{
            fontFamily: SB.serif,
            fontSize: 32, fontWeight: 400,
            color: SB.inkMute,
          }}>
            $
          </span>
          <span style={{
            fontFamily: SB.serif,
            fontSize: 46, fontWeight: 600,
            color: SB.ink,
            letterSpacing: '-0.025em',
            lineHeight: 1,
          }}>
            50,000
          </span>
          <span style={{
            color: SB.orange,
            fontSize: 30, lineHeight: 1,
            animation: 'lp-caret 1s steps(1, end) infinite',
            marginLeft: 1,
          }}>|</span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: SB.mono,
            fontSize: 13, fontWeight: 600,
            color: SB.inkSoft,
            letterSpacing: '0.05em',
          }}>USD ▾</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginTop: 12, paddingTop: 10,
          borderTop: `1px dotted ${SB.inkLine}`,
          fontFamily: SB.mono, fontSize: 9.5,
        }}>
          <span style={{
            background: SB.ink, color: SB.cream,
            padding: '2px 6px', letterSpacing: '0.18em',
            fontWeight: 700, fontSize: 8.5,
          }}>EDIT</span>
          <span style={{ color: SB.inkSoft }}>
            tap to change · also EUR · GBP · SEK · SAT
          </span>
        </div>
      </div>

      <DashedRule label="ESTIMATE" />

      {/* Itemized preview */}
      <div style={{ padding: '0 2px' }}>
        <Row label="Collateral required" value="0.59124 BTC" sub="≈ 59,124,000 sats" />
        <Row label="Loan-to-value" value="50%" sub="industry standard" />
        <Row label="Best APR available" value="8.50%" valueStyle={{ color: SB.orange }} sub="Strike · 12mo" />
        <Row label="Interest, 12 months" value="$4,250" sub="paid at maturity" />
        <Row label="Origination fee" value="$0.00" sub="waived for region" />
        <Row label="Liquidation price" value="$87,239" valueStyle={{ color: SB.rust }} sub="−16.4% from spot" />
      </div>

      <DashedRule label="SUBTOTAL" />

      <div style={{ padding: '0 2px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '4px 0', fontSize: 11.5,
        }}>
          <span style={{ color: SB.inkSoft }}>Total cost over 12mo</span>
          <span style={{ fontFamily: SB.mono, fontWeight: 700, color: SB.ink }}>$4,250</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '4px 0', fontSize: 11.5,
        }}>
          <span style={{ color: SB.inkSoft }}>Sats you'd sell instead</span>
          <span style={{ fontFamily: SB.mono, fontWeight: 700, color: SB.orange }}>−5,902,118</span>
        </div>

        {/* NET SATS KEPT — dashed orange stamp box */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 12px 12px',
          marginTop: 10,
          border: `1.5px dashed ${SB.orange}`,
          background: SB.orangeWash,
        }}>
          <span style={{
            fontFamily: SB.mono,
            fontSize: 10.5, letterSpacing: '0.2em',
            fontWeight: 700,
            color: SB.orange,
          }}>NET SATS KEPT</span>
          <span style={{
            fontFamily: SB.serif,
            fontSize: 22, fontWeight: 600,
            color: SB.ink,
            letterSpacing: '-0.015em',
          }}>+5,902,118</span>
        </div>
      </div>

      <DashedRule />

      <Button href="#calculator">PRINT FULL BREAKDOWN</Button>

      <div style={{
        textAlign: 'center', marginTop: 8,
        fontFamily: SB.mono,
        fontSize: 9, letterSpacing: '0.16em',
        color: SB.inkMute,
      }}>
        calculator · pick lender · save scenario
      </div>

      {/* What's included — line-item style */}
      <DashedRule label="WHAT'S IN THE BOOKLET" />
      <div style={{ padding: '4px 2px' }}>
        {[
          ['I.',   'Honest lender ranking', '9 lenders, by total cost only'],
          ['II.',  'Tax-aware comparison',  'sell vs borrow, net'],
          ['III.', 'Multi-year projection', '4 horizons, 3 scenarios'],
          ['IV.',  'Liquidation alerts',     'real-time price-drop math'],
        ].map(([no, t, sub]) => (
          <div key={no} style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr auto',
            alignItems: 'baseline',
            gap: 8,
            padding: '8px 0',
            borderBottom: `1px dotted ${SB.inkLine}`,
          }}>
            <span style={{
              fontFamily: SB.serif, fontStyle: 'italic',
              fontSize: 14, color: SB.orange, fontWeight: 500,
            }}>{no}</span>
            <span style={{
              fontFamily: SB.sans, fontSize: 12.5, fontWeight: 500,
              color: SB.ink,
            }}>{t}</span>
            <span style={{
              fontFamily: SB.mono, fontSize: 9,
              color: SB.inkMute, letterSpacing: '0.04em',
              textAlign: 'right',
            }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* Pull quote */}
      <div style={{
        marginTop: 18, padding: '14px 16px',
        background: SB.creamWarm,
        border: `1px solid ${SB.inkLine}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: -10, left: 12,
          background: SB.cream,
          padding: '0 8px',
          fontFamily: SB.mono,
          fontSize: 9, fontWeight: 700,
          letterSpacing: '0.2em',
          color: SB.inkMute,
        }}>FROM THE FIELD</div>
        <p style={{
          margin: 0,
          fontFamily: SB.serif, fontStyle: 'italic',
          fontSize: 15, lineHeight: 1.4,
          color: SB.ink,
          textWrap: 'pretty',
        }}>
          &ldquo;Selling triggers tax. Borrowing doesn&rsquo;t. That&rsquo;s not a
          loophole — that&rsquo;s the whole point.&rdquo;
        </p>
      </div>

      <FineFooter />
      <PageNav active="landing" />
      <div style={{ height: 14 }} />
    </PaperFrame>
  );
}
