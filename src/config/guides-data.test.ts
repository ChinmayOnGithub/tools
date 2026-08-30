import { describe, it, expect } from 'vitest';
import { GUIDES_ARTICLES, WORKFLOWS_DATA } from './guides-data';
import { TOOLS_REGISTRY } from './tools-registry';

describe('Problem Guides Data Integrity', () => {
  it('contains exactly 23 high-quality problem guides across 5 clusters', () => {
    expect(GUIDES_ARTICLES.length).toBe(23);

    const jsonGuides = GUIDES_ARTICLES.filter((g) => g.cluster === 'json');
    const jwtGuides = GUIDES_ARTICLES.filter((g) => g.cluster === 'jwt');
    const unicodeGuides = GUIDES_ARTICLES.filter((g) => g.cluster === 'unicode');
    const timestampGuides = GUIDES_ARTICLES.filter((g) => g.cluster === 'timestamp');
    const pdfGuides = GUIDES_ARTICLES.filter((g) => g.cluster === 'pdf');

    expect(jsonGuides.length).toBe(5);
    expect(jwtGuides.length).toBe(5);
    expect(unicodeGuides.length).toBe(5);
    expect(timestampGuides.length).toBe(4);
    expect(pdfGuides.length).toBe(4);
  });

  it('ensures every guide has unique slugs, non-empty problem statements, and valid primary tools', () => {
    const slugs = new Set<string>();
    const validToolIds = new Set(TOOLS_REGISTRY.map((t) => t.id));

    for (const guide of GUIDES_ARTICLES) {
      expect(slugs.has(guide.slug)).toBe(false);
      slugs.add(guide.slug);

      expect(guide.title.length).toBeGreaterThan(15);
      expect(guide.shortDescription.length).toBeGreaterThan(30);
      expect(guide.problemStatement.length).toBeGreaterThan(30);
      expect(guide.shortAnswer.length).toBeGreaterThan(30);
      expect(guide.technicalReason.length).toBeGreaterThan(50);
      expect(guide.commonMistakes.length).toBeGreaterThanOrEqual(1);
      expect(guide.references.length).toBeGreaterThanOrEqual(1);

      // Verify primary tool exists in TOOLS_REGISTRY
      expect(validToolIds.has(guide.primaryToolId)).toBe(true);

      // Verify all related tools exist in TOOLS_REGISTRY
      for (const relatedId of guide.relatedToolIds) {
        expect(validToolIds.has(relatedId)).toBe(true);
      }
    }
  });

  it('contains 4 structured workflow pipelines with valid tool steps', () => {
    expect(WORKFLOWS_DATA.length).toBe(4);
    const validToolIds = new Set(TOOLS_REGISTRY.map((t) => t.id));

    for (const wf of WORKFLOWS_DATA) {
      expect(wf.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of wf.steps) {
        expect(validToolIds.has(step.toolId)).toBe(true);
        expect(step.tips.length).toBeGreaterThan(10);
      }
    }
  });
});
