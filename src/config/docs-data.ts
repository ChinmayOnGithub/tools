export interface DocArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'architecture' | 'pdf' | 'image' | 'developer' | 'productivity' | 'security';
  readTime: string;
  updatedAt: string;
  overview: string;
  sections: {
    heading: string;
    content: string;
    codeSnippet?: string;
  }[];
  faqs: { q: string; a: string }[];
  relatedTools: string[];
}

export const DOCS_ARTICLES: DocArticle[] = [
  {
    id: 'client-side-architecture',
    slug: 'client-side-architecture',
    title: 'Client-Side Architecture & Zero-Server Sandboxing',
    description: 'Learn how CoolTools operates 100% inside your local web browser tab using Web Crypto API, WebAssembly, and HTML5 FileReader APIs without transmitting data to remote servers.',
    category: 'architecture',
    readTime: '4 min read',
    updatedAt: '2026-06-28',
    overview: 'CoolTools is engineered from the ground up to address growing data privacy concerns associated with traditional online file converters and text utilities. Traditional web converters upload user files to cloud servers for processing, creating supply-chain security risks and data privacy violations. CoolTools eliminates server-side processing entirely.',
    sections: [
      {
        heading: 'How Browser Memory Sandboxing Works',
        content: 'When you open a tool on CoolTools, your browser downloads the static HTML, CSS, and client-side JavaScript assets into memory. Once loaded, all calculations—including PDF parsing, image resizing, Base64 encoding, and cryptographic hashing—run inside your browser\'s local V8 or SpiderMonkey JavaScript engine.',
        codeSnippet: `// Example: Local Web Crypto API Execution
const buffer = new TextEncoder().encode("sensitive string");
const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
// Execution stays 100% inside local tab memory`
      },
      {
        heading: 'WebAssembly (WASM) & Binary Streams',
        content: 'For intensive document and image operations, CoolTools uses WebAssembly binaries. WebAssembly allows C/C++ and Rust compiled code to execute at near-native speed directly inside browser tabs without external API calls.',
      },
      {
        heading: 'Offline Functional Capabilities',
        content: 'Because all business logic lives within your local browser bundle, most tools on CoolTools continue to function seamlessly even if your internet connection is disconnected after loading the page.',
      }
    ],
    faqs: [
      { q: 'Are my files uploaded to any cloud server?', a: 'No. Files processed on CoolTools never leave your local device memory.' },
      { q: 'Can network administrators see my file content?', a: 'No. Since zero network packets containing file data are sent, network sniffers only see standard static web asset requests.' }
    ],
    relatedTools: ['uuid-generator', 'json-formatter', 'hash-generator']
  },
  {
    id: 'pdf-workflows',
    slug: 'pdf-workflows',
    title: 'In-Browser PDF Workflows & Security Standards',
    description: 'Technical guide explaining how PDF document merging, page extraction, splitting, and compression execute locally using client-side JavaScript binary streams.',
    category: 'pdf',
    readTime: '5 min read',
    updatedAt: '2026-06-28',
    overview: 'PDF documents frequently contain sensitive legal contracts, financial disclosures, personal identification, and proprietary business documents. Processing PDFs on server-based converters exposes these files to cloud storage leaks.',
    sections: [
      {
        heading: 'Local PDF Manipulation Engine',
        content: 'CoolTools uses PDF-Lib and PDF.js web libraries to read raw PDF byte arrays locally. Pages are rearranged, extracted, or merged into new PDF documents entirely in browser memory.',
        codeSnippet: `// Local PDF Merging Architecture
import { PDFDocument } from 'pdf-lib';
const mergedPdf = await PDFDocument.create();
for (const bytes of pdfBytesArray) {
  const pdf = await PDFDocument.load(bytes);
  const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  pages.forEach((p) => mergedPdf.addPage(p));
}`
      },
      {
        heading: 'Memory Limits & Large Files',
        content: 'Browser tab memory allows processing PDFs up to several hundred megabytes. Files are processed in streaming chunks using JavaScript Uint8Arrays to maintain high performance.',
      }
    ],
    faqs: [
      { q: 'Is merging PDFs on CoolTools safe for confidential legal documents?', a: 'Yes. Since document bytes are parsed locally in browser memory, confidential files are never exposed to remote servers.' },
      { q: 'What PDF versions are supported?', a: 'Supports PDF 1.3 through PDF 2.0 specifications including scanned and vector documents.' }
    ],
    relatedTools: ['pdf-merge', 'pdf-split', 'pdf-compress', 'images-to-pdf']
  },
  {
    id: 'image-optimization',
    slug: 'image-optimization',
    title: 'Image Compression, Resizing & WebP Conversion Guide',
    description: 'Understand lossy vs. lossless image compression, Canvas API scaling algorithms, and format conversion benchmarks.',
    category: 'image',
    readTime: '5 min read',
    updatedAt: '2026-06-28',
    overview: 'Image optimization is essential for fast web performance, reducing mobile data consumption, and improving Google Core Web Vitals (LCP/CLS) metrics. CoolTools provides in-browser image compression, aspect ratio resizing, and format conversion tools.',
    sections: [
      {
        heading: 'HTML5 Canvas API Processing',
        content: 'Image files uploaded to CoolTools are rendered onto an off-screen HTML5 Canvas element. Pixel buffers are manipulated locally to adjust dimensions, apply cropping bounds, or re-encode into modern WebP, JPEG, or PNG formats.',
      },
      {
        heading: 'WebP Format Advantages',
        content: 'WebP provides superior lossy and lossless compression for web images. WebP images are on average 26% smaller than PNGs and 25-34% smaller than comparable JPEGs.',
      }
    ],
    faqs: [
      { q: 'Will my image quality drop during compression?', a: 'You can customize quality sliders from 10% to 100% to find the optimal balance between file size reduction and visual fidelity.' },
      { q: 'Are my private photos uploaded to a server?', a: 'No. All canvas operations execute in browser tab memory; photos remain strictly on your local device.' }
    ],
    relatedTools: ['image-compressor', 'image-resizer', 'image-format-converter', 'image-cropper']
  },
  {
    id: 'developer-rfc-standards',
    slug: 'developer-rfc-standards',
    title: 'Developer Standards: RFC Specifications Guide',
    description: 'Detailed technical reference for RFC 4122 (UUID v4), RFC 8259 (JSON), RFC 7519 (JWT), and RFC 4648 (Base64) standard implementations.',
    category: 'developer',
    readTime: '6 min read',
    updatedAt: '2026-06-28',
    overview: 'Web utilities must strictly conform to official Internet Engineering Task Force (IETF) Request for Comments (RFC) specifications to ensure system interoperability and standards compliance.',
    sections: [
      {
        heading: 'RFC 4122 - UUID Version 4 Standard',
        content: 'RFC 4122 defines the 128-bit Universally Unique Identifier format represented as 32 hexadecimal digits separated by hyphens (8-4-4-4-12). Version 4 utilizes cryptographically secure random bits.',
      },
      {
        heading: 'RFC 8259 - JSON Specification',
        content: 'RFC 8259 defines strict JavaScript Object Notation data interchange standards. Valid JSON requires double-quoted property keys and forbids trailing commas.',
      },
      {
        heading: 'RFC 7519 - JSON Web Tokens (JWT)',
        content: 'JWT defines a compact, URL-safe container for passing claims between parties. Tokens consist of base64url-encoded Header, Payload, and Signature parts separated by periods.',
      }
    ],
    faqs: [
      { q: 'Why does JSON.parse reject single quotes?', a: 'RFC 8259 strictly requires string literals to be enclosed in double quotation marks.' },
      { q: 'Is Base64 URL-safe encoding different from standard Base64?', a: 'Yes. Base64URL replaces + with - and / with _ to make strings safe for URL query parameters.' }
    ],
    relatedTools: ['uuid-generator', 'json-formatter', 'jwt-decoder', 'base64-converter']
  },
  {
    id: 'productivity-time-management',
    slug: 'productivity-time-management',
    title: 'Productivity Techniques: Pomodoro & Lap Timing Benchmarks',
    description: 'Scientific principles behind the Pomodoro Technique, time boxing, and high-precision sub-millisecond lap stopwatches.',
    category: 'productivity',
    readTime: '4 min read',
    updatedAt: '2026-06-28',
    overview: 'Time management tools help developers, writers, and students maintain deep focus, manage mental fatigue, and track work milestones accurately.',
    sections: [
      {
        heading: 'The Pomodoro Technique Science',
        content: 'Developed by Francesco Cirillo, the Pomodoro Technique structures work into 25-minute concentrated focus sprints followed by short 5-minute restorative breaks. After 4 cycles, a longer 15-30 minute break is taken.',
      },
      {
        heading: 'Sub-Millisecond Stopwatch Accuracy',
        content: 'CoolTools stopwatches utilize high-resolution performance timers (window.performance.now()) to deliver sub-millisecond precision, unaffected by CPU background task throttling.',
      }
    ],
    faqs: [
      { q: 'Will the timer keep running if I switch tabs?', a: 'Yes. Timer hooks recalculate elapsed duration using real-time timestamp deltas when switching tabs.' }
    ],
    relatedTools: ['pomodoro-timer', 'stopwatch', 'countdown-timer', 'fullscreen-clock']
  },
  {
    id: 'security-network-audit',
    slug: 'security-network-audit',
    title: 'How to Audit Web Privacy Using Chrome DevTools',
    description: 'Step-by-step tutorial for auditing network requests in Chrome DevTools to verify zero server uploads on CoolTools.',
    category: 'security',
    readTime: '4 min read',
    updatedAt: '2026-06-28',
    overview: 'We encourage privacy-conscious users to independently verify our zero-upload privacy guarantee using standard browser Developer Tools.',
    sections: [
      {
        heading: 'Step 1: Open Network Panel in Chrome',
        content: 'Press F12 or Right-Click -> Inspect on any CoolTools page. Click on the Network tab at the top of Developer Tools.',
      },
      {
        heading: 'Step 2: Filter Network Activity',
        content: 'Click the Fetch/XHR filter button in DevTools to monitor dynamic HTTP requests and API endpoints.',
      },
      {
        heading: 'Step 3: Execute a Tool Operation',
        content: 'Upload a PDF, generate a UUID, format JSON, or encode Base64 text. Observe that zero network POST or PUT calls are sent containing your file or text payloads.',
      }
    ],
    faqs: [
      { q: 'Why is independent DevTools auditing important?', a: 'It gives users mathematical proof that their confidential files and tokens never leave their device.' }
    ],
    relatedTools: ['uuid-generator', 'json-formatter', 'pdf-merge', 'jwt-decoder']
  }
];
