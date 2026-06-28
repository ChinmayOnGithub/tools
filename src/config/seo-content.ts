export interface SeoToolContent {
  heading: string;
  explanation: string;
  whenToUse: string;
  howItWorks: string;
  privacyExplanation: string;
  exampleInput: string;
  exampleOutput: string;
  faqs: { q: string; a: string }[];
}

export const SEO_CONTENT_MAP: Record<string, SeoToolContent> = {
  'uuid-generator': {
    heading: 'Universally Unique Identifier (UUID/GUID) Generator',
    explanation: 'A client-side utility to generate RFC4122 version 4 compliant universally unique identifiers (UUIDs) or GUIDs instantly. You can generate multiple IDs, customize character casings, and toggle hyphens.',
    whenToUse: 'Use this generator when you need unique keys for databases, API testing tokens, transaction tracking IDs, or system component session identifiers.',
    howItWorks: 'This tool uses the browser-native cryptographically secure random number generator (Web Crypto API `crypto.getRandomValues`) to ensure random randomness compliant with RFC4122 specifications.',
    privacyExplanation: 'All UUID calculations run strictly inside your browser tab. No requests are sent to servers, ensuring complete privacy of generated identifiers.',
    exampleInput: 'Generate 1 UUID (Uppercase, with Hyphens)',
    exampleOutput: '9B1DE2F8-0D32-475C-9A8B-3FA41829B245',
    faqs: [
      { q: 'What is a UUID version 4?', a: 'A Version 4 UUID is a universally unique identifier generated using random numbers. It contains 122 bits of random data, making collisions statistically impossible.' },
      { q: 'Is a UUID the same as a GUID?', a: 'Yes. GUID is Microsoft\'s terminology for UUID. They both conform to the same formatting structure.' }
    ]
  },
  'json-formatter': {
    heading: 'JSON Formatter, Validator & Minifier',
    explanation: 'Format, validate, beautify, and minify your JSON data in real-time. Features lightweight syntax highlighting, copy-paste, error highlighting, and file download support.',
    whenToUse: 'Use this tool when debugging API responses, formatting nested configurations, or validating raw JSON payloads for syntax errors.',
    howItWorks: 'The JSON content is parsed via standard JavaScript compilers. Invalids trigger location-based syntax error indicators, highlighting precise lines and columns.',
    privacyExplanation: 'No data leaves your device. All parsing, validation, formatting, and file exports occur inside your local browser memory.',
    exampleInput: '{"user":"john","roles":["admin","user"]}',
    exampleOutput: '{\n  "user": "john",\n  "roles": [\n    "admin",\n    "user"\n  ]\n}',
    faqs: [
      { q: 'How does the JSON validator detect errors?', a: 'It compiles inputs using standard JSON.parse hooks, intercepting location details when syntax parsing failures occur.' },
      { q: 'Can I upload files to format?', a: 'Yes. You can upload files under 5MB, which are processed entirely client-side using browser FileReader APIs.' }
    ]
  },
  'word-counter': {
    heading: 'Live Text Statistics & Word Counter',
    explanation: 'Analyze text statistics in real-time. Counts words, characters, characters without spaces, paragraphs, sentences, estimated reading times, and speaking times.',
    whenToUse: 'Perfect for content writers, students, developers writing documentation, or editors reviewing copy lengths against character limits.',
    howItWorks: 'Calculates metrics using regular expression dividers (whitespace delimiters for words, period/punctuation groupings for sentences, and double carriage returns for paragraphs).',
    privacyExplanation: 'Your text remains entirely on your device. We do not store, log, or transmit any character strings.',
    exampleInput: 'Hello world. This is a secure browser word counter.',
    exampleOutput: 'Words: 9\nCharacters: 52\nSentences: 2\nParagraphs: 1\nReading Time: 3 sec',
    faqs: [
      { q: 'What speeds are used to calculate reading times?', a: 'We employ standard benchmarks of 200 words per minute (WPM) for reading times and 130 WPM for speaking times.' },
      { q: 'Does this count support symbols?', a: 'Yes. Word dividers filter out stray symbols to ensure accurate word counts.' }
    ]
  },
  'base64-converter': {
    heading: 'Base64 Text and File Encoder & Decoder',
    explanation: 'Encode strings into Base64 formats, decode Base64 back into raw text, or convert files into downloadable binary streams locally in your browser tab.',
    whenToUse: 'Ideal for decoding base64-encoded email payloads, encoding basic authentication credentials, or formatting images/files into base64 data URLs.',
    howItWorks: 'Utilizes browser-native `btoa` and `atob` binaries. Large files use FileReader stream buffers to convert files up to 5MB.',
    privacyExplanation: 'Everything is processed inside your local web browser tab. No files are uploaded to any servers.',
    exampleInput: 'CoolTools',
    exampleOutput: 'Q29vbFRvb2xz',
    faqs: [
      { q: 'What is Base64?', a: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format, commonly used for data transmission over text channels.' },
      { q: 'Can I convert images to Base64?', a: 'Yes. Small images and text files can be uploaded and converted to Base64 code formats securely.' }
    ]
  },
  'url-encoder': {
    heading: 'URL Encoder / Decoder Utility',
    explanation: 'Encode special characters into URL-safe formats or decode percent-encoded strings back to standard human-readable text.',
    whenToUse: 'Use this tool when formatting query parameters, resolving query parameters in analytics paths, or cleaning URL strings for HTTP requests.',
    howItWorks: 'Leverages browser-native `encodeURIComponent` and `decodeURIComponent` modules for secure conversions.',
    privacyExplanation: 'URLs are processed instantly in your tab. We never log url queries, ensuring complete data privacy.',
    exampleInput: 'user name=john&admin=true',
    exampleOutput: 'user%20name%3Djohn%26admin%3Dtrue',
    faqs: [
      { q: 'Why do URLs need encoding?', a: 'URLs can only contain certain safe ASCII characters. Special characters like spaces or symbols must be percent-encoded to prevent server parsing errors.' },
      { q: 'Is there a limit on query length?', a: 'We restrict local processing to 2MB to keep performance fast.' }
    ]
  },
  'password-generator': {
    heading: 'Random Secure Password Generator',
    explanation: 'Generate cryptographically secure random passwords. Customize lengths, include uppercase, lowercase, numbers, symbols, and configure options to exclude similar or ambiguous characters.',
    whenToUse: 'Use this tool whenever creating new user accounts, updating old credentials, or generating server API key secrets.',
    howItWorks: 'Uses browser-native `crypto.getRandomValues` to select characters randomly, ensuring high entropy resistant to dictionary attacks.',
    privacyExplanation: 'Your passwords are generated locally inside your web browser. No credentials leave your device.',
    exampleInput: '16 characters, Numbers, Symbols',
    exampleOutput: 'x9&fA$kL2#pQ!z7*',
    faqs: [
      { q: 'What makes a password cryptographically secure?', a: 'Using random character pools selected using hardware entropy sources (like standard browser crypto API) instead of pseudo-random algorithms.' },
      { q: 'How many passwords can I generate at once?', a: 'You can generate up to 50 passwords in a single batch.' }
    ]
  },
  'jwt-decoder': {
    heading: 'JSON Web Token (JWT) Decoder & Viewer',
    explanation: 'Decode JSON Web Tokens (JWT) client-side to inspect header metadata, payload claims, signature parts, and claim dates.',
    whenToUse: 'Use when debugging API token authorization headers, verifying user claims, or inspecting expiration times.',
    howItWorks: 'Splits the JWT string into Header, Payload, and Signature, then base64url decodes them to format readable JSON trees.',
    privacyExplanation: 'Tokens never leave your device. Decoding happens in the sandbox. Your secrets remain secure.',
    exampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    exampleOutput: 'Header: {"alg":"HS256","typ":"JWT"}\nPayload: {"sub":"1234567890","name":"John Doe","admin":true}',
    faqs: [
      { q: 'Does this verify the JWT signature?', a: 'No, this is a decoder/viewer only. Signature verification requires server keys.' },
      { q: 'Can I decode expired tokens?', a: 'Yes. Expiration dates are parsed and highlighted relative to current browser times.' }
    ]
  },
  'hash-generator': {
    heading: 'Cryptographic Hash Checksum Generator',
    explanation: 'Calculate cryptographic MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from input strings locally.',
    whenToUse: 'Verify data integrity, check checksums, or encode sensitive keys into static digests.',
    howItWorks: 'Uses Web Crypto subtle API (`crypto.subtle.digest`) for SHA family digests, and a custom pure-JS MD5 hashing algorithm.',
    privacyExplanation: 'Calculations occur locally. Text inputs are processed client-side with no network transfers.',
    exampleInput: 'hello',
    exampleOutput: 'SHA-256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    faqs: [
      { q: 'Is MD5 secure?', a: 'MD5 is cryptographically broken and should not be used for security purposes, but it remains widely used for basic file validation.' },
      { q: 'Which algorithm is recommended?', a: 'SHA-256 or SHA-512 are recommended for modern security.' }
    ]
  },
  'case-converter': {
    heading: 'Multi-Format Text Case Converter',
    explanation: 'Convert text case formatting styles between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, Train-Case, and dot.case.',
    whenToUse: 'Helpful for formatting titles, coding variables, query names, or normalizing database tables.',
    howItWorks: 'Splits strings using boundary selectors and rebuilds them with custom delimiters and capitalization maps.',
    privacyExplanation: 'Text casing runs entirely client-side. Zero keystrokes are recorded or sent.',
    exampleInput: 'hello world',
    exampleOutput: 'Title Case: Hello World\ncamelCase: helloWorld\nsnake_case: hello_world',
    faqs: [
      { q: 'What is Train-Case?', a: 'Train-Case capitalizes the first letter of each word and separates them with hyphens, similar to HTTP header names.' },
      { q: 'Does it preserve spacing?', a: 'Sentence and Title Case preserveSpacing, while coding cases normalize spaces into punctuation delimiters.' }
    ]
  },
  'remove-duplicate-lines': {
    heading: 'List Cleaner & Duplicate Line Remover',
    explanation: 'Remove repeating rows from list datasets. Configures case sensitivity, line whitespace trims, and alphabetical sorting.',
    whenToUse: 'Clean email indexes, deduplicate keyword arrays, format CSV registers, or clean lists before coding integrations.',
    howItWorks: 'Normalizes lines and matches them against a uniqueness Set, maintaining original list structures.',
    privacyExplanation: 'All list filtering runs locally. List entries are never sent to external servers.',
    exampleInput: 'apple\nbanana\napple',
    exampleOutput: 'apple\nbanana',
    faqs: [
      { q: 'Does it show statistics?', a: 'Yes. It displays a summary detailing the exact count of repeating lines removed.' },
      { q: 'What does Trim Whitespace do?', a: 'Trims spaces from the start and end of rows before evaluating uniqueness.' }
    ]
  },
  'lorem-ipsum-generator': {
    heading: 'Lorem Ipsum Placeholder Text Generator',
    explanation: 'Generate custom dummy placeholder text in words, sentences, or paragraphs, formatted as plain text or HTML paragraph tags.',
    whenToUse: 'Use when mocking layouts, testing font choices, or creating visual designs for web applications.',
    howItWorks: 'Uses a random vocabulary picker from classic lorem ipsum passages to construct sentences of varying lengths.',
    privacyExplanation: 'Generates text locally. Completely private, offline-capable dummy generator.',
    exampleInput: '3 Paragraphs, HTML format',
    exampleOutput: '<p>Lorem ipsum dolor sit amet...</p>',
    faqs: [
      { q: 'What is the origin of Lorem Ipsum?', a: 'Lorem Ipsum is derived from Cicero\'s classical Latin literature from 45 BC.' },
      { q: 'Can I copy HTML tags directly?', a: 'Yes. The HTML format wraps lines in standard paragraph tags, ready for page mockups.' }
    ]
  },
  'pomodoro-timer': {
    heading: 'Pomodoro Focus Timer & Productivity Workstation',
    explanation: 'Improve focus and productivity using the Pomodoro technique. Configures customizable focus slots, short breaks, long breaks, and long break intervals.',
    whenToUse: 'Excellent for deep focus blocks, writing, coding sessions, task planning, or study routines.',
    howItWorks: 'Implements an SVG circular progress ring and countdown timer using requestAnimationFrame hooks. Play alerts use browser-native Web Audio API bells.',
    privacyExplanation: 'All configs, timer counts, and session stats are stored locally in localStorage. No tracking data leaves your tab.',
    exampleInput: '25 Min Focus, 5 Min Short Break',
    exampleOutput: '[25:00] Focus Countdown',
    faqs: [
      { q: 'Are audio bell chimes safe to run in background?', a: 'Yes. Web Audio API synthesizers play bell double chimes even if your browser tab runs in the background.' },
      { q: 'What are the keyboard shortcuts?', a: 'Use Space to Play/Pause, R to Reset, S to Skip, and F to enter/exit Fullscreen mode.' }
    ]
  },
  'pdf-merge': {
    heading: 'Secure PDF Document Merger',
    explanation: 'A client-side browser-native tool to combine multiple PDF files into a single document. Reorder document pages easily before merging.',
    whenToUse: 'Ideal for combining split reports, merging scanned pages, compiling legal forms, or consolidating project PDFs.',
    howItWorks: 'Utilizes the pdf-lib library to load the binary arrays of selected files, copies all pages sequentially, and saves them into a new compiled PDF in local memory.',
    privacyExplanation: 'Documents are processed strictly inside your browser sandbox. No PDF data leaves your machine or is uploaded to servers.',
    exampleInput: 'Upload: report_p1.pdf (2 pages), report_p2.pdf (3 pages)',
    exampleOutput: 'Download: merged_document.pdf (5 pages total)',
    faqs: [
      { q: 'Can I reorder PDF files before merging?', a: 'Yes. Drag and drop file items in the list to rearrange the merge order, or use the accessible Up/Down buttons.' },
      { q: 'Is there a file count limit?', a: 'Since files compile locally, we recommend merging up to 15 PDFs at a time to prevent browser memory limit errors.' }
    ]
  },
  'pdf-split': {
    heading: 'Secure PDF Page Splitter & Extractor',
    explanation: 'Split PDF files by individual pages, extract custom page ranges, or export specific pages as a sub-document.',
    whenToUse: 'Perfect for extracting specific sheets from large reports, dividing documents for sharing, or cropping PDF pages.',
    howItWorks: 'Parses range inputs (e.g. 1-3, 5), matches them to 0-indexed page keys, copies matching items into a new document buffer, and outputs downloadable PDFs.',
    privacyExplanation: 'All splits run locally. No documents are uploaded or processed externally.',
    exampleInput: 'File: invoice.pdf (5 pages), Range input: "1-2, 5"',
    exampleOutput: 'Download: invoice_extracted.pdf (pages 1, 2, 5 only)',
    faqs: [
      { q: 'How do I specify range configurations?', a: 'Input single pages or hyphens for continuous page ranges (e.g. 1-4, 6), separated by commas.' },
      { q: 'What happens if I split every page?', a: 'The tool splits the document page by page and displays separate download links for each page.' }
    ]
  },
  'pdf-compress': {
    heading: 'Secure PDF Document Compressor & Optimizer',
    explanation: 'Reduce the file size of your PDF documents locally using next-generation object stream serialization.',
    whenToUse: 'Great for decreasing email attachments, cleaning duplicate stream blocks, or saving drive spaces.',
    howItWorks: 'Uses pdf-lib to copy page trees to a new clean container, stripping redundant headers and metadata in local memory.',
    privacyExplanation: 'All compression operations execute locally in your web browser. Zero server logs or file storage.',
    exampleInput: 'Upload: document.pdf (4.5 MB)',
    exampleOutput: 'Download: document_compressed.pdf (3.1 MB - 31% reduction)',
    faqs: [
      { q: 'Will my image resolutions be reduced?', a: 'No. The compressor cleans file structures rather than heavily compressing image layers, keeping document readability.' },
      { q: 'Is there a file size limit?', a: 'We recommend uploading PDFs under 20MB for fast in-browser rendering.' }
    ]
  },
  'images-to-pdf': {
    heading: 'Secure Images to PDF Document Compiler',
    explanation: 'Compile PNG, JPG, or WebP images into a single PDF document locally. Arrange page order easily.',
    whenToUse: 'Perfect for compiling photo slides, scanning paperwork, or joining multiple receipts into one PDF.',
    howItWorks: 'Draws incompatible image formats to Canvas to serialize as JPEGs/PNGs, then embeds them on PDF pages.',
    privacyExplanation: 'Everything compiles locally in your web browser sandbox. No file uploads.',
    exampleInput: 'Upload: slide1.png, slide2.jpg (arranged)',
    exampleOutput: 'Download: images_compiled.pdf (2 pages)',
    faqs: [
      { q: 'Are all image formats supported?', a: 'Yes. PNG, JPEG, WebP, SVG, and GIF are supported and auto-converted if necessary.' },
      { q: 'Can I reorder the images?', a: 'Yes. Drag and drop items in the list to rearrange the page sequence.' }
    ]
  },
  'image-compressor': {
    heading: 'Secure Client-Side Image Compressor & Size Optimizer',
    explanation: 'Compress and optimize sizes of JPG, PNG, and WebP images client-side.',
    whenToUse: 'Great for web assets, email attachments, and profile picture optimization.',
    howItWorks: 'Uses Canvas API to serialize image arrays at custom quality levels and max dimensions.',
    privacyExplanation: 'Processed entirely locally. Your images never leave your system.',
    exampleInput: 'Upload: photo.jpg (2.8 MB) at 80% quality',
    exampleOutput: 'Download: photo_compressed.jpg (650 KB - 76% reduction)',
    faqs: [
      { q: 'How does it compress PNGs?', a: 'PNGs can be converted to JPEGs or compressed at custom scales to significantly reduce sizes.' },
      { q: 'Is there a processing limit?', a: 'No, you can compress as many images as you like offline.' }
    ]
  },
  'image-resizer': {
    heading: 'Secure Client-Side Image Resizer',
    explanation: 'Adjust dimensions of PNG, JPG, and WebP images maintaining aspect ratios.',
    whenToUse: 'Ideal for resizing banners, icons, or photo prints to exact pixel widths.',
    howItWorks: 'Draws images on Canvas contexts set to your custom dimensions and downloads the output.',
    privacyExplanation: 'Dimensions are adjusted in your browser. Complete data privacy.',
    exampleInput: 'Dimensions: 1920x1080 -> 1280x720 (aspect locked)',
    exampleOutput: 'Download: photo_resized.png (1280x720px)',
    faqs: [
      { q: 'How does aspect ratio locking work?', a: 'When locked, changing the width automatically recalculates the height proportionally.' },
      { q: 'Does resizing degrade quality?', a: 'Resizing down scales cleanly, while scaling up can result in pixelation.' }
    ]
  },
  'image-format-converter': {
    heading: 'Secure Client-Side Image Format Converter',
    explanation: 'Convert images between PNG, JPEG, and WebP formats instantly.',
    whenToUse: 'Great for Web development, converting Apple HEIC/PNG snapshots to WebP, or JPGs to PNGs.',
    howItWorks: 'Canvas context draws the image buffer and outputs a blob in the selected target format.',
    privacyExplanation: 'No format data is sent to external servers. Safe, fast, and local.',
    exampleInput: 'Convert: screenshot.png -> Target: WEBP',
    exampleOutput: 'Download: screenshot_converted.webp',
    faqs: [
      { q: 'Does WebP conversion save space?', a: 'Yes. WebP format yields 25%-30% smaller files than JPEGs while keeping high quality.' },
      { q: 'Can I batch convert images?', a: 'Yes. Select multiple files and convert them all to your target format in one click.' }
    ]
  },
  'image-cropper': {
    heading: 'Secure Client-Side Image Cropping Utility',
    explanation: 'Crop image files to custom rectangular areas securely.',
    whenToUse: 'Perfect for cropping faces, removing borders, or focusing on image details.',
    howItWorks: 'Calculates scaled offsets from sliders and crops natural pixel boundaries using Canvas.',
    privacyExplanation: 'Cropping runs offline in your web browser. No data leaves your machine.',
    exampleInput: 'Input: photo.png, Sliders: Crop X offset, custom widths',
    exampleOutput: 'Download: photo_cropped.png',
    faqs: [
      { q: 'Is this mobile friendly?', a: 'Yes. The slider controls work perfectly on mobile touchscreens without drag issues.' },
      { q: 'Is original quality preserved?', a: 'Yes. Coordinates scale to natural pixels for a lossless crop.' }
    ]
  },
  'fullscreen-clock': {
    heading: 'Fullscreen Digital Clock & Study workstation',
    explanation: 'A beautiful digital clock for study desks, focus spaces, and fullscreens.',
    whenToUse: 'Perfect for desk monitors, library study sessions, and workspace clocks.',
    howItWorks: 'Runs an update cycle using requestAnimationFrame synchronized with system time.',
    privacyExplanation: 'System time is checked locally in-browser. No tracking logs.',
    exampleInput: 'Settings: 24-hour, show seconds, show date',
    exampleOutput: '[14:05:09] Displayed Fullscreen',
    faqs: [
      { q: 'How do I toggle fullscreen?', a: 'Click the button or press F11. Press Escape to exit.' },
      { q: 'Does it support dark themes?', a: 'Yes. The clock inherits your platform theme settings automatically.' }
    ]
  },
  'stopwatch': {
    heading: 'High-Precision Stopwatch & Lap Timer',
    explanation: 'Track elapsed duration with sub-millisecond precision and lap splits.',
    whenToUse: 'Ideal for workout timing, code performance audits, or event tracking.',
    howItWorks: 'Measures high-resolution intervals using performance.now() and logs lap results.',
    privacyExplanation: 'Laps and times are kept in transient React states. No data is stored or uploaded.',
    exampleInput: 'Click Start, Lap, Lap, Stop',
    exampleOutput: 'List: Lap #1 00:04.12, Total 00:08.24',
    faqs: [
      { q: 'How accurate is the stopwatch?', a: 'It utilizes performance.now() to measure intervals with microsecond resolution.' },
      { q: 'Can I export lap tables?', a: 'Yes. You can copy the clean HTML table entries directly.' }
    ]
  },
  'countdown-timer': {
    heading: 'Countdown Timer & Audio Alarm Chime',
    explanation: 'Configure countdown timers with custom hours, minutes, and alarm notifications.',
    whenToUse: 'Great for cooking, study blocks, presentation timings, or focus slots.',
    howItWorks: 'Decrements counts relative to system timestamps and plays synthesized sound bells.',
    privacyExplanation: 'Audios are generated on-the-fly via Web Audio API. No external fetches.',
    exampleInput: 'Timer values: 1 Hour, 15 Minutes',
    exampleOutput: '[01:15:00] Countdown with double bells at zero',
    faqs: [
      { q: 'Will the alarm play in background tabs?', a: 'Yes. Web Audio API plays chimes even when the tab is backgrounded.' },
      { q: 'Are cookies used for settings?', a: 'No, everything is transient client-side states.' }
    ]
  },
  'qr-generator': {
    heading: 'Secure Client-Side QR Code Generator',
    explanation: 'Create customizable QR codes from text or URL parameters instantly.',
    whenToUse: 'Perfect for sharing links, printing cards, or encoding Wi-Fi details.',
    howItWorks: 'Uses the qrcode library to build matrix grids and render them on Canvas elements.',
    privacyExplanation: 'QR codes are rendered locally. Your text strings are never uploaded.',
    exampleInput: 'URL: https://tools.chinmaypatil.com, colors: fg #000, bg #fff',
    exampleOutput: 'Download: qrcode.png (256x256px)',
    faqs: [
      { q: 'Can I customize QR colors?', a: 'Yes. You can configure custom foreground and background colors.' },
      { q: 'Can QR codes be scanned on any device?', a: 'Yes, our generated QR codes follow the official standard specifications.' }
    ]
  },
  'barcode-generator': {
    heading: 'Secure Client-Side Barcode Generator',
    explanation: 'Generate CODE128, EAN13, EAN8, and UPC barcodes as vector SVGs.',
    whenToUse: 'Ideal for product tagging, inventory systems, or retail scan tests.',
    howItWorks: 'Integrates jsbarcode to construct standard barcode structures as vector paths.',
    privacyExplanation: 'Code strings are processed entirely in-browser. Zero server calls.',
    exampleInput: 'Format: EAN13, Code: 1234567890128',
    exampleOutput: 'Download: barcode_1234567890128.svg',
    faqs: [
      { q: 'Why download as SVG?', a: 'SVGs are vectors, meaning they print cleanly at any scale without pixelating.' },
      { q: 'Are retail checksums verified?', a: 'Yes. EAN13 and EAN8 validate numeric structures before rendering.' }
    ]
  },
  'color-picker': {
    heading: 'Secure Color Picker & Palette Generator',
    explanation: 'Pick colors, inspect HSL/RGB/HEX values, and generate harmonies.',
    whenToUse: 'Perfect for UI design, CSS styling, brand coloring, or theme picking.',
    howItWorks: 'Reads standard hex/rgb parameters and calculates HSL complementary shifts.',
    privacyExplanation: 'Color selections and palettes are computed locally. No data leaves your machine.',
    exampleInput: 'Color: #6366f1 (Indigo)',
    exampleOutput: 'Analogous: #3b82f6, #6366f1, #a855f7. Click-to-copy enabled.',
    faqs: [
      { q: 'How do I copy color codes?', a: 'Click the copy icon next to any value, or click directly on any palette swatch.' },
      { q: 'What harmonies are supported?', a: 'Analogous, complementary, triadic, and monochromatic palettes.' }
    ]
  },
  'unit-converter': {
    heading: 'Secure Universal Unit Converter',
    explanation: 'Convert metric and imperial units for Length, Weight, Temperature, Area, Volume, Time, and Speed.',
    whenToUse: 'Great for engineering, recipes, math studies, or travel calculations.',
    howItWorks: 'Applies conversion factor ratios and temperature offset formulas client-side.',
    privacyExplanation: 'Calculations run in-browser. Fast, offline, and completely private.',
    exampleInput: 'Category: Length, Value: 5, From: km, To: m',
    exampleOutput: 'Result: 5000 m',
    faqs: [
      { q: 'Are imperial units supported?', a: 'Yes. Feet, inches, yards, miles, pounds, ounces, gallons, and quarts are supported.' },
      { q: 'Does it work offline?', a: 'Yes! All unit calculators are loaded in your browser memory and work 100% offline.' }
    ]
  }
};
