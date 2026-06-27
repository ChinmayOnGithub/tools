export interface CategoryEntry {
  id: string; // Internal id identifier
  slug: string; // URL matching slug
  title: string; // Display name
  description: string; // Purpose description
  icon: 'FileText' | 'Image' | 'Terminal' | 'Hash' | 'Calculator' | 'RefreshCw';
  color: string; // Tailwind styling color variables prefix (e.g. 'purple', 'emerald')
  seoTitle: string;
  seoDescription: string;
}

export const CATEGORIES: CategoryEntry[] = [
  {
    id: 'pdf',
    slug: 'pdf',
    title: 'PDF Tools',
    description: 'Merge, split, rotate, and compress PDF documents securely in your browser.',
    icon: 'FileText',
    color: 'red',
    seoTitle: 'Free Client-Side PDF Tools - Merge, Split, & Compress PDFs',
    seoDescription: 'Edit and manage your PDF files locally. Merge, split, compress, and rotate PDFs completely client-side in your web browser. No files uploaded.',
  },
  {
    id: 'image',
    slug: 'image',
    title: 'Image Tools',
    description: 'Compress, resize, crop, and convert image file formats locally.',
    icon: 'Image',
    color: 'blue',
    seoTitle: 'Free Online Image Tools - Compress, Resize, & Convert Images',
    seoDescription: 'Optimize and crop your images locally. Compress, resize, and convert image files in-browser. Zero server uploads for absolute privacy.',
  },
  {
    id: 'developer',
    slug: 'developer',
    title: 'Developer Tools',
    description: 'JSON formatters, base64 encoders, diff checkers, and formatting utilities.',
    icon: 'Terminal',
    color: 'emerald',
    seoTitle: 'Free Web Developer Utilities - JSON, Base64, & Code Formatting',
    seoDescription: 'Premium browser tools for developers. Format JSON, check diffs, encode/decode Base64 strings safely without leaking code variables.',
  },
  {
    id: 'text',
    slug: 'text',
    title: 'Text Tools',
    description: 'Word counters, regex testers, character count, and casing tools.',
    icon: 'Hash',
    color: 'orange',
    seoTitle: 'Free Text Editors & Counters - Regex, Word Count, & Case Changers',
    seoDescription: 'Analyze and manipulate text content. Word count, character index, regex testing, case conversions, and lipsum generator tools.',
  },
  {
    id: 'calculator',
    slug: 'calculator',
    title: 'Calculators',
    description: 'Perform math, date durations, and financial calculations.',
    icon: 'Calculator',
    color: 'violet',
    seoTitle: 'Free Browser Calculators - Date, Percentage, & Math Calculators',
    seoDescription: 'Run quick calculations. Calculate duration between dates, percentages, and standard scientific formulas locally.',
  },
  {
    id: 'converter',
    slug: 'converter',
    title: 'Converters',
    description: 'Convert between unit definitions, currencies, and timestamps.',
    icon: 'RefreshCw',
    color: 'amber',
    seoTitle: 'Free Online Unit & Timestamp Converters',
    seoDescription: 'Convert between units, dates, timestamps, and data variables in your browser without tracking cookies.',
  },
];
