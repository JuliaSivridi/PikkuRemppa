import type { ParsedProduct } from './types'

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d.,-]/g, '').replace(',', '.')
    const parsed = Number.parseFloat(normalized)
    if (!Number.isNaN(parsed)) return parsed
  }
  return undefined
}

interface JsonLdNode {
  '@type'?: string | string[]
  name?: string
  image?: string | string[] | { url?: string }
  offers?: JsonLdOffer | JsonLdOffer[]
  '@graph'?: JsonLdNode[]
}

interface JsonLdOffer {
  price?: string | number
  priceCurrency?: string
}

function isProductNode(node: JsonLdNode): boolean {
  const type = node['@type']
  if (!type) return false
  const types = Array.isArray(type) ? type : [type]
  return types.some((t) => t.toLowerCase() === 'product')
}

function extractFromNode(node: JsonLdNode): ParsedProduct | null {
  if (!isProductNode(node)) return null

  const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers
  const image = Array.isArray(node.image) ? node.image[0] : node.image
  const imageUrl = typeof image === 'string' ? image : image?.url

  const product: ParsedProduct = {
    name: node.name,
    price: toNumber(offer?.price),
    imageUrl,
  }

  if (!product.name && product.price === undefined && !product.imageUrl) return null
  return product
}

function flattenNodes(node: JsonLdNode): JsonLdNode[] {
  if (node['@graph']) return node['@graph'].flatMap(flattenNodes)
  return [node]
}

export function parseJsonLd(doc: Document): ParsedProduct | null {
  const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))

  for (const script of scripts) {
    let parsed: unknown
    try {
      parsed = JSON.parse(script.textContent ?? '')
    } catch {
      continue
    }

    const candidates = Array.isArray(parsed) ? parsed : [parsed]
    for (const candidate of candidates as JsonLdNode[]) {
      for (const node of flattenNodes(candidate)) {
        const product = extractFromNode(node)
        if (product) return product
      }
    }
  }

  return null
}

function metaContent(doc: Document, selector: string): string | undefined {
  return doc.querySelector(selector)?.getAttribute('content') ?? undefined
}

export function parseOpenGraph(doc: Document): ParsedProduct | null {
  const name = metaContent(doc, 'meta[property="og:title"]') ?? doc.title
  const imageUrl = metaContent(doc, 'meta[property="og:image"]')
  const priceRaw =
    metaContent(doc, 'meta[property="product:price:amount"]') ??
    metaContent(doc, 'meta[property="og:price:amount"]')
  const price = toNumber(priceRaw)

  if (!name && price === undefined && !imageUrl) return null
  return { name: name || undefined, price, imageUrl }
}

// Extracts the JSON object assigned to `window.<varName>` in an inline <script>, handling
// nested braces and braces inside string values (a plain regex up to the first "}" would
// truncate on the first nested object).
function extractWindowVar(html: string, varName: string): unknown {
  const markers = [`window.${varName} = window.${varName} || `, `window.${varName} = `]
  let braceStart = -1
  for (const marker of markers) {
    const idx = html.indexOf(marker)
    if (idx !== -1) {
      braceStart = idx + marker.length
      break
    }
  }
  if (braceStart === -1 || html[braceStart] !== '{') return undefined

  let depth = 0
  let inString = false
  let escaped = false
  for (let i = braceStart; i < html.length; i++) {
    const char = html[i]
    if (escaped) {
      escaped = false
    } else if (char === '\\') {
      escaped = true
    } else if (char === '"') {
      inString = !inString
    } else if (!inString) {
      if (char === '{') depth++
      else if (char === '}') {
        depth--
        if (depth === 0) {
          try {
            return JSON.parse(html.slice(braceStart, i + 1))
          } catch {
            return undefined
          }
        }
      }
    }
  }
  return undefined
}

interface BiltemaProductData {
  mainImageUrl?: string
  variations?: { name?: string; priceIncVAT?: number }[]
}

