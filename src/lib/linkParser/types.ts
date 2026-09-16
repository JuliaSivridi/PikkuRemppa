export interface ParsedProduct {
  name?: string
  price?: number
  imageUrl?: string
  suggestedCategory?: string
}

export type ParseResult =
  | { ok: true; data: ParsedProduct; source: 'json-ld' | 'og' | 'inline-data' }
  | { ok: false; error: string }
