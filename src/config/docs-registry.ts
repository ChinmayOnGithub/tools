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
// CENTRAL SOURCE OF TRUTH: GUIDES_REGISTRY (JSON & JWT CLUSTERS)
// ──────────────────────────────────────────────────────────────────────────
export const GUIDES_REGISTRY: GuideArticle[] = [
  // ────────────────────────────────────────────────────────────────────────
  // CLUSTER 1: JSON KNOWLEDGE CLUSTER (6 Guides)
  // ────────────────────────────────────────────────────────────────────────
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
    relatedGuides: ['json-trailing-commas', 'json-vs-javascript-objects', 'json-escaping-explained', 'debug-malformed-api-json', 'json-parse-error-messages'],
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
  {
    id: 'json-trailing-commas',
    slug: 'json-trailing-commas',
    title: 'JSON Trailing Commas: Why They Fail and How to Fix Them',
    shortDescription: 'Understand why trailing commas break RFC 8259 JSON parsers despite being valid in JavaScript ES2017+ objects.',
    category: 'json',
    categoryTitle: 'JSON & Data',
    type: 'guide',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
    introduction: 'In modern JavaScript, adding a trailing comma to the last key in an object literal is standard practice. However, putting a trailing comma into a JSON file or API response causes an immediate SyntaxError: Unexpected token } in JSON.',
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter'],
    relatedGuides: ['why-json-parse-fails-syntax-errors', 'json-vs-javascript-objects', 'debug-malformed-api-json'],
    sections: [
      {
        type: 'callout',
        variant: 'important',
        title: 'The Short Answer',
        content: 'IETF RFC 8259 defines a comma purely as a value separator. When a comma appears after an array element or object member, the grammar requires another value to follow. A dangling comma preceding } or ] violates the production rule and throws an unrecoverable syntax error.',
      },
      {
        type: 'heading',
        id: 'the-grammar-difference',
        level: 2,
        text: 'The RFC 8259 Grammar Rule',
      },
      {
        type: 'paragraph',
        content: 'In formal BNF grammar, a JSON object is defined as: object = begin-object [ member *( value-separator member ) ] end-object. Notice the value-separator (comma) must always be followed by a valid member. It cannot precede end-object directly.',
      },
      {
        type: 'comparison',
        invalidTitle: 'Invalid (Array with trailing comma)',
        invalidCode: '[\n  "apple",\n  "banana",\n  "cherry",\n]',
        validTitle: 'Valid JSON Array',
        validCode: '[\n  "apple",\n  "banana",\n  "cherry"\n]',
        language: 'json',
      },
      {
        type: 'tryTool',
        toolId: 'json-validator',
        actionText: 'Validate Trailing Comma Sample',
        sampleInput: '{\n  "status": 200,\n  "records": [1, 2, 3,],\n}',
        explanation: 'Check where the dangling comma breaks array iteration.',
      },
      {
        type: 'heading',
        id: 'why-does-javascript-allow-it',
        level: 2,
        text: 'Why Does JavaScript Allow It?',
      },
      {
        type: 'paragraph',
        content: 'ECMAScript 5 allowed trailing commas in object literals, and ES2017 extended this to function parameter lists. This was done intentionally to minimize multi-line git diff noise when adding new items to the bottom of lists. Because JSON was standardized earlier in RFC 4627 (2006) to be multi-language compatible across C++, Python, and Java, it never adopted this JS-specific leniency.',
      },
      {
        type: 'heading',
        id: 'related-tools',
        level: 2,
        text: 'Validate & Clean Trailing Commas',
      },
      {
        type: 'relatedTools',
        toolIds: ['json-validator', 'json-formatter'],
      },
    ],
  },
  {
    id: 'json-vs-javascript-objects',
    slug: 'json-vs-javascript-objects',
    title: 'JSON vs JavaScript Objects: Complete Feature Matrix',
    shortDescription: 'A technical reference comparing syntax, memory models, allowed data types, and serialization rules between JSON and JavaScript object literals.',
    category: 'json',
    categoryTitle: 'JSON & Data',
    type: 'reference',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
    introduction: 'While JSON was originally derived from JavaScript object literal syntax, JSON is a serialized text interchange specification with strict rules. This reference maps all syntax and runtime differences.',
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter'],
    relatedGuides: ['why-json-parse-fails-syntax-errors', 'json-trailing-commas', 'json-escaping-explained'],
    sections: [
      {
        type: 'callout',
        variant: 'info',
        title: 'Core Distinction',
        content: 'A JavaScript object is an in-memory runtime data structure that can hold functions, circular references, Symbols, and prototype chains. JSON is a flat, UTF-8 string encoding restricted to six fundamental data types.',
      },
      {
        type: 'heading',
        id: 'comparison-matrix',
        level: 2,
        text: 'Detailed Syntax & Feature Matrix',
      },
      {
        type: 'table',
        headers: ['Feature', 'JSON (RFC 8259)', 'JavaScript Object Literal'],
        rows: [
          ['Format Nature', 'Serialized Text String', 'In-Memory Heap Object'],
          ['Key Quotes', 'Double quotes mandatory ("id")', 'Optional for valid identifiers (id)'],
          ['String Literals', 'Double quotes only ("val")', 'Single (\'), double ("), or backticks (`)'],
          ['Trailing Commas', 'Forbidden (SyntaxError)', 'Allowed in arrays and objects'],
          ['Comments', 'Forbidden (// or /* */)', 'Allowed anywhere in source code'],
          ['Functions & Methods', 'Not supported (omitted by stringify)', 'Fully supported'],
          ['undefined', 'Not supported (omitted from objects)', 'Fully supported'],
          ['NaN and Infinity', 'Not supported (converted to null)', 'Supported as numeric values'],
          ['Symbols', 'Not supported (omitted from keys)', 'Supported as keys and values'],
          ['Date Objects', 'Serialized to ISO 8601 string', 'Supported as Date instances'],
        ],
        caption: 'Table: Full structural comparison between JSON and JavaScript objects.',
      },
      {
        type: 'heading',
        id: 'serialization-quirks',
        level: 2,
        text: 'JSON.stringify() Transformation Quirks',
      },
      {
        type: 'paragraph',
        content: 'When converting a JS object to JSON via JSON.stringify(), several JavaScript data types are transformed silently:\n• undefined, Function, and Symbol values inside objects are completely omitted.\n• undefined, Function, and Symbol values inside arrays are converted to null.\n• NaN and Infinity numbers are converted to null.\n• Objects with toJSON() methods (like Date) use the return value of that method.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Serialization Quirks Example',
        code: 'const data = {\n  fn: () => "hello",\n  missing: undefined,\n  list: [undefined, NaN, () => {}],\n  time: new Date("2026-08-30T00:00:00Z")\n};\n\nconsole.log(JSON.stringify(data));\n// {"list":[null,null,null],"time":"2026-08-30T00:00:00.000Z"}',
      },
      {
        type: 'tryTool',
        toolId: 'json-formatter',
        actionText: 'Test Formatter Serialization',
        sampleInput: '{\n  "title": "Config",\n  "active": true,\n  "count": 42\n}',
        explanation: 'Format and inspect clean JSON structures in browser memory.',
      },
    ],
  },
  {
    id: 'json-escaping-explained',
    slug: 'json-escaping-explained',
    title: 'JSON Escaping Explained: Quotes, Backslashes & Unicode Escapes',
    shortDescription: 'Master RFC 8259 escape sequence rules for double quotes, control characters, Windows file paths, and Unicode code points in JSON.',
    category: 'json',
    categoryTitle: 'JSON & Data',
    type: 'guide',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
    introduction: 'In JSON strings, certain characters have syntactic meaning or cannot be represented directly as raw bytes. RFC 8259 defines explicit two-character escape sequences prefixed by backslash (\\).',
    primaryToolId: 'json-validator',
    relatedToolIds: ['unicode-inspector'],
    relatedGuides: ['why-json-parse-fails-syntax-errors', 'debug-malformed-api-json'],
    sections: [
      {
        type: 'callout',
        variant: 'important',
        title: 'Allowed Escape Sequences in RFC 8259',
        content: 'Only eight escape sequences are valid in JSON: \\" (quote), \\\\ (backslash), \\/ (slash), \\b (backspace), \\f (formfeed), \\n (newline), \\r (carriage return), \\t (tab), and \\uXXXX (hex Unicode). Any other sequence like \\a or \\e causes a syntax error.',
      },
      {
        type: 'heading',
        id: 'windows-paths',
        level: 2,
        text: 'The Windows File Path Bug',
      },
      {
        type: 'paragraph',
        content: 'Writing file paths using single backslashes like "C:\\Users\\admin" will crash the parser. Because \\U is not a valid escape sequence, JSON.parse() halts. Every backslash must be doubled as "\\\\".',
      },
      {
        type: 'comparison',
        invalidTitle: 'Invalid (Unescaped backslashes)',
        invalidCode: '{\n  "directory": "C:\\Program Files\\Tools"\n}',
        validTitle: 'Valid JSON (Double backslash)',
        validCode: '{\n  "directory": "C:\\\\Program Files\\\\Tools"\n}',
        language: 'json',
      },
      {
        type: 'heading',
        id: 'unicode-escapes',
        level: 2,
        text: 'Unicode Hex Escapes (\\uXXXX)',
      },
      {
        type: 'paragraph',
        content: 'Characters outside ASCII can be written either directly as UTF-8 characters or as 4-digit hexadecimal code units: \\u00A9 for ©. Characters beyond the Basic Multilingual Plane (like emojis 🚀 U+1F680) require surrogate pairs in JSON: "\\uD83D\\uDE80".',
      },
      {
        type: 'tryTool',
        toolId: 'unicode-inspector',
        actionText: 'Inspect Character Code Points',
        sampleInput: 'Hello \\uD83D\\uDE80 World',
        explanation: 'Inspect code points, surrogate pairs, and UTF-8 byte lengths in Unicode Inspector.',
      },
    ],
  },
  {
    id: 'debug-malformed-api-json',
    slug: 'debug-malformed-api-json',
    title: 'How to Debug Malformed API JSON: Step-by-Step Workflow',
    shortDescription: 'A systematic 5-step developer workflow for isolating, diagnosing, and fixing broken JSON payloads from third-party REST APIs and microservices.',
    category: 'json',
    categoryTitle: 'JSON & Data',
    type: 'workflow',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
    introduction: 'When building client-side apps, API requests often fail with cryptic "Unexpected token < in JSON at position 0" or unexpected character errors. Follow this step-by-step workflow to diagnose the failure without guessing.',
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter', 'unicode-inspector'],
    relatedGuides: ['why-json-parse-fails-syntax-errors', 'json-parse-error-messages'],
    sections: [
      {
        type: 'steps',
        title: 'API JSON Debugging Workflow',
        steps: [
          {
            stepNumber: 1,
            title: 'Verify Content-Type & Catch HTML Error Pages',
            description: 'The most common JSON error ("Unexpected token < at position 0") occurs when the API returns an HTML 404/500 error page starting with <!DOCTYPE html>. Log the raw HTTP status and response.text() first.',
            tips: 'Always check if response.ok is true before invoking response.json().',
          },
          {
            stepNumber: 2,
            title: 'Isolate the Raw Text Stream in JSON Validator',
            description: 'Paste the raw response body into the client-side JSON Validator. The AST parser will point to the exact row and column of the syntax violation.',
            toolId: 'json-validator',
            tips: 'Look for unquoted strings or trailing commas at the end of lists.',
          },
          {
            stepNumber: 3,
            title: 'Scan for Zero-Width Spaces & Invisible BOMs',
            description: 'If the JSON looks visually correct in your editor but JSON.parse() throws an unexpected token at position 0, test for a UTF-8 Byte Order Mark (\\uFEFF) or zero-width spaces.',
            toolId: 'unicode-inspector',
            tips: 'Inspect byte representations to find hidden Unicode characters.',
          },
          {
            stepNumber: 4,
            title: 'Reformat with JSON Formatter',
            description: 'Format the corrected payload into clean 2-space indented structure to inspect nested fields and verify AST validity.',
            toolId: 'json-formatter',
          },
        ],
      },
      {
        type: 'tryTool',
        toolId: 'json-validator',
        actionText: 'Launch JSON Validator',
        sampleInput: '<!DOCTYPE html>\n<html><body>502 Bad Gateway</body></html>',
        explanation: 'Test raw HTML error response strings in JSON Validator.',
      },
    ],
  },
  {
    id: 'json-parse-error-messages',
    slug: 'json-parse-error-messages',
    title: 'JSON.parse() Error Messages: Causes, Examples & Fixes',
    shortDescription: 'Lookup dictionary for browser JSON parser error messages, explaining the exact root cause and verified fix for each error.',
    category: 'json',
    categoryTitle: 'JSON & Data',
    type: 'reference',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
    introduction: 'Modern browsers provide descriptive error messages when JSON.parse() fails. This reference table translates common error strings into clear root causes and solutions.',
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter'],
    relatedGuides: ['why-json-parse-fails-syntax-errors', 'debug-malformed-api-json'],
    sections: [
      {
        type: 'heading',
        id: 'error-lookup-table',
        level: 2,
        text: 'Parser Error Lookup Table',
      },
      {
        type: 'table',
        headers: ['Error Message', 'Typical Cause', 'Verified Solution'],
        rows: [
          ['Unexpected token < in JSON at position 0', 'Server returned HTML error page instead of JSON', 'Check API status code; inspect if response is HTML error'],
          ['Unexpected token } in JSON at position X', 'Dangling trailing comma before closing brace', 'Remove trailing comma from the last property'],
          ['Unexpected token \' in JSON at position X', 'Single quotes used instead of double quotes', 'Replace single quotes with double quotes around keys/values'],
          ['Unexpected number in JSON at position X', 'Missing comma between object properties', 'Add comma separator between key-value pairs'],
          ['Bad escaped character in JSON at position X', 'Invalid backslash escape (e.g. Windows path \\U)', 'Double-escape backslashes as \\\\'],
          ['Unexpected end of JSON input', 'Empty string or truncated/incomplete response stream', 'Verify payload was received in full; check network buffer'],
        ],
        caption: 'Table: Common JavaScript JSON.parse() exceptions and their direct fixes.',
      },
      {
        type: 'tryTool',
        toolId: 'json-validator',
        actionText: 'Open JSON Validator',
        sampleInput: '{\n  "error": \'unauthorized\'\n}',
        explanation: 'Check single-quote errors and identify unexpected tokens.',
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // CLUSTER 2: JWT & AUTHENTICATION CLUSTER (5 Guides)
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'jwt-decoding-vs-verification',
    slug: 'jwt-decoding-vs-verification',
    title: 'JWT Decoding vs Verification: What is the Difference?',
    shortDescription: 'Understand the critical security difference between decoding Base64URL JWT payloads client-side and verifying cryptographic signatures.',
    category: 'jwt',
    categoryTitle: 'JWT & Authentication',
    type: 'guide',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
    introduction: 'JSON Web Tokens (RFC 7519) are widely used for stateless authentication. However, developers frequently confuse client-side decoding with cryptographic verification, creating severe security vulnerabilities.',
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['base64-converter', 'timestamp-explorer'],
    relatedGuides: ['how-jwt-expiration-works-exp-iat-nbf', 'how-to-debug-expired-jwt', 'base64-vs-base64url-jwt', 'how-to-read-jwt-claims'],
    sections: [
      {
        type: 'callout',
        variant: 'security',
        title: 'Security Note',
        content: 'Decoding a JWT only decodes Base64URL text into readable JSON. It does NOT prove the token was issued by a trusted server, nor does it guarantee the payload has not been tampered with. Only cryptographic signature verification proves authenticity.',
      },
      {
        type: 'heading',
        id: 'the-three-parts-of-a-jwt',
        level: 2,
        text: 'The Structure of a JWT',
      },
      {
        type: 'paragraph',
        content: 'A JWT is composed of three Base64URL-encoded strings separated by periods (header.payload.signature):\n1. Header: Specifies the signing algorithm (e.g. RS256, HS256) and token type.\n2. Payload: Contains claims (e.g. user ID, role, expiration timestamp).\n3. Signature: Cryptographic hash created by the server using its private key or secret.',
      },
      {
        type: 'comparison',
        invalidTitle: 'Raw Encoded JWT (Base64URL)',
        invalidCode: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        validTitle: 'Decoded Payload Claims',
        validCode: '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
        explanation: 'Decoding converts Base64URL into JSON without validating cryptographic signatures.',
        language: 'json',
      },
      {
        type: 'tryTool',
        toolId: 'jwt-decoder',
        actionText: 'Decode Synthetic JWT',
        sampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        explanation: 'Inspect claims, header parameters, and expiration timestamps in JWT Decoder.',
      },
      {
        type: 'heading',
        id: 'references',
        level: 2,
        text: 'Standards & References',
      },
      {
        type: 'references',
        items: [
          { title: 'IETF RFC 7519: JSON Web Token (JWT)', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
          { title: 'IETF RFC 7515: JSON Web Signature (JWS)', url: 'https://datatracker.ietf.org/doc/html/rfc7515' },
        ],
      },
    ],
  },
  {
    id: 'how-jwt-expiration-works-exp-iat-nbf',
    slug: 'how-jwt-expiration-works-exp-iat-nbf',
    title: 'How JWT Expiration Works: Understanding exp, iat, and nbf',
    shortDescription: 'Technical reference explaining standard RFC 7519 time-based claims: Expiration Time (exp), Issued At (iat), and Not Before (nbf).',
    category: 'jwt',
    categoryTitle: 'JWT & Authentication',
    type: 'reference',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
    introduction: 'JWT tokens rely on Unix Epoch timestamps (in seconds) to manage session validity without maintaining database session lookups. This reference details how time-based claims interact.',
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['timestamp-explorer'],
    relatedGuides: ['jwt-decoding-vs-verification', 'how-to-debug-expired-jwt', 'how-to-read-jwt-claims'],
    sections: [
      {
        type: 'callout',
        variant: 'info',
        title: 'Epoch Seconds Standard',
        content: 'Per RFC 7519 Section 2, all time-based JWT claims (exp, iat, nbf) MUST be formatted as NumericDate: standard Unix epoch timestamps in SECONDS (10 digits), NOT JavaScript milliseconds (13 digits).',
      },
      {
        type: 'table',
        headers: ['Claim', 'Name', 'RFC Meaning', 'Validation Rule'],
        rows: [
          ['exp', 'Expiration Time', 'Time on or after which the token must not be accepted', 'Reject if CurrentTime >= exp'],
          ['iat', 'Issued At', 'Time at which the JWT was generated', 'Must not be in the future (subject to clock skew)'],
          ['nbf', 'Not Before', 'Time before which the JWT must not be accepted', 'Reject if CurrentTime < nbf'],
        ],
        caption: 'Table: Standard RFC 7519 time-based claims.',
      },
      {
        type: 'tryTool',
        toolId: 'timestamp-explorer',
        actionText: 'Convert JWT Epoch Timestamps',
        sampleInput: '1788134400',
        explanation: 'Convert 10-digit JWT Unix timestamps into UTC and local date formats.',
      },
    ],
  },
  {
    id: 'how-to-debug-expired-jwt',
    slug: 'how-to-debug-expired-jwt',
    title: 'How to Debug an Expired JWT Token Step-by-Step',
    shortDescription: 'A practical workflow for identifying token expiration errors, clock skew discrepancies, and refresh token lifecycle failures.',
    category: 'jwt',
    categoryTitle: 'JWT & Authentication',
    type: 'workflow',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
    introduction: 'When API requests return 401 Unauthorized with token_expired, follow this sequential debugging workflow to identify whether the issue is true expiration, clock skew, or timezone offset bugs.',
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['timestamp-explorer'],
    relatedGuides: ['jwt-decoding-vs-verification', 'how-jwt-expiration-works-exp-iat-nbf'],
    sections: [
      {
        type: 'steps',
        title: 'Step-by-Step JWT Expiration Debugging',
        steps: [
          {
            stepNumber: 1,
            title: 'Decode JWT Payload Claims',
            description: 'Paste the authorization token into JWT Decoder to inspect the raw exp and iat claim values.',
            toolId: 'jwt-decoder',
            tips: 'Verify the token has a valid 3-part structure separated by periods.',
          },
          {
            stepNumber: 2,
            title: 'Convert exp Claim to Human-Readable Time',
            description: 'Input the 10-digit exp number into Timestamp Explorer to determine the exact UTC expiration timestamp.',
            toolId: 'timestamp-explorer',
            tips: 'Ensure the server issued seconds (e.g. 1756543200) rather than JS milliseconds (1756543200000).',
          },
          {
            stepNumber: 3,
            title: 'Check for Server Clock Skew',
            description: 'Compare current server UTC time with the client machine. If servers differ by more than a few seconds, configure a 30-60 second clockTolerance in your verification library.',
            tips: 'Most JWT libraries support clockTolerance / leeway options.',
          },
        ],
      },
      {
        type: 'tryTool',
        toolId: 'jwt-decoder',
        actionText: 'Inspect Token in JWT Decoder',
        sampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImV4cCI6MTc1NjU0MzIwMCwiaWF0IjoxNzU2NTM5NjAwfQ.abc',
        explanation: 'Inspect expiration status and remaining lifetime in JWT Decoder.',
      },
    ],
  },
  {
    id: 'base64-vs-base64url-jwt',
    slug: 'base64-vs-base64url-jwt',
    title: 'Base64 vs Base64URL: What JWT Actually Uses',
    shortDescription: 'Learn why standard Base64 breaks HTTP headers and URLs, and how Base64URL encoding (RFC 4648 §5) solves this in JWTs.',
    category: 'jwt',
    categoryTitle: 'JWT & Authentication',
    type: 'reference',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
    introduction: 'Standard Base64 encoding includes plus (+), slash (/), and equals (=) characters that require special URL-encoding when placed in query parameters or HTTP Authorization headers. RFC 7519 specifies Base64URL to avoid this.',
    primaryToolId: 'base64-converter',
    relatedToolIds: ['jwt-decoder'],
    relatedGuides: ['jwt-decoding-vs-verification', 'how-to-read-jwt-claims'],
    sections: [
      {
        type: 'table',
        headers: ['Character / Feature', 'Standard Base64 (RFC 4648 §4)', 'Base64URL (RFC 4648 §5)'],
        rows: [
          ['Value 62', '+ (plus)', '- (minus)'],
          ['Value 63', '/ (slash)', '_ (underscore)'],
          ['Padding (=)', 'Mandatory (1 or 2 "=" characters)', 'Omitted (no padding in JWTs)'],
          ['URL Safety', 'Requires URL encoding (%2B, %2F)', 'Native URL and header safe'],
        ],
        caption: 'Table: Character substitution matrix between Base64 and Base64URL.',
      },
      {
        type: 'tryTool',
        toolId: 'base64-converter',
        actionText: 'Convert Base64 Strings',
        sampleInput: 'Hello World? + / =',
        explanation: 'Encode and decode standard Base64 strings in Base64 Converter.',
      },
    ],
  },
  {
    id: 'how-to-read-jwt-claims',
    slug: 'how-to-read-jwt-claims',
    title: 'How to Read and Interpret Standard JWT Claims',
    shortDescription: 'Complete reference dictionary for IANA registered JWT claims (sub, iss, aud, exp, iat, nbf, jti) and custom private claims.',
    category: 'jwt',
    categoryTitle: 'JWT & Authentication',
    type: 'reference',
    published: true,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
    introduction: 'The JWT payload contains statements about an entity (typically the user) and additional metadata. RFC 7519 establishes seven registered claim names to promote interoperability.',
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['timestamp-explorer'],
    relatedGuides: ['jwt-decoding-vs-verification', 'how-jwt-expiration-works-exp-iat-nbf'],
    sections: [
      {
        type: 'table',
        headers: ['Claim', 'Full Name', 'Description & Usage'],
        rows: [
          ['iss', 'Issuer', 'Identifies the principal that issued the JWT (e.g. "https://auth.example.com")'],
          ['sub', 'Subject', 'Identifies the principal subject of the token (e.g. user UUID)'],
          ['aud', 'Audience', 'Identifies the recipients the JWT is intended for (e.g. "api.example.com")'],
          ['exp', 'Expiration', 'Unix epoch timestamp (seconds) on or after which the token is invalid'],
          ['nbf', 'Not Before', 'Unix epoch timestamp (seconds) before which the token is invalid'],
          ['iat', 'Issued At', 'Unix epoch timestamp (seconds) when the token was created'],
          ['jti', 'JWT ID', 'Unique identifier for the JWT, used to prevent token replay attacks'],
        ],
        caption: 'Table: RFC 7519 IANA Registered Claims.',
      },
      {
        type: 'tryTool',
        toolId: 'jwt-decoder',
        actionText: 'Read Claims in JWT Decoder',
        sampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLmNvb2x0b29scy5kZXYiLCJzdWIiOiJ1c2VyXzk4NzYiLCJhdWQiOiJhcGkuY29vbHRvb2xzLmRldiIsImV4cCI6MTc4ODEzNDQwMCwiaWF0IjoxNzU2NTM5NjAwLCJqdGkiOiJjN2Q5MDdlIn0.abc',
        explanation: 'Inspect registered and custom payload claims in JWT Decoder.',
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
