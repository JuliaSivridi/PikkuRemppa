import { fetchHtmlFast, fetchHtmlRendered } from './corsProxy'
import { parseBiltemaProductData, parseBreadcrumbs, parseJsonLd, parseOpenGraph, suggestCategoryFromBreadcrumbs } from './extractors'
import type { ParsedProduct, ParseResult } from './types'

function extractProduct(html: string): { product: ParsedProduct; source: 'json-ld' | 'og' | 'inline-data' } | null {
  const doc = new DOMParser().parseFromString(html, 'text/html')

  const jsonLd = parseJsonLd(doc)
  if (jsonLd) return { product: jsonLd, source: 'json-ld' }

  // Tried before OG: sites that ship this (currently just Biltema) include a real price
  // in it, whereas these sites' static og:* tags never carry a product:price meta tag.
  const biltema = parseBiltemaProductData(html)
  if (biltema) return { product: biltema, source: 'inline-data' }

  const og = parseOpenGraph(doc)
  if (og) return { product: og, source: 'og' }

  return null
}

export async function parseProductUrl(url: string): Promise<ParseResult> {
  try {
    // Most sites server-render their product data, so try the fast path first...
    let html = await fetchHtmlFast(url)
    let found = extractProduct(html)

    // ...and only pay for a rendered (JS-executed) fetch when that came up empty, e.g. a
    // client-rendered SPA (Stark) or a site that injects its JSON-LD via a <script> that
    // runs after load (Biltema).
    if (!found) {
      html = await fetchHtmlRendered(url)
      found = extractProduct(html)
    }

    if (!found) return { ok: false, error: 'Sivulta ei löytynyt tuotetietoja' }

    const breadcrumbs = parseBreadcrumbs(new DOMParser().parseFromString(html, 'text/html'))
    return {
      ok: true,
      data: { ...found.product, suggestedCategory: suggestCategoryFromBreadcrumbs(breadcrumbs, found.product.name) },
      source: found.source,
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Sivun lataaminen epäonnistui' }
  }
}
