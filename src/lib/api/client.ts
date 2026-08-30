export interface ApiRequestOptions<T> {
  url: string;
  cacheTtlMs?: number; // In-memory cache duration (default: 5 minutes)
  timeoutMs?: number; // Request timeout in ms (default: 10000ms)
  transform?: (data: unknown) => T;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  lastUpdated?: string;
  provider: {
    name: string;
    url: string;
    privacyNote?: string;
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function fetchLiveApi<T>(
  url: string,
  provider: { name: string; url: string; privacyNote?: string },
  options: {
    cacheTtlMs?: number;
    timeoutMs?: number;
    transform?: (data: unknown) => T;
    signal?: AbortSignal;
  } = {}
): Promise<{ data: T | null; error: string | null; lastUpdated: string }> {
  const {
    cacheTtlMs = 5 * 60 * 1000,
    timeoutMs = 10000,
    transform,
    signal,
  } = options;

  const cacheKey = url;
  const cached = memoryCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < cacheTtlMs) {
    return {
      data: cached.data as T,
      error: null,
      lastUpdated: new Date(cached.timestamp).toLocaleTimeString(),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Link caller signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (res.status === 429) {
      return {
        data: null,
        error: `Rate limit reached on ${provider.name}. Please wait a moment before trying again.`,
        lastUpdated: new Date().toLocaleTimeString(),
      };
    }

    if (!res.ok) {
      return {
        data: null,
        error: `Provider ${provider.name} returned HTTP ${res.status}: ${res.statusText}`,
        lastUpdated: new Date().toLocaleTimeString(),
      };
    }

    const json = await res.json();
    const parsedData = transform ? transform(json) : (json as T);

    memoryCache.set(cacheKey, {
      data: parsedData,
      timestamp: now,
    });

    return {
      data: parsedData,
      error: null,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      return {
        data: null,
        error: `Request to ${provider.name} timed out after ${timeoutMs / 1000}s. Please check your network connection.`,
        lastUpdated: new Date().toLocaleTimeString(),
      };
    }

    const message = err instanceof Error ? err.message : 'Network communication failed';
    return {
      data: null,
      error: `Could not connect to ${provider.name} (${message}). Check your internet connection.`,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  }
}
