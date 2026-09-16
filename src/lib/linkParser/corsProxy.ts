export interface CorsProxy {
  buildUrl: (target: string) => string
}

// corsproxy.io started requiring a paid API key and now always answers 401,
// so it's no longer usable as a free public proxy.
export const corsfix: CorsProxy = {
  buildUrl: (target) => `https://proxy.corsfix.com/?${target}`,
}

export const allOrigins: CorsProxy = {
  buildUrl: (target) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
}

const DEFAULT_PROXIES: CorsProxy[] = [corsfix, allOrigins]
const PROXY_TIMEOUT_MS = 8000

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchHtmlViaProxy(url: string, proxies: CorsProxy[] = DEFAULT_PROXIES): Promise<string> {
  let lastError: unknown

  for (const proxy of proxies) {
    try {
      const response = await fetchWithTimeout(proxy.buildUrl(url), PROXY_TIMEOUT_MS)
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`)
        continue
      }
      const html = await response.text()
      if (html && html.length > 0) return html
    } catch (err) {
      lastError = err
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Sivun lataaminen välityspalvelimen kautta epäonnistui')
}
