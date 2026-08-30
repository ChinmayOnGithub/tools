import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLiveApi } from './client';

describe('Live API Client', () => {
  const provider = {
    name: 'Mock API Provider',
    url: 'https://mock.example.com',
    privacyNote: 'Test queries are simulated.',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and returns parsed data on success', async () => {
    const mockJson = { temperature: 22, city: 'London' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockJson,
    } as Response);

    const res = await fetchLiveApi<{ temperature: number; city: string }>(
      'https://mock.example.com/weather?city=London',
      provider,
      { cacheTtlMs: 0 }
    );

    expect(res.error).toBeNull();
    expect(res.data).toEqual(mockJson);
    expect(res.lastUpdated).toBeDefined();
  });

  it('handles rate limiting (HTTP 429) gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    const res = await fetchLiveApi(
      'https://mock.example.com/rate-limited',
      provider,
      { cacheTtlMs: 0 }
    );

    expect(res.data).toBeNull();
    expect(res.error).toContain('Rate limit reached on Mock API Provider');
  });

  it('handles server HTTP error status codes (HTTP 500)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    const res = await fetchLiveApi(
      'https://mock.example.com/error',
      provider,
      { cacheTtlMs: 0 }
    );

    expect(res.data).toBeNull();
    expect(res.error).toContain('Provider Mock API Provider returned HTTP 500');
  });

  it('applies custom transform function on response JSON', async () => {
    const mockJson = { rates: { EUR: 0.92 } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockJson,
    } as Response);

    const res = await fetchLiveApi<number>(
      'https://mock.example.com/rates',
      provider,
      {
        transform: (raw) => (raw as typeof mockJson).rates.EUR,
        cacheTtlMs: 0,
      }
    );

    expect(res.error).toBeNull();
    expect(res.data).toBe(0.92);
  });
});
