import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import react from '@vitejs/plugin-react'

// Multi-page build: each route gets its own physical HTML file
// with its own <title>, meta description, canonical, OG tags,
// and JSON-LD structured data. Search engines index each URL as
// a separate document. All pages load the same React bundle,
// which then renders the right page based on window.location.
//
// The compare pages (/compare/{a}-vs-{b}) aren't in this input list
// — they're generated at build time by the generateComparePages
// plugin below, which writes one HTML file per alphabetical lender
// pair using lenders.json + the built index.html as a template.
export default defineConfig({
  plugins: [react(), generateComparePages()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        calculator: resolve(__dirname, 'calculator/index.html'),
        lenders:    resolve(__dirname, 'lenders/index.html'),
        about:      resolve(__dirname, 'about/index.html'),
        swedenTax:  resolve(__dirname, 'skatt-bitcoin-lan/index.html'),
      },
    },
  },
})

// Generates /dist/compare/{a}-vs-{b}/index.html for every alphabetical
// pair of lenders in public/lenders.json. Each file is the built
// index.html with its head metadata rewritten for that specific pair.
// Non-canonical orderings (e.g. /compare/strike-vs-ledn) fall through
// Cloudflare Pages' SPA fallback to the root index.html, where the
// React app renders the right pair and the canonical link tag points
// at the alphabetical URL — so duplicate-content risk is contained.
function generateComparePages() {
  return {
    name: 'generate-compare-pages',
    apply: 'build',
    writeBundle(opts) {
      const outDir = opts.dir || resolve(__dirname, 'dist')
      const distIndexPath = resolve(outDir, 'index.html')
      const lendersJsonPath = resolve(__dirname, 'public/lenders.json')
      if (!existsSync(distIndexPath) || !existsSync(lendersJsonPath)) return

      const templateHtml = readFileSync(distIndexPath, 'utf8')
      const lendersData = JSON.parse(readFileSync(lendersJsonPath, 'utf8'))
      const lenders = lendersData.lenders || []

      const pairs = []
      for (let i = 0; i < lenders.length; i++) {
        for (let j = i + 1; j < lenders.length; j++) {
          pairs.push([lenders[i], lenders[j]])
        }
      }

      const slugs = []
      for (const [a, b] of pairs) {
        // Always pass the alphabetical pair to buildCompareHtml so
        // the generated title and description match the URL order.
        // The visible "winner vs runner" copy in Compare.jsx is a
        // separate UX choice — that one is sorted by cost.
        const [first, second] = a.id < b.id ? [a, b] : [b, a]
        const slug = `${first.id}-vs-${second.id}`
        slugs.push(slug)
        const pairDir = resolve(outDir, 'compare', slug)
        mkdirSync(pairDir, { recursive: true })
        const html = buildCompareHtml(templateHtml, first, second, slug)
        writeFileSync(resolve(pairDir, 'index.html'), html, 'utf8')
      }

      // Append compare URLs to the sitemap so search engines can
      // discover every pair. We splice them in just before </urlset>
      // so the hand-written entries (root, /calculator, /lenders,
      // /about, /skatt-bitcoin-lan) stay where they are.
      const sitemapPath = resolve(outDir, 'sitemap.xml')
      if (existsSync(sitemapPath)) {
        let sitemap = readFileSync(sitemapPath, 'utf8')
        const compareEntries = slugs
          .map((slug) => {
            const loc = `https://stackandborrow.com/compare/${slug}`
            return (
              `  <url>\n` +
              `    <loc>${loc}</loc>\n` +
              `    <changefreq>weekly</changefreq>\n` +
              `    <priority>0.6</priority>\n` +
              `    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>\n` +
              `    <xhtml:link rel="alternate" hreflang="sv" href="${loc}"/>\n` +
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>\n` +
              `  </url>\n`
            )
          })
          .join('')
        sitemap = sitemap.replace('</urlset>', `${compareEntries}</urlset>`)
        writeFileSync(sitemapPath, sitemap, 'utf8')
      }

      console.log(`[generate-compare-pages] wrote ${pairs.length} compare pages and updated sitemap.`)
    },
  }
}

function buildCompareHtml(template, lenderA, lenderB, canonicalSlug) {
  // The canonical-slug name order ("ledn-vs-strike") drives the visible
  // title via lenderA = first alphabetically, lenderB = second. This
  // means the same alphabetical pair always gets the same generated
  // file and the same title/description.
  const aName = lenderA.name
  const bName = lenderB.name
  const canonicalUrl = `https://stackandborrow.com/compare/${canonicalSlug}`
  const title = `${aName} vs ${bName} — Bitcoin Loan Comparison | Stack & Borrow`
  const description = `${aName} vs ${bName}: APR, origination fees, custody, rehypothecation, and total cost on a Bitcoin-backed loan. Independent comparison, sats-first ranking.`
  const ogTitle = `${aName} vs ${bName} — which Bitcoin lender wins?`
  const keywords = [
    `${aName.toLowerCase()} vs ${bName.toLowerCase()}`,
    `${aName.toLowerCase()} review`,
    `${bName.toLowerCase()} review`,
    'bitcoin loan comparison',
    'btc backed loan comparison',
    `${aName.toLowerCase()} vs ${bName.toLowerCase()} rates`,
    'bitcoin loan rates compared',
  ].join(', ')

  // Build a fresh head section by replacing the meta tags that change
  // per route. The template's <body> and asset references are kept
  // untouched, so the React bundle still boots from the same hashed
  // chunk that vite emitted into dist/assets/.
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(description)}" />`,
    )
    .replace(
      /<meta name="keywords" content="[^"]*"\s*\/?>/,
      `<meta name="keywords" content="${escapeAttr(keywords)}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeAttr(ogTitle)}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeAttr(description)}" />`,
    )
    .replace(
      /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeAttr(ogTitle)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    )

  // Replace the per-page hreflang alternates so both surfaces point
  // at this canonical URL — the page is bilingual at one URL.
  html = html
    .replace(
      /<link rel="alternate" hreflang="en" href="[^"]*"\s*\/?>/,
      `<link rel="alternate" hreflang="en" href="${canonicalUrl}" />`,
    )
    .replace(
      /<link rel="alternate" hreflang="sv" href="[^"]*"\s*\/?>/,
      `<link rel="alternate" hreflang="sv" href="${canonicalUrl}" />`,
    )
    .replace(
      /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/?>/,
      `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`,
    )

  // Drop the WebApplication / WebSite / Organization JSON-LD blocks
  // that ship in the root index.html and replace them with one
  // Article block specific to this pair. Crawlers see exactly one
  // page identity per URL.
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${aName} vs ${bName} — Bitcoin Loan Comparison`,
    url: canonicalUrl,
    description,
    author: { '@type': 'Organization', name: 'Stack & Borrow' },
    publisher: { '@type': 'Organization', name: 'Stack & Borrow' },
    about: [
      { '@type': 'Organization', name: aName },
      { '@type': 'Organization', name: bName },
    ],
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://stackandborrow.com/' },
      { '@type': 'ListItem', position: 2, name: 'Lenders', item: 'https://stackandborrow.com/lenders' },
      { '@type': 'ListItem', position: 3, name: `${aName} vs ${bName}`, item: canonicalUrl },
    ],
  }
  // Strip every existing JSON-LD block and inject ours.
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g,
    '',
  )
  const newJsonLd =
    `    <script type="application/ld+json">\n${JSON.stringify(articleJsonLd, null, 2)}\n    </script>\n` +
    `    <script type="application/ld+json">\n${JSON.stringify(breadcrumbJsonLd, null, 2)}\n    </script>\n`
  html = html.replace(/(<link rel="icon")/, `${newJsonLd}    $1`)

  return html
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
}
