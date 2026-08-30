import { describe, it, expect } from 'vitest';
import { HTTP_STATUSES } from './utils';

describe('HTTP Status Explorer utils', () => {
  it('contains essential RFC 9110 HTTP status codes', () => {
    const codes = HTTP_STATUSES.map((s) => s.code);
    expect(codes).toContain(200);
    expect(codes).toContain(201);
    expect(codes).toContain(204);
    expect(codes).toContain(301);
    expect(codes).toContain(400);
    expect(codes).toContain(401);
    expect(codes).toContain(403);
    expect(codes).toContain(404);
    expect(codes).toContain(422);
    expect(codes).toContain(429);
    expect(codes).toContain(500);
    expect(codes).toContain(502);
  });

  it('all entries have valid phrases, descriptions, and developer actions', () => {
    HTTP_STATUSES.forEach((entry) => {
      expect(entry.code).toBeGreaterThanOrEqual(100);
      expect(entry.code).toBeLessThan(600);
      expect(entry.phrase.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(10);
      expect(entry.developerAction.length).toBeGreaterThan(10);
      expect(entry.spec).toContain('RFC');
    });
  });
});
