// Product pages get fetched through r.jina.ai's Reader API, which fetches the target
// page with a real (headless-browser-backed) renderer and hands back HTML with proper
// CORS headers — unlike ad-hoc "free" CORS proxies (corsproxy.io, allorigins, corsfix, …)
// which turned out to be dead, unreachable, or gated behind a domain-registration wall
// in practice. Jina is a maintained product, not a hobby proxy, so it's a much more
// durable choice for this best-effort feature.
const JINA_READER_BASE = 'https://r.jina.ai/'
const FAST_TIMEOUT_MS = 12000
const RENDERED_TIMEOUT_MS = 30000

async function fetchWithTimeout(url: string, timeoutMs: number, headers: Record<string, string>): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal, headers })
  } finally {
    clearTimeout(timer)
  }
}

// Most storefronts server-render their product data, so a plain fetch already has
// everything we need and returns in a couple of seconds.
export async function fetchHtmlFast(url: string): Promise<string> {
  const response = await fetchWithTimeout(
    JINA_READER_BASE + url,
    FAST_TIMEOUT_MS,
    { 'X-Return-Format': 'html' },
  )
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.text()
}

// For sites with no product data in the raw response (client-rendered SPAs, e.g.
// Stark-Suomi's Angular storefront): asking for raw HTML plus a "wait for this selector"
// header turned out to be unreliable — it started coming back with the same unrendered
// shell as the fast fetch, as if the wait was being skipped. Jina's *default* reader mode
// (markdown, no X-Return-Format override) reliably runs the full headless-browser render
// regardless, so that's used here instead and the product is read out of the extracted
// text rather than out of a `<script type="application/ld+json">` tag.
export async function fetchRenderedText(url: string): Promise<string> {
  const response = await fetchWithTimeout(JINA_READER_BASE + url, RENDERED_TIMEOUT_MS, {})
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.text()
}
