export interface ParsedProduct {
  name?: string
  price?: number
  imageUrl?: string
}

export type ParseResult =
  | { ok: true; data: ParsedProduct; source: 'json-ld' | 'og' }
  | { ok: false; error: string }
