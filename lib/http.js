// Small fetch helper for the /api routes.
// Returns parsed JSON, or `null` on ANY failure (network error, timeout,
// non-2xx status, invalid JSON) so every caller can simply fall back.
export async function getJson(url, { timeout = 4000, ...init } = {}) {
  try {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeout) });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}
