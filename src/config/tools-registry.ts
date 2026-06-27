export interface ToolEntry {
  id: string; // Dynamic URL slug matching the folder name
  name: string; // Human display name
  description: string; // Short UI description
  category: 'pdf' | 'image' | 'developer' | 'text' | 'calculator' | 'converter';
  tags: string[]; // Search tags/aliases
  keywords: string[]; // Meta tags
  icon: 'FileText' | 'Image' | 'Terminal' | 'Hash' | 'Calculator' | 'RefreshCw' | 'Sliders' | 'Code' | 'List' | 'Key' | 'Calendar' | 'Scale';
  seoTitle: string; // SEO page title
  seoDescription: string; // SEO meta description
  relatedTools: string[]; // Related tool IDs for recommendations
  requirements: {
    browser: boolean;
    server: boolean;
  };
  featured?: boolean;
  popular?: boolean;
  addedAt: string; // ISO date string (YYYY-MM-DD)
  status: 'draft' | 'planned' | 'in-development' | 'testing' | 'published' | 'maintenance';
}

export const TOOLS_REGISTRY: ToolEntry[] = [
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate RFC4122 version 4 compliant universally unique identifiers (UUIDs) locally.',
    category: 'developer',
    tags: ['uuid', 'guid', 'generator', 'random', 'unique', 'rfc4122'],
    keywords: ['uuid generator', 'generate uuid', 'guid generator', 'random uuid', 'online uuid'],
    icon: 'Key',
    seoTitle: 'Free Client-Side UUID & GUID Generator',
    seoDescription: 'Generate RFC4122 v4 compliant universally unique identifiers (UUIDs) or GUIDs locally in your browser. Complete data privacy.',
    relatedTools: ['base64-converter', 'json-formatter'],
    requirements: { browser: true, server: false },
    featured: true,
    popular: true,
    addedAt: '2026-06-25',
    status: 'published',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Pretty-print, validate, minify, and check syntax of your JSON code.',
    category: 'developer',
    tags: ['json', 'formatter', 'pretty print', 'minify', 'validator', 'beautify'],
    keywords: ['json formatter', 'pretty print json', 'format json online', 'minify json', 'validate json'],
    icon: 'Code',
    seoTitle: 'Free Client-Side JSON Formatter & Beautifier',
    seoDescription: 'Pretty-print, minify, and validate JSON code securely in your web browser. Zero server uploads for complete data privacy.',
    relatedTools: ['uuid-generator', 'base64-converter'],
    requirements: { browser: true, server: false },
    featured: true,
    popular: true,
    addedAt: '2026-06-01',
    status: 'published',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Analyze word count, character size, read time, and text stats in real-time.',
    category: 'text',
    tags: ['word count', 'character count', 'analyzer', 'text stats', 'casing'],
    keywords: ['word counter', 'character counter', 'word count online', 'character size analyzer'],
    icon: 'List',
    seoTitle: 'Free Online Word Counter - Analyze Text & Character Size',
    seoDescription: 'Count words, characters, sentences, paragraphs, and read times. Secure, in-browser analysis with no data logged.',
    relatedTools: ['uuid-generator'],
    requirements: { browser: true, server: false },
    featured: true,
    addedAt: '2026-06-10',
    status: 'planned',
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder/Decoder',
    description: 'Convert text, strings, and images into Base64 format and back.',
    category: 'developer',
    tags: ['base64', 'encode', 'decode', 'converter', 'string', 'binary'],
    keywords: ['base64 encoder', 'base64 decoder', 'base64 encode online', 'base64 convert string'],
    icon: 'Key',
    seoTitle: 'Free Client-Side Base64 Encoder & Decoder',
    seoDescription: 'Encode and decode Base64 strings and files safely. 100% browser-based calculations protect sensitive tokens.',
    relatedTools: ['uuid-generator', 'json-formatter'],
    requirements: { browser: true, server: false },
    popular: true,
    addedAt: '2026-06-15',
    status: 'published',
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL parameters safely and instantly.',
    category: 'developer',
    tags: ['url', 'encode', 'decode', 'uri', 'parameter', 'percent-encoding'],
    keywords: ['url encoder', 'url decoder', 'urlencode online', 'decode url parameter'],
    icon: 'Code',
    seoTitle: 'Free Client-Side URL Parameter Encoder & Decoder',
    seoDescription: 'Encode and decode URL parameters or URI strings securely in your browser tab. Instant offline client-side conversions.',
    relatedTools: ['json-formatter', 'base64-converter'],
    requirements: { browser: true, server: false },
    addedAt: '2026-06-27',
    status: 'published',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate highly secure custom passwords locally using custom strength rules.',
    category: 'developer',
    tags: ['password', 'generator', 'security', 'random string', 'passphrase'],
    keywords: ['password generator', 'random password', 'generate secure password', 'online password maker'],
    icon: 'Key',
    seoTitle: 'Free Client-Side Secure Password Generator',
    seoDescription: 'Generate secure, randomized passwords locally in your browser. Configure character rules, lengths, and avoid server storage logs.',
    relatedTools: ['uuid-generator', 'base64-converter'],
    requirements: { browser: true, server: false },
    featured: true,
    addedAt: '2026-06-27',
    status: 'published',
  },
  {
    id: 'date-calculator',
    name: 'Date Calculator',
    description: 'Calculate duration between dates or add/subtract calendar days.',
    category: 'calculator',
    tags: ['date', 'time duration', 'calendar calculator', 'days between dates'],
    keywords: ['date calculator', 'calculate days between dates', 'add days to date', 'calendar duration calculator'],
    icon: 'Calendar',
    seoTitle: 'Free Online Date & Time Calculator',
    seoDescription: 'Calculate the exact number of days, weeks, months, or years between two calendar dates, or add/subtract days in your browser.',
    relatedTools: ['uuid-generator'],
    requirements: { browser: true, server: false },
    addedAt: '2026-06-20',
    status: 'planned',
  },
];
