import { fetchHtmlViaProxy } from './corsProxy'
import { parseJsonLd, parseOpenGraph } from './extractors'
import type { ParseResult } from './types'

export async function parseProductUrl(url: string): Promise<ParseResult> {
  try {
    const html = await fetchHtmlViaProxy(url)
    const doc = new DOMParser().parseFromString(html, 'text/html')

    const jsonLd = parseJsonLd(doc)
    if (jsonLd) return { ok: true, data: jsonLd, source: 'json-ld' }

    const og = parseOpenGraph(doc)
    if (og) return { ok: true, data: og, source: 'og' }

    return { ok: false, error: 'Sivulta ei löytynyt tuotetietoja' }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Sivun lataaminen epäonnistui' }
  }
}
