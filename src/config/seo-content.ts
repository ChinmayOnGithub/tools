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
  }
};
