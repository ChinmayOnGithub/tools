export interface CategoryEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: 'FileText' | 'Image' | 'Terminal' | 'Hash' | 'Calculator' | 'RefreshCw';
  color: string;
  seoTitle: string;
  seoDescription: string;
  overview: string;
  coreUseCases: string[];
}

export const CATEGORIES: CategoryEntry[] = [
  {
    id: 'developer',
    slug: 'developer',
    title: 'Developer Tools',
    description: 'JSON formatters, syntax validators, JWT token decoders, Base64 converters, Unicode analyzers, and cryptographic hash utilities.',
    icon: 'Terminal',
    color: 'emerald',
    seoTitle: 'Developer Tools - JSON, JWT, Base64 & Unicode Utilities',
    seoDescription: 'Client-side developer utilities that process data locally in your browser. Format JSON, decode JWTs, analyze Unicode codepoints, and calculate hashes without server API calls.',
    overview: 'These developer tools assist with debugging APIs, inspecting authentication tokens, investigating Unicode encoding issues, and generating random identifiers. Because all calculations run directly in your browser memory via Web APIs (Web Crypto, TextEncoder, and V8 JSON parsing), sensitive configuration files and API tokens are never sent to external servers.',
    coreUseCases: [
      'Validating and beautifying JSON payloads with line/column syntax error diagnostics',
      'Inspecting claims and expiration timestamps in JSON Web Tokens (JWT)',
      'Detecting invisible zero-width spaces, BiDi override controls, and multi-codepoint emoji clusters',
      'Computing cryptographic hashes (SHA-256, SHA-512, MD5) and generating CSPRNG UUIDv4 identifiers'
    ],
  },
  {
    id: 'pdf',
    slug: 'pdf',
    title: 'Private PDF Toolkit',
    description: 'Merge, split, compress, and compile PDF documents locally inside your browser memory.',
    icon: 'FileText',
    color: 'red',
    seoTitle: 'PDF Tools - Merge, Split & Compress PDFs Locally',
    seoDescription: 'Client-side PDF utilities powered by pdf-lib and Ghostscript WebAssembly. Merge, split, compress, and compile PDFs directly in your browser without uploading documents.',
    overview: 'Most online PDF converters upload sensitive contracts, bank statements, and tax forms to remote servers. This toolkit executes document transformations inside your local browser tab using pdf-lib and WebAssembly-compiled Ghostscript in Web Workers, ensuring confidential documents remain on your machine.',
    coreUseCases: [
      'Merging multiple PDF documents or reordering page sequences with drag-and-drop',
      'Splitting large multi-page reports into individual page files or custom page ranges',
      'Compressing PDF file sizes for email attachments using in-browser WebAssembly rasterization',
      'Converting collections of PNG, JPG, and WebP images into a single standardized PDF'
    ],
  },
  {
    id: 'image',
    slug: 'image',
    title: 'Image Tools',
    description: 'Compress, resize, crop, and convert image formats locally using HTML5 Canvas.',
    icon: 'Image',
    color: 'blue',
    seoTitle: 'Image Tools - Compress, Resize, Crop & Convert Images',
    seoDescription: 'Optimize, resize, crop, and convert JPEG, PNG, and WebP images directly in your browser with zero server uploads.',
    overview: 'Image manipulation utilities built on standard HTML5 Canvas APIs and native browser image codecs. Resize pixel dimensions, adjust compression ratios, crop specific aspect ratios, and convert between JPEG, PNG, and WebP formats without upload queues.',
    coreUseCases: [
      'Compressing image file sizes with real-time byte reduction previews',
      'Scaling pixel dimensions while preserving aspect ratios for responsive web assets',
      'Converting image formats between PNG (lossless transparency), JPEG, and WebP',
      'Cropping photos to custom rectangular dimensions and social media aspect ratios'
    ],
  },
  {
    id: 'text',
    slug: 'text',
    title: 'Text & Content Tools',
    description: 'Word counters, character statistics, text case converters, and duplicate line cleaners.',
    icon: 'Hash',
    color: 'orange',
    seoTitle: 'Text Tools - Word Counters, Case Changers & List Cleaners',
    seoDescription: 'Analyze and manipulate text content in real time. Count words, transform typographic cases, and filter duplicate list lines directly in your browser.',
    overview: 'Content and text analysis utilities designed for editors, programmers, and copywriters. Clean datasets, transform naming conventions between programming conventions (camelCase, snake_case, kebab-case), and calculate real-time reading speeds.',
    coreUseCases: [
      'Calculating word counts, character lengths, sentence totals, and reading time estimates',
      'Converting text between uppercase, lowercase, Title Case, camelCase, and snake_case',
      'Deduplicating text rows and dataset lists with customizable whitespace and case matching'
    ],
  },
  {
    id: 'converter',
    slug: 'converter',
    title: 'Converters',
    description: 'Convert between engineering measurement units, metric/imperial scales, and Unix timestamps.',
    icon: 'RefreshCw',
    color: 'amber',
    seoTitle: 'Unit Converters - Metric, Imperial & Time Conversions',
    seoDescription: 'Convert between metric and imperial units for Length, Weight, Temperature, Area, Volume, and Speed directly in your browser.',
    overview: 'High-precision unit conversion tools for developers, students, and engineers. Convert values across Metric and Imperial measurement systems with exact floating-point factors and translate Unix epoch timestamps into standard calendar dates.',
    coreUseCases: [
      'Translating between Metric (SI) and Imperial systems for length, mass, temperature, and volume',
      'Converting 10-digit Unix seconds and 13-digit Unix milliseconds to ISO 8601, RFC 3339, and UTC strings',
      'Resolving timezone offsets and calculating relative time intervals for log debugging'
    ],
  },
  {
    id: 'calculator',
    slug: 'calculator',
    title: 'Timers & Clocks',
    description: 'High-resolution stopwatches, Pomodoro focus timers, countdown alerts, and fullscreen clocks.',
    icon: 'Calculator',
    color: 'violet',
    seoTitle: 'Timers & Clocks - Pomodoro, Stopwatch & Countdown Tools',
    seoDescription: 'Productivity clocks and timers utilizing browser performance timers and Web Audio API synthesized alert chimes.',
    overview: 'Browser-native productivity timers and clock displays. Built using high-resolution performance timers (performance.now()) and the Web Audio API for synthesized acoustic alerts that operate smoothly in background tabs.',
    coreUseCases: [
      'Structuring focused work and study intervals using the Pomodoro technique with customizable breaks',
      'Measuring elapsed duration and recording split laps with high-resolution performance timers',
      'Setting countdown intervals with synthesized Web Audio alert frequencies'
    ],
  },
];
