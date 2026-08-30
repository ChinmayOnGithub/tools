export interface SeoToolContent {
  heading: string;
  explanation: string;
  whenToUse: string;
  howItWorks: string;
  privacyExplanation: string;
  exampleInput: string;
  exampleOutput: string;
  technicalOverview?: string;
  technicalDetails?: string;
  limitations?: string[];
  securityNotes?: string;
  browserCompatibility?: string;
  references?: { title: string; url: string }[];
  commonMistakes?: { mistake: string; explanation: string; fix: string }[];
  stepByStepGuide?: string[];
  useCases?: string[];
  troubleshooting?: string[];
  faqs: { q: string; a: string }[];
}

export const SEO_CONTENT_MAP: Record<string, SeoToolContent> = {
  'uuid-generator': {
    heading: 'RFC 4122 Version 4 UUID Generator',
    explanation: 'Generate cryptographically random Universally Unique Identifiers (UUIDv4) directly in your browser. Configurable options include case formatting, hyphen delimiters, and batch size up to 50 identifiers.',
    whenToUse: 'Generate primary keys for databases (PostgreSQL, MySQL, SQLite), unique request IDs for distributed logging, transaction trace IDs, or random idempotency keys for API payloads.',
    howItWorks: 'Uses the browser Web Crypto API (crypto.getRandomValues) to fill a 16-byte buffer with hardware-derived cryptographically secure pseudorandom numbers (CSPRNG), sets the 4-bit version (0100) and 2-bit RFC 4122 variant (10xx), and formats the result as a 36-character hexadecimal string.',
    privacyExplanation: 'UUID generation occurs exclusively inside your browser runtime. No generated identifiers are transmitted to any server or recorded in remote logs.',
    exampleInput: 'Count: 1, Format: Uppercase, Hyphens: Enabled',
    exampleOutput: '9B1DE2F8-0D32-475C-9A8B-3FA41829B245',
    technicalDetails: 'UUIDv4 contains 122 bits of random entropy out of 128 total bits. The probability of generating a duplicate identifier across billions of iterations is negligible (1 in 2^122).',
    limitations: [
      'UUIDv4 is un-ordered and not time-sequential. If you need chronologically sortable identifiers, consider ULID or UUIDv7.',
      'Batch generation is capped in the interface at 50 per click to ensure zero UI thread latency.'
    ],
    references: [
      { title: 'IETF RFC 4122: A Universally Unique IDentifier (UUID) URN Namespace', url: 'https://datatracker.ietf.org/doc/html/rfc4122' },
      { title: 'MDN Web Docs: Crypto.getRandomValues()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues' }
    ],
    faqs: [
      { q: 'What is the structure of a Version 4 UUID?', a: 'A UUIDv4 is formatted as 32 hexadecimal digits displayed in five groups separated by hyphens (8-4-4-4-12). The 13th digit is always 4 (representing Version 4), and the 17th digit is 8, 9, A, or B (representing the RFC 4122 variant).' },
      { q: 'Are these UUIDs safe to use as database keys?', a: 'Yes. Because they are generated using cryptographically secure random values via the Web Crypto API, they provide 122 bits of collision resistance.' }
    ]
  },
  'json-formatter': {
    heading: 'JSON Formatter, Beautifier & Minifier',
    explanation: 'Format, beautify, inspect, and minify JSON code directly in your browser. Features syntax error line/column tracking, object key sorting, collapsible tree visualization, and file export options.',
    whenToUse: 'Format unreadable single-line JSON payloads from API responses, inspect complex nested configuration files, minify payloads before network transmission, or diagnose syntax errors in JSON datasets.',
    howItWorks: 'Parses the input string using the browser V8 JavaScript engine JSON parser. Valid payloads are formatted with configurable indentation (2 spaces, 4 spaces, or tabs) or stripped of whitespace delimiters. Invalid payloads trigger parser diagnostic routines that calculate line and column offsets.',
    privacyExplanation: 'All parsing, tree construction, formatting, and file exports execute strictly inside your local browser memory tab. No JSON text or payloads are sent to any remote server.',
    exampleInput: '{"name":"API Gateway","routes":[{"path":"/v1/users","auth":true}]}',
    exampleOutput: '{\n  "name": "API Gateway",\n  "routes": [\n    {\n      "path": "/v1/users",\n      "auth": true\n    }\n  ]\n}',
    technicalDetails: 'Compliant with RFC 8259 and ECMA-404 JSON data interchange format specifications. Keys must be double-quoted strings, and numbers must adhere to IEEE 754 floating-point representations.',
    limitations: [
      'Large inputs exceeding 5 MB may slow down client-side syntax highlighting and tree rendering. For files over 2 MB, automatic background validation is deferred to manual button triggers.',
      'Numbers exceeding 64-bit float precision (above Number.MAX_SAFE_INTEGER / 9007199254740991) may lose precision during standard JSON.parse.'
    ],
    commonMistakes: [
      { mistake: 'Trailing Commas', explanation: 'Adding a comma after the final key in an object or array causes a syntax error.', fix: 'Remove the trailing comma before closing } or ].' },
      { mistake: 'Single Quotes', explanation: 'JSON syntax strictly requires double quotes (") around keys and string values.', fix: 'Replace single quotes with double quotes.' }
    ],
    references: [
      { title: 'IETF RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format', url: 'https://datatracker.ietf.org/doc/html/rfc8259' },
      { title: 'ECMA-404: The JSON Data Interchange Standard', url: 'https://www.ecma-international.org/publications-and-standards/standards/ecma-404/' }
    ],
    faqs: [
      { q: 'Does JSON allow comments or trailing commas?', a: 'No. The official JSON standard (RFC 8259) prohibits comments (// or /* */) and trailing commas. If your payload uses comments, it is JSON5 or JSONC, not standard JSON.' },
      { q: 'Can I upload a JSON file to format?', a: 'Yes. You can drag and drop or upload JSON files up to 5 MB. The file is read directly into browser memory via FileReader and formatted without network transmission.' }
    ]
  },
  'json-validator': {
    heading: 'JSON Syntax Validator & Diagnostic Error Pinpointer',
    explanation: 'Validate JSON syntax compliance against RFC 8259 specifications. Pinpoints exact error line numbers, column positions, unescaped characters, unclosed brackets, and trailing commas with plain-language explanations.',
    whenToUse: 'Quickly find why a configuration file or API payload fails to parse, detect invisible invalid control characters, or verify JSON compliance before committing code to production.',
    howItWorks: 'Executes standard JavaScript JSON parsing routines within a protected try/catch boundary, captures lexical errors, parses browser-specific error offset messages (Firefox line/col and Chromium byte position), and cross-references the error token against the source text to provide contextual guidance.',
    privacyExplanation: 'No data leaves your device. All syntax parsing, error location extraction, and validation checks occur inside your browser sandbox.',
    exampleInput: '{\n  "service": "auth",\n  "enabled": true,\n}',
    exampleOutput: 'Syntax Error at line 4, col 1: Trailing comma detected before closing brace "}".',
    technicalDetails: 'JSON validator checks strict type validity for objects, arrays, numbers, strings, booleans (true/false), and null.',
    limitations: [
      'This validator checks JSON structural and lexical syntax. It does not validate payloads against JSON Schema specifications ($schema).'
    ],
    references: [
      { title: 'IETF RFC 8259 JSON Specification', url: 'https://datatracker.ietf.org/doc/html/rfc8259' }
    ],
    faqs: [
      { q: 'Why is my JSON failing validation?', a: 'Common causes include trailing commas after the last property, using single quotes instead of double quotes, missing closing braces/brackets, or unescaped control characters inside strings.' },
      { q: 'Can this validator identify the exact line of an error?', a: 'Yes. The validator calculates both the line number and character column index where the parsing error occurred.' }
    ]
  },
  'jwt-decoder': {
    heading: 'JSON Web Token (JWT) Inspector & Claim Decoder',
    explanation: 'Inspect and decode the three structural components of a JSON Web Token (Header, Payload, and Signature) directly in your browser. Inspect expiration timestamps, token issuers, subjects, and custom claims.',
    whenToUse: 'Debug authentication headers, verify claims returned by OAuth/OpenID Connect identity providers (Auth0, Okta, Firebase, AWS Cognito), inspect token expiration status, or verify token algorithm headers.',
    howItWorks: 'Splits the period-delimited JWT string into its three segments (Header, Payload, Signature), normalizes the Base64URL encoding into standard Base64 with appropriate padding, decodes the UTF-8 byte stream into JSON objects, and computes expiration status against the client system clock.',
    privacyExplanation: 'Tokens are processed exclusively in client-side memory. Confidential tokens and API authorization credentials are never uploaded to any remote server.',
    exampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiZXhwIjoxNzg0ODgwMDAwfQ.4v_secret_sig',
    exampleOutput: 'Header: {"alg":"HS256","typ":"JWT"}\nPayload: {"sub":"1234567890","name":"Alice","exp":1784880000}',
    securityNotes: 'Decode ≠ Verify. This tool inspects the structural claims of a JWT without verifying the cryptographic signature. Never trust token claims on a server without validating the signature using your public key (RS256/ES256) or secret key (HS256).',
    limitations: [
      'This tool decodes unsigned, symmetrically signed (HS256), and asymmetrically signed (RS256/ES256) JWTs, but does not verify signature validity without access to private/public cryptographic key pairs.',
      'Encrypted JSON Web Tokens (JWE - RFC 7516) cannot be inspected without providing the corresponding decryption key.'
    ],
    references: [
      { title: 'IETF RFC 7519: JSON Web Token (JWT)', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
      { title: 'IETF RFC 7515: JSON Web Signature (JWS)', url: 'https://datatracker.ietf.org/doc/html/rfc7515' }
    ],
    faqs: [
      { q: 'Does decoding a JWT prove the token is valid?', a: 'No. Decoding only translates the Base64URL payload into readable JSON. To determine authenticity and prevent tampering, your server must verify the cryptographic signature using your shared secret or identity provider public key.' },
      { q: 'What do standard claims like exp, iat, and nbf mean?', a: 'exp (Expiration Time) defines when the token ceases to be valid; iat (Issued At) records the timestamp of token creation; nbf (Not Before) specifies the timestamp prior to which the token must not be accepted.' }
    ]
  },
  'unicode-inspector': {
    heading: 'Unicode Character Inspector & Code Point Analyzer',
    explanation: 'Analyze text strings to inspect exact Unicode code points, UTF-8 byte sequences, UTF-16 code units, Unicode categories, and non-printable characters. Detects zero-width spaces, invisible characters, bidirectional overrides, and multi-codepoint emoji clusters.',
    whenToUse: 'Debug text copying issues, detect invisible zero-width characters injected into code or credentials, investigate bidirectional text spoofing (RTLO attacks), examine Unicode normalization bugs, and inspect emoji grapheme sequences.',
    howItWorks: 'Iterates through text using JavaScript character iterators to correctly handle surrogate pairs, calls String.prototype.codePointAt, encodes character bytes using TextEncoder (UTF-8) and charCodeAt (UTF-16), and evaluates character values against Unicode 15.0 block ranges.',
    privacyExplanation: 'All character inspection, hex conversions, and classification calculations execute in your browser runtime. No input text is stored or sent over the network.',
    exampleInput: 'Hello 👋\\u200b',
    exampleOutput: 'Idx 0: "H" U+0048 (UTF-8: 48) [Latin]\nIdx 6: "👋" U+1F44B (UTF-8: F0 9F 91 8B, UTF-16: D83D DC4B) [Emoji]\nIdx 7: [Hidden] U+200B (UTF-8: E2 80 8B) [Zero-Width Space]',
    technicalDetails: 'Unicode assigns every human script character, emoji, and control symbol a unique integer code point (U+0000 to U+10FFFF). Characters above U+FFFF are encoded in UTF-16 using surrogate pairs.',
    limitations: [
      'Grapheme cluster boundaries (composite emoji sequences like skin tones or family groups composed of multiple codepoints joined by ZWJ) are broken down into their individual constituent code points for inspection.'
    ],
    references: [
      { title: 'The Unicode Consortium: Unicode Standard Core Specification', url: 'https://www.unicode.org/versions/latest/' },
      { title: 'MDN Web Docs: String.prototype.codePointAt()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt' }
    ],
    faqs: [
      { q: 'What is a zero-width space (ZWSP)?', a: 'A zero-width space (U+200B) is an invisible character used in typesetting to indicate word boundaries without displaying a space. It is frequently copied accidentally and causes elusive programming syntax errors or database query mismatches.' },
      { q: 'What is a bidirectional (BiDi) override control?', a: 'BiDi controls (such as Right-to-Left Override U+202E) force the rendering engine to reverse the visual direction of subsequent characters. Attackers sometimes use them to disguise executable file extensions (e.g. making "payload[U+202E]exe.pdf" display visually as "payloadfdp.exe").' }
    ]
  },
  'timestamp-explorer': {
    heading: 'Unix Epoch Timestamp & DateTime Explorer',
    explanation: 'Convert and inspect Unix epoch timestamps in seconds and milliseconds across ISO 8601, RFC 3339, RFC 2822, UTC, and local timezone formats with live relative time calculations.',
    whenToUse: 'Debug database timestamps (PostgreSQL, MongoDB, MySQL), analyze server access logs, inspect token exp/iat claims, convert API dates to human-readable timestamps, or resolve timezone offset bugs.',
    howItWorks: 'Parses numeric inputs (treating 10-digit values as seconds and 13-digit values as milliseconds) or ISO date strings into millisecond epoch values, initializes a native JavaScript Date object, and maps the components to standard date representation formats.',
    privacyExplanation: 'Calculations run entirely inside your browser tab. Timestamps, database records, and server logs are never sent over the network.',
    exampleInput: '1719600000 (10-digit Unix Seconds)',
    exampleOutput: 'ISO 8601: 2024-06-28T18:40:00.000Z\nRFC 3339: 2024-06-28T18:40:00Z\nUTC: Fri, 28 Jun 2024 18:40:00 GMT',
    technicalDetails: 'Unix time represents the number of non-leap seconds elapsed since January 1, 1970 00:00:00 UTC (the Unix Epoch). 10-digit timestamps represent seconds; 13-digit timestamps represent milliseconds.',
    limitations: [
      'Dates before 1970 or after the Year 2038 (32-bit signed integer overflow limit) are handled using 64-bit JavaScript Numbers, supporting accurate representation up to Year 275760.',
      'Timezone conversions depend on your local operating system and browser timezone settings.'
    ],
    references: [
      { title: 'IETF RFC 3339: Date and Time on the Internet: Timestamps', url: 'https://datatracker.ietf.org/doc/html/rfc3339' },
      { title: 'ISO 8601 Representation of Dates and Times', url: 'https://www.iso.org/iso-8601-date-and-time-format.html' }
    ],
    faqs: [
      { q: 'What is the difference between Unix seconds and milliseconds?', a: 'A 10-digit integer (e.g. 1719600000) represents seconds elapsed since the Unix epoch, commonly used in Unix command lines, JWT exp claims, and C libraries. A 13-digit integer (e.g. 1719600000000) represents milliseconds, used by JavaScript Date.now() and Java/JVM runtimes.' },
      { q: 'What is the Year 2038 problem?', a: 'Systems storing Unix time as signed 32-bit integers will overflow on January 19, 2038 at 03:14:07 UTC. Modern 64-bit systems and JavaScript runtimes avoid this problem by using 64-bit representations.' }
    ]
  },
  'hash-generator': {
    heading: 'Cryptographic Hash Generator & Checksum Calculator',
    explanation: 'Generate cryptographic hash digests using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 directly in your browser. Supports custom cryptographic salts with prepend/append configurations and text file drag-and-drop.',
    whenToUse: 'Calculate file checksums to verify download integrity, create cryptographic digests for data deduplication, or compute hashes for development testing.',
    howItWorks: 'Uses the W3C Web Crypto API (crypto.subtle.digest) for hardware-accelerated SHA-1, SHA-256, SHA-384, and SHA-512 calculations. Uses an internal pure JavaScript implementation for legacy MD5 checksums.',
    privacyExplanation: 'All hashing calculations execute inside your local browser memory. Text inputs, files, and generated hashes are never uploaded to any remote server.',
    exampleInput: 'Input: "cooltools", Algorithm: SHA-256',
    exampleOutput: 'SHA-256: 4b2958ff62ff054c2049d564bbda2c8b87d2ef1492c6e6e06b3a033f6b9bc607',
    securityNotes: 'Hashing is a one-way mathematical digest, not encryption (which is reversible with a key) and not encoding (which is a reversible representation). MD5 and SHA-1 have known cryptographic collision weaknesses and must not be used for security-critical applications or password storage.',
    limitations: [
      'Web Crypto processes files in browser memory; files larger than 2 MB should be processed using native command line utilities (sha256sum) to avoid browser tab memory pressure.',
      'This tool computes standard cryptographic digests. For password storage, use adaptive password-hashing functions like bcrypt, scrypt, or Argon2 instead of raw fast hashes.'
    ],
    references: [
      { title: 'NIST FIPS 180-4: Secure Hash Standard (SHS)', url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final' },
      { title: 'W3C Web Cryptography API', url: 'https://www.w3.org/TR/WebCryptoAPI/' }
    ],
    faqs: [
      { q: 'What is the difference between hashing, encryption, and encoding?', a: 'Hashing is a one-way mathematical transformation that produces a fixed-length digest and cannot be reversed. Encryption is a two-way transformation designed to protect confidentiality, reversible only with a secret key. Encoding (like Base64) is a data format conversion for transmission, easily reversed without any key.' },
      { q: 'Why is MD5 not recommended for security?', a: 'Researchers have demonstrated practical collision attacks against MD5 (generating two distinct files with the exact same hash). Use SHA-256 or SHA-512 for security applications.' }
    ]
  },
  'base64-converter': {
    heading: 'Base64 Text & File Encoder / Decoder',
    explanation: 'Encode text strings and files into Base64 format or decode Base64 strings back to standard human-readable text and binary files directly in your browser tab.',
    whenToUse: 'Encode HTTP Basic Authentication header credentials, embed small image assets as Data URLs in HTML/CSS, decode Base64 payload data from webhooks, or format binary data for text-only communication channels.',
    howItWorks: 'Converts UTF-8 text strings into byte arrays using TextEncoder/TextDecoder before executing window.btoa and window.atob conversions, properly handling multi-byte Unicode characters without Latin1 truncation.',
    privacyExplanation: 'All conversions run strictly in your local browser sandbox. No strings or uploaded files are sent across the network.',
    exampleInput: 'Input Text: "Hello, World!"',
    exampleOutput: 'Base64 Encoded: "SGVsbG8sIFdvcmxkIQ=="',
    technicalDetails: 'Base64 represents 6 bits of data per character using an alphabet of 64 ASCII characters (A-Z, a-z, 0-9, +, /) and "=" for padding. Encoding increases data size by approximately 33%.',
    limitations: [
      'Base64 encoding increases payload size by ~33%. It should not be used for large media files where binary transfer is supported.',
      'Base64 is an encoding scheme, not encryption. It provides zero confidentiality or security on its own.'
    ],
    references: [
      { title: 'IETF RFC 4648: The Base16, Base32, and Base64 Data Encodings', url: 'https://datatracker.ietf.org/doc/html/rfc4648' }
    ],
    faqs: [
      { q: 'Is Base64 secure for sensitive data?', a: 'No. Base64 is a data representation format, not an encryption method. Anyone can immediately decode a Base64 string without a password or key.' },
      { q: 'What is the difference between standard Base64 and Base64URL?', a: 'Standard Base64 uses "+" and "/" characters, which have special meanings in URLs and filenames. Base64URL replaces "+" with "-" and "/" with "_", and typically omits trailing "=" padding characters.' }
    ]
  },
  'pdf-merge': {
    heading: 'Browser-Native PDF Merger',
    explanation: 'Combine multiple PDF documents into a single file directly in your browser. Reorder pages and files interactively before generating the merged document.',
    whenToUse: 'Merge multi-part scanned documents, consolidate monthly invoices or receipts into a single tax file, combine project proposals with contract appendices, or compile individual PDF chapters into a book.',
    howItWorks: 'Reads uploaded PDF files into ArrayBuffers using browser FileReader APIs, parses the document object structure with the client-side pdf-lib WebAssembly/JavaScript library, copies selected pages sequentially into a new PDF document instance, and exports the final binary blob for immediate download.',
    privacyExplanation: 'Documents are processed locally in your browser memory. Your confidential contracts, financial statements, and personal records are never uploaded to any remote server.',
    exampleInput: 'Files: contract_part1.pdf (3 pages), contract_part2.pdf (2 pages)',
    exampleOutput: 'Merged: merged_document.pdf (5 pages total)',
    technicalDetails: 'The merger reconstructs PDF cross-reference tables (XREFs) and page tree objects in local memory while preserving embedded vector fonts and standard document metadata.',
    limitations: [
      'Encrypted or password-protected PDF files must be decrypted before merging.',
      'Processing very large files (e.g. combined size exceeding 100 MB) depends on available browser RAM.'
    ],
    references: [
      { title: 'ISO 32000-1: Document Management — Portable Document Format (PDF 1.7)', url: 'https://www.iso.org/standard/51502.html' }
    ],
    faqs: [
      { q: 'Are my uploaded PDF files safe from interception?', a: 'Yes. Unlike traditional online PDF services that process your files on remote servers, this tool executes 100% inside your browser sandbox. You can verify this by inspecting the Network tab in your browser Developer Tools.' },
      { q: 'Can I change the order of files before merging?', a: 'Yes. You can drag and drop or use the accessible reorder buttons to arrange documents in your desired sequence.' }
    ]
  },
  'pdf-split': {
    heading: 'Browser-Native PDF Splitter & Page Extractor',
    explanation: 'Split PDF documents by specific page numbers or continuous page ranges, or extract individual pages into separate downloadable PDF files directly in your browser.',
    whenToUse: 'Extract specific pages or chapters from a large manual, separate a multi-page contract into individual addendums, or isolate specific invoice sheets from a batch scan.',
    howItWorks: 'Loads the source PDF into memory using pdf-lib, parses custom page range expressions (e.g. "1-3, 5, 8-10"), copies the corresponding page objects into a new PDF document container, and generates an optimized binary download.',
    privacyExplanation: 'All page parsing and extraction occurs inside your local browser tab. No document data touches external servers.',
    exampleInput: 'File: annual_report.pdf (20 pages), Range: "1-3, 10"',
    exampleOutput: 'Extracted: annual_report_extracted.pdf (4 pages: 1, 2, 3, 10)',
    technicalDetails: 'Extracts exact vector paths, fonts, form fields, and image streams associated with target pages without rasterizing or re-compressing graphics.',
    limitations: [
      'Password-protected PDFs must be unlocked before page extraction.',
      'Dynamic interactive XFA forms may lose scripted logic when separated into individual pages.'
    ],
    faqs: [
      { q: 'How do I specify page ranges to split?', a: 'Use commas to separate individual pages and hyphens for continuous ranges (e.g. "1-4, 7, 9-12").' },
      { q: 'Does splitting reduce the visual quality of pages?', a: 'No. The tool copies original PDF page structures and embedded assets losslessly without rasterizing text or images.' }
    ]
  },
  'pdf-compress': {
    heading: 'Ghostscript WebAssembly Client-Side PDF Compressor',
    explanation: 'Optimize and reduce PDF document file sizes locally inside your browser memory using Ghostscript compiled to WebAssembly (WASM).',
    whenToUse: 'Reduce PDF file sizes to meet strict upload limits on government portals, email attachment caps (e.g. 25 MB), job application systems, or mobile document viewers.',
    howItWorks: 'Spawns a Web Worker running Ghostscript compiled to WebAssembly. The input PDF is loaded into a virtual memory filesystem (MEMFS), where Ghostscript applies standard PostScript/PDF optimization filters (downsampling images to 150 DPI and removing redundant font descriptors) before outputting the optimized file.',
    privacyExplanation: 'Processing occurs 100% inside your browser WebAssembly runtime. Confidential documents, bank statements, and legal files are never uploaded to any remote server.',
    exampleInput: 'Upload: scanned_record.pdf (8.5 MB), Preset: Balanced (150 DPI)',
    exampleOutput: 'Download: scanned_record_compressed.pdf (2.1 MB - 75% reduction)',
    technicalDetails: 'Uses standard Ghostscript PDF write device parameters (/ebook at 150 DPI for balanced quality, /screen at 72 DPI for maximum reduction).',
    limitations: [
      'PDFs that consist primarily of plain vector text without images may experience minimal compression because vector instructions are already compact.',
      'Very large documents (exceeding 50 MB) require sufficient browser memory for the WebAssembly runtime.'
    ],
    faqs: [
      { q: 'Why do some PDF files not compress significantly?', a: 'PDFs that contain only vector text, clean fonts, or images that are already heavily compressed will see little reduction. The highest reduction occurs on high-resolution scanned documents with uncompressed raster images.' },
      { q: 'What quality preset should I choose?', a: 'We recommend the Balanced preset (150 DPI) for general documents and emails. Choose High Compression (72 DPI) only for screen-only viewing where file size is critical.' }
    ]
  },
  'image-compressor': {
    heading: 'Client-Side Image Compressor & Size Optimizer',
    explanation: 'Compress and optimize JPEG, PNG, and WebP images directly in your browser. Configure compression quality levels and maximum dimension limits while previewing file size savings in real time.',
    whenToUse: 'Optimize website images for faster page load times, compress photos for email attachments, reduce profile picture sizes, or save storage space.',
    howItWorks: 'Draws the uploaded image into an HTML5 Canvas context and re-encodes the pixel buffer using Canvas.toBlob with adjustable quality parameters (0.0 to 1.0) and bilinear downscaling.',
    privacyExplanation: 'Images are processed locally in your browser memory. Photos and graphics are never uploaded to any remote server.',
    exampleInput: 'Input: photo.jpg (3.2 MB), Quality: 80%',
    exampleOutput: 'Output: photo_compressed.jpg (720 KB - 77% reduction)',
    technicalDetails: 'JPEG and WebP encodings utilize lossy discrete cosine transform (DCT) and arithmetic compression algorithms. PNG optimization uses palette reduction and canvas re-encoding.',
    limitations: [
      'Compressing transparent PNGs with lossy JPEG output will replace transparent backgrounds with black or white. Use WebP or PNG format to preserve transparency.',
      'Images exceeding 40 Megapixels may hit browser Canvas memory constraints on mobile devices.'
    ],
    faqs: [
      { q: 'What is the best image format for web performance?', a: 'WebP offers superior compression compared to JPEG and PNG, delivering 25%–35% smaller file sizes at equivalent visual quality with full transparency support.' },
      { q: 'Does image compression reduce photo dimensions?', a: 'By default, compression adjusts encoding quality while preserving original pixel dimensions. You can optionally set maximum width/height constraints to scale the image down.' }
    ]
  },
  'image-resizer': {
    heading: 'Client-Side Image Resizer',
    explanation: 'Resize image dimensions (width and height in pixels) with aspect ratio locking directly in your browser. Supports JPEG, PNG, and WebP formats.',
    whenToUse: 'Scale down high-resolution photos for web publishing, prepare social media banners and thumbnails, or fit images to specific dimension requirements.',
    howItWorks: 'Loads the image bitmap into an offscreen HTML5 Canvas element scaled to the target width and height, applies browser bilinear filtering, and exports the resized image blob.',
    privacyExplanation: 'All resizing executes in local browser memory. No images leave your device.',
    exampleInput: 'Original: 3840x2160, Target: 1920x1080 (16:9 aspect locked)',
    exampleOutput: 'Resized Image: 1920x1080 px',
    faqs: [
      { q: 'Does scaling up an image improve its resolution?', a: 'No. Upscaling a small image to larger dimensions interpolates existing pixels, which typically results in blurriness or pixelation.' },
      { q: 'How does aspect ratio locking work?', a: 'When locked, changing either the width or height automatically calculates the other dimension proportionally to prevent image distortion.' }
    ]
  },
  'image-format-converter': {
    heading: 'Client-Side Image Format Converter',
    explanation: 'Convert images seamlessly between PNG, JPEG, and WebP formats directly in your browser tab.',
    whenToUse: 'Convert PNG screenshots to WebP for faster web loading, convert WebP images to standard JPEG for older software compatibility, or convert JPEGs to PNG for lossless editing.',
    howItWorks: 'Renders the input image onto an HTML5 Canvas surface and exports the binary stream as the target MIME type using the browser-native canvas blob encoder.',
    privacyExplanation: 'Conversions execute entirely client-side. No image files are uploaded or stored.',
    exampleInput: 'Source: banner.png -> Target: WEBP (Quality: 85%)',
    exampleOutput: 'Converted: banner.webp',
    faqs: [
      { q: 'What happens to transparency when converting PNG to JPEG?', a: 'JPEG format does not support alpha channel transparency. Converting a transparent PNG to JPEG will fill transparent areas with a solid background color. Use WebP to retain transparency with smaller file sizes.' },
      { q: 'Is converting from JPEG to PNG lossless?', a: 'Converting a JPEG to PNG produces a lossless container, but it cannot restore image details previously discarded by JPEG lossy compression.' }
    ]
  },
  'image-cropper': {
    heading: 'Client-Side Image Cropping Utility',
    explanation: 'Crop images to custom rectangular dimensions or specific aspect ratios directly in your browser.',
    whenToUse: 'Crop headshots for profile avatars, remove unwanted borders from screenshots, or center subjects for social media cards.',
    howItWorks: 'Maps crop coordinates to natural pixel boundaries and draws the selected region onto an HTML5 Canvas for instant export.',
    privacyExplanation: 'Cropping operates entirely inside your browser tab without network transfers.',
    exampleInput: 'Input: landscape.jpg, Crop: 1:1 square centered',
    exampleOutput: 'Cropped: landscape_cropped.jpg',
    faqs: [
      { q: 'Does cropping reduce the resolution of the cropped area?', a: 'No. The crop tool extracts original pixels directly from the source image at 1:1 scale without re-sampling or loss.' }
    ]
  },
  'images-to-pdf': {
    heading: 'Browser-Native Images to PDF Compiler',
    explanation: 'Compile PNG, JPEG, and WebP images into a single unified PDF document directly in your browser.',
    whenToUse: 'Combine multiple photo receipts into an expense PDF, create PDF slide presentations from image exports, or compile scanned document pages into a single document.',
    howItWorks: 'Reads selected image files into binary buffers, calculates optimal page layout dimensions, and embeds each image into consecutive pages of a new PDF document using pdf-lib.',
    privacyExplanation: 'Everything compiles locally in your browser memory sandbox. No images are uploaded to any server.',
    exampleInput: 'Upload: page1.png, page2.jpg, receipt.webp',
    exampleOutput: 'Compiled PDF: images_compiled.pdf (3 pages)',
    faqs: [
      { q: 'Can I reorder images before generating the PDF?', a: 'Yes. You can drag and drop images to arrange the exact page sequence before compilation.' }
    ]
  },
  'url-encoder': {
    heading: 'URL Parameter & URI Component Encoder / Decoder',
    explanation: 'Encode text strings into percent-encoded URL formats or decode percent-encoded strings back into standard human-readable text.',
    whenToUse: 'Format query parameter values containing spaces or symbols for HTTP GET requests, decode API tracking parameters, or clean URLs for web routing.',
    howItWorks: 'Uses browser-native encodeURIComponent and decodeURIComponent functions compliant with RFC 3986 Uniform Resource Identifier specifications.',
    privacyExplanation: 'URL parsing and conversions occur locally in your browser tab without server transmission.',
    exampleInput: 'query=user name & role=admin',
    exampleOutput: 'query%3Duser%20name%20%26%20role%3Dadmin',
    references: [
      { title: 'IETF RFC 3986: Uniform Resource Identifier (URI): Generic Syntax', url: 'https://datatracker.ietf.org/doc/html/rfc3986' }
    ],
    faqs: [
      { q: 'Why do URL query parameters need encoding?', a: 'URLs can only safely transmit unreserved ASCII characters. Reserved characters like spaces, &, =, and ? have structural meanings in URIs and must be percent-encoded to avoid ambiguous parsing.' }
    ]
  },
  'password-generator': {
    heading: 'CSPRNG Random Password Generator',
    explanation: 'Generate cryptographically secure random passwords and passphrases using hardware-derived entropy via the Web Crypto API.',
    whenToUse: 'Generate secure master passwords, server database credentials, API secret keys, or unique account passwords.',
    howItWorks: 'Uses crypto.getRandomValues to select random characters uniformly from configurable character pools (uppercase, lowercase, numbers, symbols) to prevent bias and ensure maximum entropy.',
    privacyExplanation: 'All passwords are generated directly inside your browser memory. Generated credentials are never logged, transmitted, or stored on any server.',
    exampleInput: 'Length: 20, Character Pools: Upper, Lower, Digits, Symbols',
    exampleOutput: 'k7#Qm9$Lp2!vX8*Zw4@R',
    references: [
      { title: 'NIST Special Publication 800-63B: Digital Identity Guidelines (Authentication)', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html' }
    ],
    faqs: [
      { q: 'What makes a password cryptographically secure?', a: 'Using a cryptographically secure pseudorandom number generator (CSPRNG) tied to hardware entropy rather than pseudo-random functions like Math.random(), combined with sufficient length (16+ characters) to resist brute-force search attacks.' }
    ]
  },
  'qr-generator': {
    heading: 'Client-Side QR Code Generator',
    explanation: 'Generate customizable, high-resolution QR codes from text, URLs, and contact details with configurable error correction and downloadable PNG exports.',
    whenToUse: 'Create scannable website links, share Wi-Fi credentials, generate authentication setup codes, or prepare print materials.',
    howItWorks: 'Calculates Reed-Solomon error correction matrices and renders vector modules onto an HTML5 Canvas element.',
    privacyExplanation: 'QR codes are rendered locally inside your browser tab without transmitting content strings to external services.',
    exampleInput: 'URL: https://tools.chinmaypatil.com',
    exampleOutput: 'Downloadable QR Code Image (PNG)',
    faqs: [
      { q: 'What error correction level should I choose?', a: 'Medium (M - 15% recovery) is ideal for digital displays. Choose Quartile (Q - 25%) or High (H - 30%) if you plan to print the QR code or place a logo in the center.' }
    ]
  },
  'barcode-generator': {
    heading: 'Client-Side Vector Barcode Generator',
    explanation: 'Generate standard 1D barcodes including CODE128, EAN-13, EAN-8, and UPC-A as scalable vector SVG files directly in your browser.',
    whenToUse: 'Generate retail barcodes, inventory tracking labels, shipping tags, or library catalog markers.',
    howItWorks: 'Calculates symbology check digits and renders vector SVG paths matching ISO/IEC barcode specifications.',
    privacyExplanation: 'Barcode generation runs locally inside your browser tab.',
    exampleInput: 'Format: CODE128, Value: "INV-98234-A"',
    exampleOutput: 'Vector Barcode (SVG format)',
    faqs: [
      { q: 'Why are barcodes exported as SVG?', a: 'SVG is a vector format that scales infinitely without pixelation, ensuring sharp print results on thermal label printers and laser scanners.' }
    ]
  },
  'color-picker': {
    heading: 'Color Picker & Palette Harmony Explorer',
    explanation: 'Inspect and convert colors between HEX, RGB, and HSL color models, test contrast ratios, and generate complementary, analogous, and triadic color harmonies.',
    whenToUse: 'Design web interfaces, extract palette harmonies for brand identity, or test accessible color combinations.',
    howItWorks: 'Converts RGB color vectors into cylindrical HSL coordinates and calculates trigonometric hue rotations in local JavaScript memory.',
    privacyExplanation: 'Color computations execute entirely in your browser.',
    exampleInput: 'Hex: #6366F1 (Indigo)',
    exampleOutput: 'RGB: rgb(99, 102, 241), HSL: hsl(239, 84%, 67%)',
    faqs: [
      { q: 'What is the advantage of HSL over RGB for design?', a: 'HSL (Hue, Saturation, Lightness) separates color shade from brightness and saturation, making it intuitive to create tints, shades, and harmonious color variants.' }
    ]
  },
  'word-counter': {
    heading: 'Text Statistics & Word Counter',
    explanation: 'Analyze text statistics in real time, including word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading times.',
    whenToUse: 'Verify word limits for essays and articles, check tweet and character lengths for social posts, or review documentation readability.',
    howItWorks: 'Uses Unicode-aware regular expression tokenizers to divide text into word boundaries and paragraph segments.',
    privacyExplanation: 'All text analysis occurs strictly inside your browser memory. Text is never logged or transmitted.',
    exampleInput: 'Enter or paste sample text paragraphs.',
    exampleOutput: 'Words: 45, Characters: 280, Sentences: 3, Reading Time: 14s',
    faqs: [
      { q: 'How are reading times calculated?', a: 'Reading time is calculated using an average adult reading speed benchmark of 200 words per minute (WPM).' }
    ]
  },
  'case-converter': {
    heading: 'Text Case Converter',
    explanation: 'Convert text between standard typographic and programming cases: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
    whenToUse: 'Format code variable names, standardize database column names, clean spreadsheet titles, or convert text casings for headlines.',
    howItWorks: 'Tokenizes words using delimiter and casing boundaries, applying case transformation rules to each token before joining with the target delimiter.',
    privacyExplanation: 'Conversions execute entirely inside your browser tab.',
    exampleInput: 'User account profile settings',
    exampleOutput: 'camelCase: userAccountProfileSettings\nsnake_case: user_account_profile_settings\nkebab-case: user-account-profile-settings',
    faqs: [
      { q: 'What is the difference between camelCase and PascalCase?', a: 'camelCase starts with a lowercase letter and capitalizes subsequent words (e.g. userProfile). PascalCase capitalizes all words including the first (e.g. UserProfile).' }
    ]
  },
  'remove-duplicate-lines': {
    heading: 'Duplicate Line Remover & List Cleaner',
    explanation: 'Filter duplicate lines from text lists and data sets with configurable case sensitivity, whitespace trimming, and alphabetical sorting.',
    whenToUse: 'Deduplicate email subscriber lists, clean keyword indexes for SEO, remove duplicate database IDs, or sort raw data rows.',
    howItWorks: 'Splits text by newline delimiters, filters unique elements using a JavaScript Set data structure, and reconstructs the cleaned list.',
    privacyExplanation: 'List filtering runs entirely inside your browser memory.',
    exampleInput: 'alpha\\nbeta\\nalpha\\ngamma',
    exampleOutput: 'alpha\\nbeta\\ngamma (1 duplicate removed)',
    faqs: [
      { q: 'Does whitespace trimming affect line deduplication?', a: 'When enabled, leading and trailing spaces are stripped before comparing lines for uniqueness, preventing lines with trailing whitespace from being treated as unique.' }
    ]
  },
  'unit-converter': {
    heading: 'Engineering & Everyday Unit Converter',
    explanation: 'Convert values across Metric and Imperial measurement units for Length, Weight, Temperature, Area, Volume, Time, and Speed.',
    whenToUse: 'Convert cooking measurements, engineering specifications, international travel distances, or temperature scales.',
    howItWorks: 'Applies standard international unit conversion ratio factors and affine temperature formulas in browser memory.',
    privacyExplanation: 'Calculations execute entirely inside your browser tab.',
    exampleInput: '100 Kilometers -> Miles',
    exampleOutput: '62.1371 Miles',
    faqs: [
      { q: 'Are precision rounding limits applied?', a: 'Values are calculated with high floating-point precision and formatted cleanly to eliminate precision artifacts.' }
    ]
  },
  'pomodoro-timer': {
    heading: 'Pomodoro Focus Timer & Productivity Workstation',
    explanation: 'Structure work and study sessions with the Pomodoro technique using customizable focus intervals, short breaks, long breaks, and synthesized Web Audio alert chimes.',
    whenToUse: 'Deep focus work sessions, coding sprints, study blocks, and structured timeboxing.',
    howItWorks: 'Maintains interval timers synchronized with high-resolution system timestamps, rendering a visual progress ring and playing alert chimes via the Web Audio API.',
    privacyExplanation: 'All timer configurations and session counts are stored locally in browser localStorage.',
    exampleInput: 'Focus: 25 min, Short Break: 5 min',
    exampleOutput: 'Active Countdown Timer with audio notifications',
    faqs: [
      { q: 'Will the timer chime if my browser tab is in the background?', a: 'Yes. The Web Audio API synthesizer plays completion alert chimes even when the tab is backgrounded.' }
    ]
  },
  'stopwatch': {
    heading: 'High-Resolution Stopwatch & Lap Timer',
    explanation: 'Measure elapsed time intervals and record lap splits with high-resolution accuracy using the browser performance.now() API.',
    whenToUse: 'Time athletic laps, record code execution benchmarks, or track task durations.',
    howItWorks: 'Measures high-resolution performance intervals using window.performance.now() to deliver microsecond-accurate time measurement free from clock drift.',
    privacyExplanation: 'Lap times remain in transient component state and are never transmitted.',
    exampleInput: 'Start -> Lap -> Lap -> Stop',
    exampleOutput: 'Lap 1: 00:04.32, Lap 2: 00:03.88, Total: 00:08.20',
    faqs: [
      { q: 'How does performance.now() differ from Date.now()?', a: 'performance.now() measures monotonic time from page load with sub-millisecond resolution, unaffected by operating system clock adjustments or daylight saving shifts.' }
    ]
  },
  'countdown-timer': {
    heading: 'Countdown Timer & Audio Alarm',
    explanation: 'Set countdown timers for hours, minutes, and seconds with audible Web Audio alarm chimes.',
    whenToUse: 'Cooking timers, presentation time limits, exercise intervals, or study countdowns.',
    howItWorks: 'Calculates remaining duration against system timestamps and triggers synthesized Web Audio frequencies upon reaching zero.',
    privacyExplanation: 'Runs entirely client-side without external dependencies.',
    exampleInput: 'Duration: 15 minutes',
    exampleOutput: 'Active countdown with alarm at 00:00:00',
    faqs: [
      { q: 'Are alarm audio files downloaded from a server?', a: 'No. The audio chime is synthesized directly in your browser using the Web Audio API oscillator.' }
    ]
  },
  'fullscreen-clock': {
    heading: 'Fullscreen Digital Clock & Study Display',
    explanation: 'A clean digital clock with 12/24 hour display options, date formatting, and fullscreen mode for desks and study monitors.',
    whenToUse: 'Full-screen desk clock display during study or remote work sessions.',
    howItWorks: 'Synchronizes with local device time via requestAnimationFrame render cycles.',
    privacyExplanation: 'System time is read locally inside your browser.',
    exampleInput: 'Mode: 24-hour, Fullscreen',
    exampleOutput: '[ 14:05:09 ]',
    faqs: [
      { q: 'How do I toggle fullscreen mode?', a: 'Click the Fullscreen button or press the F11 key on your keyboard.' }
    ]
  },
  'lorem-ipsum-generator': {
    heading: 'Lorem Ipsum Placeholder Text Generator',
    explanation: 'Generate dummy placeholder text by words, sentences, or paragraphs in plain text or HTML paragraph formats for layout design.',
    whenToUse: 'Mocking website layouts, testing typography rendering, and designing wireframes.',
    howItWorks: 'Selects words and punctuation patterns from classical Latin passages in browser memory.',
    privacyExplanation: 'Generates text completely client-side.',
    exampleInput: '3 Paragraphs, HTML format',
    exampleOutput: '<p>Lorem ipsum dolor sit amet...</p>',
    faqs: [
      { q: 'Where does Lorem Ipsum originate?', a: 'Lorem Ipsum is derived from sections of Cicero\'s classical work "De Finibus Bonorum et Malorum" written in 45 BC.' }
    ]
  },
  'github-explorer': {
    heading: 'GitHub Repository & Developer Profile Explorer',
    explanation: 'Inspect public GitHub repositories, stars, forks, open issues, commit metrics, and developer profiles in a readable format.',
    whenToUse: 'Quickly evaluate open-source repository health, check license terms, inspect contributor profile metrics, or check latest repository stars.',
    howItWorks: 'Directly queries the public GitHub REST API (api.github.com) from your browser tab and formats repository metadata into structured cards.',
    privacyExplanation: 'Queries are sent directly from your browser to api.github.com. We do not proxy or store your search history.',
    exampleInput: 'Query: vercel/next.js',
    exampleOutput: 'Stars: 125k+, Forks: 27k+, Issues: 2k+, License: MIT',
    technicalDetails: 'Uses public read-only GitHub REST API v3 endpoints. Rate-limited by GitHub to 60 requests per hour per IP address for unauthenticated requests.',
    references: [
      { title: 'GitHub REST API Documentation', url: 'https://docs.github.com/en/rest' }
    ],
    faqs: [
      { q: 'Do I need a GitHub personal access token to use this tool?', a: 'No. This explorer queries public unauthenticated endpoints directly from your browser.' }
    ]
  },
  'weather-forecast': {
    heading: 'Global Weather & Meteorological Metrics',
    explanation: 'Retrieve live global temperatures, apparent feels-like values, wind speeds, humidity, and barometric pressure for any city worldwide.',
    whenToUse: 'Check current weather conditions, compare temperatures across cities, or inspect meteorological pressure and wind data.',
    howItWorks: 'Geocodes the city name via Open-Meteo Geocoding API and retrieves high-resolution numerical weather prediction models directly in the client.',
    privacyExplanation: 'Searches query open-meteo.com endpoints directly. Your device geolocation is not accessed unless you explicitly search a city.',
    exampleInput: 'City: Tokyo',
    exampleOutput: 'Temperature: 24°C, Humidity: 65%, Wind: 12 km/h, Sky: Mainly Clear',
    references: [
      { title: 'Open-Meteo Weather API Documentation', url: 'https://open-meteo.com/en/docs' }
    ],
    faqs: [
      { q: 'How often are weather metrics updated?', a: 'Forecast and atmospheric metrics update hourly using national meteorological weather models (NOAA, ECMWF, DWD).' }
    ]
  },
  'currency-converter': {
    heading: 'Live Currency Converter & Central Bank Exchange Rates',
    explanation: 'Convert world currencies in real-time with official reference exchange rates published daily by the European Central Bank (ECB).',
    whenToUse: 'Calculate international transaction conversions, inspect forex exchange rates, or compare currency pairs (USD, EUR, GBP, JPY, CAD).',
    howItWorks: 'Fetches ECB official reference rates via the open-source Frankfurter API and computes conversion products with floating-point precision.',
    privacyExplanation: 'Conversion calculations execute in your browser against cached daily central bank exchange rates.',
    exampleInput: '100 USD to EUR',
    exampleOutput: '100 USD = 92.45 EUR (Rate: 1 USD = 0.9245 EUR)',
    references: [
      { title: 'European Central Bank Reference Rates', url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html' },
      { title: 'Frankfurter Open Source Exchange Rate API', url: 'https://www.frankfurter.app' }
    ],
    faqs: [
      { q: 'What is the data source for these exchange rates?', a: 'Exchange rates are sourced from official daily currency benchmarks published by the European Central Bank (ECB).' }
    ]
  },
  'country-info': {
    heading: 'Country Profiles & Worldwide Geographical Data',
    explanation: 'Explore comprehensive national profiles, capital cities, population totals, currencies, official languages, and ISO country codes.',
    whenToUse: 'Lookup international phone calling codes, verify official languages, check country borders, or inspect demographic metrics.',
    howItWorks: 'Queries the open-source REST Countries database and formats national attributes into structured metric panels.',
    privacyExplanation: 'Queries are requested directly from restcountries.com with local client memory caching.',
    exampleInput: 'Country: Canada',
    exampleOutput: 'Capital: Ottawa, Population: 38M+, Languages: English, French, Currency: CAD ($)',
    references: [
      { title: 'REST Countries Open API', url: 'https://restcountries.com' }
    ],
    faqs: [
      { q: 'Can I search by 2-letter ISO country codes?', a: 'Yes. You can search by common country names or ISO 3166-1 alpha-2 / alpha-3 codes (such as US, CA, JP, DE, GBR).' }
    ]
  },
  'public-holidays': {
    heading: 'Worldwide Public & Bank Holidays Calendar',
    explanation: 'Inspect national and public bank holiday schedules across 100+ countries by year with official observance dates.',
    whenToUse: 'Plan international project deadlines, check foreign market holiday closures, or verify statutory bank holidays.',
    howItWorks: 'Retrieves official national holiday calendars from the Nager.Date worldwide holiday database API.',
    privacyExplanation: 'Country selections are requested directly from date.nager.at without tracking user schedules.',
    exampleInput: 'Country: United States, Year: 2026',
    exampleOutput: 'Independence Day: 2026-07-04 (Nationwide), Labor Day: 2026-09-07',
    references: [
      { title: 'Nager.Date Public Holiday API Documentation', url: 'https://date.nager.at' }
    ],
    faqs: [
      { q: 'Does this calendar distinguish nationwide vs regional holidays?', a: 'Yes. Observances are flagged as either Nationwide (federal/public) or Regional (state/county specific).' }
    ]
  },
  'astronomy-picture': {
    heading: 'NASA Astronomy Picture of the Day (APOD)',
    explanation: 'Explore official NASA daily cosmic photography, space exploration imagery, and astrophysical explanations written by professional astronomers.',
    whenToUse: 'Explore daily discoveries in astronomy, observe high-resolution deep-space photography, and learn astrophysics concepts.',
    howItWorks: 'Directly fetches NASA daily curated astronomical imagery and explanations from the official NASA Open API.',
    privacyExplanation: 'Requests are sent directly to api.nasa.gov. No search or viewing telemetry is recorded on our servers.',
    exampleInput: 'Daily Request',
    exampleOutput: 'High-definition space photograph with title, copyright, and astrophysicist description',
    references: [
      { title: 'NASA Astronomy Picture of the Day Archive', url: 'https://apod.nasa.gov/apod/' },
      { title: 'NASA Open API Portal', url: 'https://api.nasa.gov' }
    ],
    faqs: [
      { q: 'Who writes the explanations for the astronomy pictures?', a: 'All APOD descriptions are written by professional astronomers and curated by NASA Goddard Space Flight Center.' }
    ]
  },
  'http-status-explorer': {
    heading: 'HTTP Status Code & Response Header Explorer',
    explanation: 'Search and inspect standard IETF RFC 9110 HTTP status codes, meanings, caching behaviors, and developer troubleshooting actions.',
    whenToUse: 'Debug REST API response codes (such as 400, 401, 403, 404, 422, 500, 502), choose semantic HTTP codes for API design, or check cacheability headers.',
    howItWorks: 'Runs completely in your browser memory against a structured RFC 9110 dataset with category filtering and keyword search.',
    privacyExplanation: 'Status code lookups run 100% locally inside your browser memory without any network requests.',
    exampleInput: 'Code: 422',
    exampleOutput: '422 Unprocessable Entity: Client syntax is valid but semantic instructions cannot be processed.',
    technicalDetails: 'Classifies codes into 1xx (Informational), 2xx (Successful), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error) classes according to RFC 9110 specifications.',
    references: [
      { title: 'IETF RFC 9110: HTTP Semantics Section 15', url: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15' }
    ],
    faqs: [
      { q: 'What is the difference between HTTP 401 and HTTP 403?', a: 'HTTP 401 Unauthorized means the client must authenticate itself (missing or invalid credentials), whereas HTTP 403 Forbidden means the server recognizes the identity but denies permission.' }
    ]
  }
};
