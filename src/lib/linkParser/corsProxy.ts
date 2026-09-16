export interface CorsProxy {
  buildUrl: (target: string) => string
}

export const corsProxyIo: CorsProxy = {
  buildUrl: (target) => `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
}

export const allOrigins: CorsProxy = {
  buildUrl: (target) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
}

const DEFAULT_PROXIES: CorsProxy[] = [corsProxyIo, allOrigins]

export async function fetchHtmlViaProxy(url: string, proxies: CorsProxy[] = DEFAULT_PROXIES): Promise<string> {
  let lastError: unknown

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy.buildUrl(url))
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
