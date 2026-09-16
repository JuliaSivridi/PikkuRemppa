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
