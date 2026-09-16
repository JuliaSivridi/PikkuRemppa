// Product pages get fetched through r.jina.ai's Reader API, which fetches the target
// page with a real (headless-browser-backed) renderer and hands back HTML with proper
// CORS headers — unlike ad-hoc "free" CORS proxies (corsproxy.io, allorigins, corsfix, …)
// which turned out to be dead, unreachable, or gated behind a domain-registration wall
// in practice. Jina is a maintained product, not a hobby proxy, so it's a much more
// durable choice for this best-effort feature.
const JINA_READER_BASE = 'https://r.jina.ai/'
const FAST_TIMEOUT_MS = 12000
const RENDERED_TIMEOUT_MS = 20000

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

// Some sites (client-rendered SPAs, or ones that inject their JSON-LD via a <script>
// that runs after load) don't have product data in the raw response. This asks Jina's
// renderer to wait until the JSON-LD or an OG title tag actually shows up in the DOM.
export async function fetchHtmlRendered(url: string): Promise<string> {
  const response = await fetchWithTimeout(
    JINA_READER_BASE + url,
    RENDERED_TIMEOUT_MS,
    {
      'X-Return-Format': 'html',
      'X-Wait-For-Selector': 'script[type="application/ld+json"], meta[property="og:title"]',
      'X-Timeout': '15',
    },
  )
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.text()
}