// Biltema doesn't put product data in the static HTML at all — it's assembled client-side
// from a `window.productData` object into a JSON-LD <script> that Jina's renderer sometimes
// doesn't wait long enough for. `window.productData` itself, though, is plain inline JSON
// already present in the first response, so it's read directly instead.
export function parseBiltemaProductData(html: string): ParsedProduct | null {
  const data = extractWindowVar(html, 'productData') as BiltemaProductData | undefined
  const variation = data?.variations?.[0]
  if (!variation?.name && variation?.priceIncVAT === undefined) return null

  return {
    name: variation?.name,
    price: variation?.priceIncVAT,
    imageUrl: data?.mainImageUrl,
  }
}

// Jina's default reader mode extracts a page's readable content as markdown, always via a
// full headless-browser render — used as a last-resort fallback for client-rendered SPAs
// once the raw-HTML/JSON-LD attempts have all failed. There's no DOM to query here, so the
// product name and price get pulled out of the extracted text instead.
export function parseProductFromMarkdown(markdown: string): ParsedProduct | null {
  const titleMatch = markdown.match(/^Title:\s*(.+)$/m)
  const name = titleMatch?.[1]?.trim()

  // Matches "71,20 €", "71.20€", "71 €", and also a whole/decimal part split across
  // whitespace or blank lines ("71\n\n20\n\n€/ kpl"), which is how some sites' price
  // components (big number + superscript cents) end up looking once flattened to text.
  const priceMatch = markdown.match(/(\d{1,6})(?:[.,]|\s+)(\d{2})?\s*€|(\d{1,6})\s*€/)
  let price: number | undefined
  if (priceMatch) {
    const whole = priceMatch[1] ?? priceMatch[3]
    const cents = priceMatch[2]
    const value = Number.parseFloat(cents ? `${whole}.${cents}` : whole)
    if (!Number.isNaN(value)) price = value
  }

  if (!name && price === undefined) return null
  return { name, price }
}

const HOME_CRUMB_LABELS = new Set(['etusivu', 'home', 'koti', 'start', 'hem'])

// Most storefronts render a visible breadcrumb nav (Etusivu > Category > Subcategory [> Product]).
// JSON-LD BreadcrumbList data turned out to be missing or truncated on several sites we tested
// against, so this reads the rendered nav text instead. Some sites mark it with a class
// ("nav.breadcrumb"), others only with an id ("#breadcrumb-navigation"), so both are checked.
export function parseBreadcrumbs(doc: Document): string[] {
  const nav = doc.querySelector(
    'nav[aria-label="breadcrumb" i], nav.breadcrumb, [id*="breadcrumb" i], [class*="breadcrumb" i]',
  )
  if (!nav) return []

  // Prefer <a> text: breadcrumb icons (e.g. Material Icons ligatures like "chevron_right")
  // sit inside the same <li>/<span> as the label and would otherwise pollute the text. The
  // current page is also conventionally the one crumb that isn't a link, which is exactly
  // the one we don't want here (that's the product name, not a category).
  const links = Array.from(nav.querySelectorAll('a'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean)
  if (links.length > 0) return [...new Set(links)]

  const items = Array.from(nav.querySelectorAll('span, li'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean)
  return [...new Set(items)]
}

// Picks the most specific breadcrumb crumb that isn't the product itself and isn't a
// generic "home" root, to suggest a material category (e.g. "Ilmastointiteippi", "Ikkunapellit").
export function suggestCategoryFromBreadcrumbs(crumbs: string[], productName?: string): string | undefined {
  const name = (productName ?? '').trim().toLowerCase()
  const trail = crumbs.filter((c) => !HOME_CRUMB_LABELS.has(c.trim().toLowerCase()))

  for (let i = trail.length - 1; i >= 0; i--) {
    const candidate = trail[i].trim()
    if (candidate && candidate.toLowerCase() !== name) return candidate
  }
  return undefined
}
