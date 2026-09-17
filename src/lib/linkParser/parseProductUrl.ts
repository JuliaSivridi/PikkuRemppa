import { fetchHtmlFast, fetchRenderedText } from './corsProxy'
import {
  parseBiltemaProductData,
  parseBreadcrumbs,
  parseJsonLd,
  parseOpenGraph,
  parseProductFromMarkdown,
  suggestCategoryFromBreadcrumbs,
} from './extractors'
import type { ParsedProduct, ParseResult } from './types'

function extractFromHtml(html: string): { product: ParsedProduct; source: 'json-ld' | 'og' | 'inline-data' } | null {
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
    const html = await fetchHtmlFast(url)
    const found = extractFromHtml(html)

    if (found) {
      const breadcrumbs = parseBreadcrumbs(new DOMParser().parseFromString(html, 'text/html'))
      return {
        ok: true,
        data: { ...found.product, suggestedCategory: suggestCategoryFromBreadcrumbs(breadcrumbs, found.product.name) },
        source: found.source,
      }
    }

    // ...and only pay for a full render when that came up empty, e.g. a client-rendered
    // SPA (Stark-Suomi) with no product data in the raw response. There's no DOM to read
    // a breadcrumb trail from here, so the category won't get auto-suggested for these.
    const markdown = await fetchRenderedText(url)
    const product = parseProductFromMarkdown(markdown)
    if (!product) return { ok: false, error: 'Sivulta ei löytynyt tuotetietoja' }

    return { ok: true, data: product, source: 'rendered-text' }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Sivun lataaminen epäonnistui' }
  }
}
