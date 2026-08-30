export type GuideType = 'guide' | 'reference' | 'workflow';

export interface GuideReference {
  title: string;
  url: string;
}

export interface TableRow {
  [key: string]: string;
}

export type GuideSection =
  | {
      type: 'paragraph';
      id?: string;
      content: string;
    }
  | {
      type: 'heading';
      id: string;
      level: 2 | 3;
      text: string;
    }
  | {
      type: 'callout';
      id?: string;
      variant: 'info' | 'warning' | 'tip' | 'security' | 'important';
      title?: string;
      content: string;
    }
  | {
      type: 'code';
      id?: string;
      language: string;
      code: string;
      title?: string;
    }
  | {
      type: 'comparison';
      id?: string;
      invalidTitle?: string;
      invalidCode?: string;
      validTitle?: string;
      validCode: string;
      explanation?: string;
      language?: string;
    }
  | {
      type: 'table';
      id?: string;
      headers: string[];
      rows: string[][];
      caption?: string;
    }
  | {
      type: 'steps';
      id?: string;
      title?: string;
      steps: Array<{
        stepNumber: number;
        title: string;
        description: string;
        toolId?: string;
        tips?: string;
      }>;
    }
  | {
      type: 'tryTool';
      id?: string;
      toolId: string;
      actionText?: string;
      explanation?: string;
      sampleInput?: string;
    }
  | {
      type: 'relatedTools';
      id?: string;
      toolIds: string[];
    }
  | {
      type: 'relatedGuides';
      id?: string;
      guideSlugs: string[];
    }
  | {
      type: 'references';
      id?: string;
      items: GuideReference[];
    };

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: 'json' | 'jwt' | 'unicode' | 'timestamp' | 'pdf' | 'api';
  categoryTitle: string;
  type: GuideType;
  published: boolean;
  updatedAt: string;
  readTime: string;

  introduction?: string;
  sections: GuideSection[];

  primaryToolId?: string;
  relatedToolIds?: string[];
  relatedGuides?: string[];
  prevGuide?: { title: string; slug: string };
  nextGuide?: { title: string; slug: string };
}

export interface GuideDomainMeta {
  id: string;
  title: string;
  description: string;
}

export const GUIDE_DOMAINS_META: GuideDomainMeta[] = [
  {
    id: 'json',
    title: 'JSON & Data',
    description: 'Understand, validate, format, and debug structured JSON data.',
  },
  {
    id: 'jwt',
    title: 'JWT & Authentication',
    description: 'Inspect tokens, decode claims, and troubleshoot expiration issues.',
  },
  {
    id: 'unicode',
    title: 'Unicode & Text',
    description: 'Find invisible characters, detect homoglyphs, and debug encoding issues.',
  },
  {
    id: 'timestamp',
    title: 'Time & APIs',
    description: 'Work with Unix timestamps, ISO 8601 strings, and timezone conversions.',
  },
  {
    id: 'pdf',
    title: 'PDF & Files',
    description: 'Solve document compression, merging, splitting, and conversion tasks locally.',
  },
];

