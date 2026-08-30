import { describe, it, expect } from 'vitest';
import { GUIDES_REGISTRY, GUIDE_DOMAINS } from './docs-registry';
import { TOOLS_REGISTRY } from './tools-registry';

describe('Developer Documentation & Registry Integrity', () => {
  it('contains correctly formatted guide domains for sidebar navigation', () => {
    expect(GUIDE_DOMAINS.length).toBeGreaterThanOrEqual(5);

    for (const domain of GUIDE_DOMAINS) {
      expect(domain.id.length).toBeGreaterThan(1);
      expect(domain.title.length).toBeGreaterThan(2);
      expect(domain.description.length).toBeGreaterThan(10);
      expect(domain.items.length).toBeGreaterThan(0);

      for (const item of domain.items) {
        expect(item.title.length).toBeGreaterThan(3);
        expect(item.slug.length).toBeGreaterThan(3);
        expect(['guide', 'reference', 'workflow']).toContain(item.type);
      }
    }
  });

  it('validates migrated flagship JSON guide section structure', () => {
    const jsonGuide = GUIDES_REGISTRY.find((g) => g.slug === 'why-json-parse-fails-syntax-errors');
    expect(jsonGuide).toBeDefined();

    if (jsonGuide) {
      expect(jsonGuide.published).toBe(true);
      expect(jsonGuide.type).toBe('guide');
      expect(jsonGuide.category).toBe('json');
      expect(jsonGuide.sections.length).toBeGreaterThanOrEqual(10);

      // Verify headings have explicit unique IDs for TOC generation
      const headingSections = jsonGuide.sections.filter((s) => s.type === 'heading');
      expect(headingSections.length).toBeGreaterThanOrEqual(5);

      const headingIds = new Set<string>();
      headingSections.forEach((h) => {
        if (h.type === 'heading') {
          expect(h.id).toBeDefined();
          expect(headingIds.has(h.id)).toBe(false);
          headingIds.add(h.id);
        }
      });

      // Verify primary tool exists in registry
      const validToolIds = new Set(TOOLS_REGISTRY.map((t) => t.id));
      if (jsonGuide.primaryToolId) {
        expect(validToolIds.has(jsonGuide.primaryToolId)).toBe(true);
      }
    }
  });
});
