import { describe, it, expect } from 'vitest';
import { 
  getPublishedGuides,
  getGuideBySlug,
  getPublishedNavigation,
  getRelatedPublishedGuides,
  getPreviousPublishedGuide,
  getNextPublishedGuide,
  getPublishedGuidesForTool
} from './docs-registry';
import { TOOLS_REGISTRY } from './tools-registry';

describe('Central Documentation Data-Access Layer & Integrity', () => {
  it('strictly filters only published === true guides', () => {
    const published = getPublishedGuides();
    expect(published.length).toBeGreaterThan(0);

    for (const guide of published) {
      expect(guide.published).toBe(true);
    }
  });

  it('correctly handles getGuideBySlug for published vs unpublished/nonexistent slugs', () => {
    const validGuide = getGuideBySlug('why-json-parse-fails-syntax-errors');
    expect(validGuide).toBeDefined();
    expect(validGuide?.slug).toBe('why-json-parse-fails-syntax-errors');

    const nonexistent = getGuideBySlug('nonexistent-slug-xyz');
    expect(nonexistent).toBeUndefined();
  });

  it('excludes empty domains in getPublishedNavigation()', () => {
    const nav = getPublishedNavigation();
    expect(nav.length).toBeGreaterThan(0);

    for (const domain of nav) {
      expect(domain.items.length).toBeGreaterThan(0);
      for (const item of domain.items) {
        const matchingGuide = getGuideBySlug(item.slug);
        expect(matchingGuide).toBeDefined();
        expect(matchingGuide?.published).toBe(true);
      }
    }
  });

  it('filters related guides to only include published guides excluding the current guide', () => {
    const guide = getGuideBySlug('why-json-parse-fails-syntax-errors');
    expect(guide).toBeDefined();

    if (guide) {
      const related = getRelatedPublishedGuides(guide);
      for (const r of related) {
        expect(r.published).toBe(true);
        expect(r.slug).not.toBe(guide.slug);
      }
    }
  });

  it('calculates previous and next navigation strictly within same category', () => {
    const guide = getGuideBySlug('why-json-parse-fails-syntax-errors');
    expect(guide).toBeDefined();

    if (guide) {
      const prev = getPreviousPublishedGuide(guide);
      const next = getNextPublishedGuide(guide);

      if (prev) {
        const prevGuide = getGuideBySlug(prev.slug);
        expect(prevGuide?.category).toBe(guide.category);
      }

      if (next) {
        const nextGuide = getGuideBySlug(next.slug);
        expect(nextGuide?.category).toBe(guide.category);
      }
    }
  });

  it('correctly queries published guides for specific tool IDs', () => {
    const jsonValidatorGuides = getPublishedGuidesForTool('json-validator');
    expect(jsonValidatorGuides.length).toBeGreaterThan(0);
    for (const g of jsonValidatorGuides) {
      expect(g.published).toBe(true);
      const matches = g.primaryToolId === 'json-validator' || (g.relatedToolIds && g.relatedToolIds.includes('json-validator'));
      expect(matches).toBe(true);
    }
  });

  it('ensures all tool references in published guides exist in TOOLS_REGISTRY', () => {
    const published = getPublishedGuides();
    const validToolIds = new Set(TOOLS_REGISTRY.map((t) => t.id));

    for (const guide of published) {
      if (guide.primaryToolId) {
        expect(validToolIds.has(guide.primaryToolId)).toBe(true);
      }
      if (guide.relatedToolIds) {
        for (const toolId of guide.relatedToolIds) {
          expect(validToolIds.has(toolId)).toBe(true);
        }
      }
    }
  });
});