// ──────────────────────────────────────────────────────────────────────────
// CENTRAL SOURCE OF TRUTH: GUIDES_REGISTRY
// ──────────────────────────────────────────────────────────────────────────
export const GUIDES_REGISTRY: GuideArticle[] = [
  {
    id: 'why-json-parse-fails-syntax-errors',
    slug: 'why-json-parse-fails-syntax-errors',
    title: 'Why JSON.parse() Fails: Common JSON Syntax Errors',
    shortDescription: 'A practical, technical guide to identifying, understanding, and resolving JSON.parse() SyntaxError exceptions in JavaScript.',
    category: 'json',
    categoryTitle: 'JSON & Data',
    type: 'guide',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
    introduction: 'When building web applications and backend APIs, passing dynamic string data into JSON.parse() is a frequent source of runtime crashes. This guide details the exact RFC 8259 syntax specifications, why parsers throw unexpected token errors, and how to debug and repair malformed JSON payloads client-side.',
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter', 'unicode-inspector'],
    relatedGuides: ['json-trailing-commas', 'json-vs-javascript-objects', 'json-escaping-explained'],
    prevGuide: undefined,
    nextGuide: undefined,
    sections: [
      {
        type: 'callout',
        variant: 'important',
        title: 'The Short Answer',
        content: 'JSON syntax is governed by strict IETF RFC 8259 specifications. Unlike JavaScript object literals, JSON mandates double quotes (") for all keys and strings, strictly forbids trailing commas after the last item, disallows comments, and requires standard escaping for control characters. If any of these rules are violated, the browser parser halts immediately.',
      },
      {
        type: 'heading',
        id: 'why-json-parse-fails',
        level: 2,
        text: 'Why JSON.parse() Fails',
      },
      {
        type: 'paragraph',
        content: 'JSON is an interchangeable, text-based data format designed to be completely language-agnostic across C, Python, Go, Rust, Java, and JavaScript. To prevent ambiguous parsing across different runtime environments, the parser operates as a strict deterministic state machine. If an unexpected token (such as a single quote or an unescaped control character) is encountered, JSON.parse() aborts with a SyntaxError.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Deterministic State Machine',
        content: 'The parser does not attempt automatic error correction or guess developer intent. When it reaches an invalid character, it reports the exact byte index position: "SyntaxError: Unexpected token in JSON at position X".',
      },
      {
        type: 'heading',
        id: 'common-syntax-errors',
        level: 2,
        text: 'Common Syntax Errors',
      },
      {
        type: 'heading',
        id: '1-trailing-commas',
        level: 3,
        text: '1. Trailing Commas',
      },
      {
        type: 'paragraph',
        content: 'In modern ECMAScript, trailing commas in objects and arrays are permitted for clean git diffs. However, in RFC 8259 JSON, a comma explicitly signals that another element follows. A trailing comma leaves the parser expecting another value before the closing brace or bracket.',
      },
      {
        type: 'comparison',
        invalidTitle: 'Invalid (Trailing comma)',
        invalidCode: '{\n  "userId": 104,\n  "role": "admin",\n}',
        validTitle: 'Valid JSON (Comma removed)',
        validCode: '{\n  "userId": 104,\n  "role": "admin"\n}',
        explanation: 'Remove the final comma preceding the closing curly brace.',
        language: 'json',
      },
      {
        type: 'tryTool',
        toolId: 'json-validator',
        actionText: 'Test Trailing Comma in Validator',
        sampleInput: '{\n  "name": "Alex",\n  "active": true,\n}',
        explanation: 'Paste malformed JSON into JSON Validator to highlight the exact row and column of the dangling comma.',
      },
      {
        type: 'heading',
        id: '2-single-quotes-and-unquoted-keys',
        level: 3,
        text: '2. Single Quotes and Unquoted Keys',
      },
      {
        type: 'paragraph',
        content: 'RFC 8259 Section 7 requires string literals and property names to be wrapped exclusively in double quotation marks ("). Single quotes (\') and unquoted JavaScript identifiers are invalid.',
      },
      {
        type: 'comparison',
        invalidTitle: 'Invalid (Single quotes & unquoted keys)',
        invalidCode: '{\n  name: \'Alice\',\n  status: \'active\'\n}',
        validTitle: 'Valid JSON (Double quotes)',
        validCode: '{\n  "name": "Alice",\n  "status": "active"\n}',
        language: 'json',
      },
      {
        type: 'heading',
        id: '3-invalid-escape-sequences',
        level: 3,
        text: '3. Invalid Escape Sequences & Windows Paths',
      },
      {
        type: 'paragraph',
        content: 'The backslash (\\) is reserved as an escape prefix. Writing Windows file paths like "C:\\Users\\name" fails because \\U is not a recognized escape sequence. Backslashes must be double-escaped as "\\\\".',
      },
      {
        type: 'comparison',
        invalidTitle: 'Invalid (Single backslash in path)',
        invalidCode: '{\n  "path": "C:\\Users\\admin\\documents"\n}',
        validTitle: 'Valid JSON (Escaped backslashes)',
        validCode: '{\n  "path": "C:\\\\Users\\\\admin\\\\documents"\n}',
        language: 'json',
      },
      {
        type: 'heading',
        id: 'json-vs-javascript-objects',
        level: 2,
        text: 'JSON vs JavaScript Objects: Syntax Matrix',
      },
      {
        type: 'paragraph',
        content: 'The table below details the exact syntax differences between in-memory JavaScript object literals and serialized JSON text payloads:',
      },
      {
        type: 'table',
        headers: ['Feature', 'JSON (RFC 8259)', 'JavaScript Object Literal'],
        rows: [
          ['Key Quotes', 'Double quotes mandatory ("key")', 'Optional for valid identifiers (key)'],
          ['String Quotes', 'Double quotes only ("text")', 'Single (\'), double ("), or backticks (`)'],
          ['Trailing Commas', 'Strictly Forbidden', 'Allowed (ES2017+)'],
          ['Comments', 'Forbidden (// or /* */)', 'Supported (// and /* */)'],
          ['Functions / Methods', 'Not supported (omitted)', 'Supported (greet() {})'],
          ['undefined', 'Not supported (omitted/throws)', 'Supported'],
          ['Date Objects', 'Serialized to ISO 8601 String', 'Supported as Date instances'],
        ],
        caption: 'Table 1: Structural differences between JSON and JavaScript runtime objects.',
      },
      {
        type: 'heading',
        id: 'how-to-debug-a-json-parse-error',
        level: 2,
        text: 'How to Debug a JSON.parse() Error',
      },
      {
        type: 'steps',
        title: 'Step-by-Step Debugging Workflow',
        steps: [
          {
            stepNumber: 1,
            title: 'Isolate the Raw String Payload',
            description: 'Log or extract the exact text string before JSON.parse() execution. Verify the response is not HTML (e.g. 404/500 error page starting with <!DOCTYPE html>).',
            tips: 'A common bug is calling res.json() when the server returned an HTML 502 Bad Gateway page.',
          },
          {
            stepNumber: 2,
            title: 'Inspect in Client-Side JSON Validator',
            description: 'Paste the string into JSON Validator. The validator parses the AST and marks the exact row, column, and character causing the syntax breakdown.',
            toolId: 'json-validator',
            tips: 'Check for trailing commas at the bottom of large nested arrays.',
          },
          {
            stepNumber: 3,
            title: 'Check for Invisible Unicode Characters',
            description: 'If JSON appears visually correct but still crashes, scan for zero-width spaces (U+200B) or byte order marks (U+FEFF).',
            toolId: 'unicode-inspector',
            tips: 'Invisible characters often slip in when copying snippets from rich-text documents.',
          },
          {
            stepNumber: 4,
            title: 'Format and Beautify',
            description: 'Format the corrected payload into clean 2-space indentation with JSON Formatter.',
            toolId: 'json-formatter',
          },
        ],
      },
      {
        type: 'heading',
        id: 'common-mistakes',
        level: 2,
        text: 'Common Mistakes Developers Make',
      },
      {
        type: 'paragraph',
        content: '• Copying console.log output directly into a JSON file without serializing with JSON.stringify().\n• Assuming JSON5 or JSONC settings in VS Code (such as tsconfig.json) apply to HTTP REST APIs.\n• Pasting multi-line template literal strings containing raw unescaped newlines.\n• Attempting to serialize BigInt values without a custom serializer function (throws TypeError: Do not know how to serialize a BigInt).',
      },
      {
        type: 'heading',
        id: 'try-the-tools',
        level: 2,
        text: 'Try Interactive Tools Client-Side',
      },
      {
        type: 'relatedTools',
        toolIds: ['json-validator', 'json-formatter', 'unicode-inspector'],
      },
      {
        type: 'heading',
        id: 'references',
        level: 2,
        text: 'Standards & Authoritative References',
      },
      {
        type: 'references',
        items: [
          { title: 'IETF RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format', url: 'https://datatracker.ietf.org/doc/html/rfc8259' },
          { title: 'ECMA-404: The JSON Data Interchange Syntax Standard', url: 'https://www.ecma-international.org/publications-and-standards/standards/ecma-404/' },
          { title: 'MDN Web Docs: Global JSON Object & JSON.parse()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse' },
        ],
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// CENTRAL DOCUMENTATION DATA-ACCESS LAYER
// ──────────────────────────────────────────────────────────────────────────

/**
 * Returns all published guide articles.
 */
export function getPublishedGuides(): GuideArticle[] {
  return GUIDES_REGISTRY.filter((g) => g.published === true);
}

/**
 * Returns an array of all published guide slugs (used by generateStaticParams, sitemaps).
 */
export function getPublishedGuideSlugs(): string[] {
  return getPublishedGuides().map((g) => g.slug);
}

/**
 * Retrieves a single published guide by its URL slug.
 */
export function getGuideBySlug(slug: string): GuideArticle | undefined {
  const guide = GUIDES_REGISTRY.find((g) => g.slug === slug);
  if (!guide || !guide.published) {
    return undefined;
  }
  return guide;
}

/**
 * Returns published guides filtered by category/domain.
 */
export function getPublishedGuidesByDomain(domainId: string): GuideArticle[] {
  return getPublishedGuides().filter((g) => g.category === domainId);
}

/**
 * Returns active navigation structure containing ONLY domains that have at least one published guide.
 */
export interface PublishedDomainNav {
  id: string;
  title: string;
  description: string;
  items: Array<{
    title: string;
    slug: string;
    type: GuideType;
  }>;
}

export function getPublishedNavigation(): PublishedDomainNav[] {
  const published = getPublishedGuides();
  const nav: PublishedDomainNav[] = [];

  for (const domain of GUIDE_DOMAINS_META) {
    const domainGuides = published.filter((g) => g.category === domain.id);
    if (domainGuides.length > 0) {
      nav.push({
        id: domain.id,
        title: domain.title,
        description: domain.description,
        items: domainGuides.map((g) => ({
          title: g.title,
          slug: g.slug,
          type: g.type,
        })),
      });
    }
  }

  return nav;
}

/**
 * Resolves related guides for a given guide, ensuring all returned entries exist, are published, and exclude self.
 */
export function getRelatedPublishedGuides(guide: GuideArticle): GuideArticle[] {
  const allPublished = getPublishedGuides();
  const result: GuideArticle[] = [];

  if (guide.relatedGuides && guide.relatedGuides.length > 0) {
    for (const slug of guide.relatedGuides) {
      if (slug !== guide.slug) {
        const match = allPublished.find((g) => g.slug === slug);
        if (match && !result.some((r) => r.slug === match.slug)) {
          result.push(match);
        }
      }
    }
  }

  // Fallback: If no explicit related guides are published yet, find other published guides in same domain
  if (result.length === 0) {
    const domainMatches = allPublished.filter((g) => g.category === guide.category && g.slug !== guide.slug);
    result.push(...domainMatches);
  }

  return result;
}

/**
 * Returns the previous published guide within the same category/domain.
 */
export function getPreviousPublishedGuide(currentGuide: GuideArticle): { title: string; slug: string } | undefined {
  const domainGuides = getPublishedGuidesByDomain(currentGuide.category);
  const currentIndex = domainGuides.findIndex((g) => g.slug === currentGuide.slug);
  if (currentIndex > 0) {
    const prev = domainGuides[currentIndex - 1];
    return { title: prev.title, slug: prev.slug };
  }
  return undefined;
}

/**
 * Returns the next published guide within the same category/domain.
 */
export function getNextPublishedGuide(currentGuide: GuideArticle): { title: string; slug: string } | undefined {
  const domainGuides = getPublishedGuidesByDomain(currentGuide.category);
  const currentIndex = domainGuides.findIndex((g) => g.slug === currentGuide.slug);
  if (currentIndex !== -1 && currentIndex < domainGuides.length - 1) {
    const next = domainGuides[currentIndex + 1];
    return { title: next.title, slug: next.slug };
  }
  return undefined;
}

/**
 * Returns published guides relevant to a specific tool (for tool page "Learn more" integrations).
 */
export function getPublishedGuidesForTool(toolId: string): GuideArticle[] {
  return getPublishedGuides().filter(
    (g) => g.primaryToolId === toolId || (g.relatedToolIds && g.relatedToolIds.includes(toolId))
  );
}
