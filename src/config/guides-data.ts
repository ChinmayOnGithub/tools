export interface GuideExample {
  title: string;
  invalid?: string;
  reason?: string;
  validFix: string;
  language?: string;
}

export interface GuideReference {
  title: string;
  url: string;
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  cluster: 'json' | 'jwt' | 'unicode' | 'timestamp' | 'pdf' | 'api';
  clusterName: string;
  problemStatement: string;
  shortAnswer: string;
  technicalReason: string;
  examples: GuideExample[];
  commonMistakes: string[];
  limitations: string[];
  references: GuideReference[];
  primaryToolId: string;
  relatedToolIds: string[];
  workflowSlug?: string;
  samplePayload?: string;
  updatedAt: string;
  readTime: string;
}

export interface WorkflowGuide {
  id: string;
  slug: string;
  title: string;
  description: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    toolId: string;
    tips: string;
  }>;
  relatedGuides: string[];
  updatedAt: string;
}

export const GUIDES_ARTICLES: GuideArticle[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // CLUSTER 1: JSON GUIDES (5)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'why-json-parse-fails-syntax-errors',
    slug: 'why-json-parse-fails-syntax-errors',
    title: 'Why JSON.parse() Fails: Common JSON Syntax Errors',
    shortDescription: 'Identify and fix the most frequent syntax mistakes that cause JavaScript JSON.parse() to throw SyntaxError exceptions.',
    cluster: 'json',
    clusterName: 'JSON & Data Serialization',
    problemStatement: 'Developers frequently copy data payloads from APIs, console logs, or config files into JavaScript applications only to hit unexpected "SyntaxError: Unexpected token in JSON at position X" runtime crashes.',
    shortAnswer: 'JSON syntax is strictly defined by RFC 8259. Unlike JavaScript object literals, JSON mandates double quotes for all keys and strings, forbids trailing commas, disallows comments, and requires standard escaping for control characters.',
    technicalReason: 'JSON is an interchangeable data interchange format, not an executable script. The browser\'s native JSON parser operates as a strict deterministic state machine. If an unexpected token (like single quotes or a comma before a closing bracket) is encountered, the parser halts immediately to prevent ambiguous data deserialization.',
    examples: [
      {
        title: 'Single Quotes vs Double Quotes',
        invalid: `{\n  'userId': 104,\n  'status': 'active'\n}`,
        reason: "RFC 8259 Section 7 requires string literals and property names to be wrapped in double quotes (\"). Single quotes (') are illegal in JSON.",
        validFix: `{\n  "userId": 104,\n  "status": "active"\n}`,
        language: 'json',
      },
      {
        title: 'Unquoted Property Keys',
        invalid: `{\n  name: "Alice",\n  role: "admin"\n}`,
        reason: 'JavaScript object literal shorthand allows unquoted identifiers, but JSON requires explicit double-quoted key names.',
        validFix: `{\n  "name": "Alice",\n  "role": "admin"\n}`,
        language: 'json',
      },
      {
        title: 'Trailing Commas After Last Element',
        invalid: `[\n  "alpha",\n  "beta",\n  "gamma",\n]`,
        reason: 'A comma indicates a subsequent element follows. A trailing comma leaves the parser expecting another value before array closing.',
        validFix: `[\n  "alpha",\n  "beta",\n  "gamma"\n]`,
        language: 'json',
      },
    ],
    commonMistakes: [
      'Copying raw JavaScript objects or console.log outputs directly into JSON files without serialization.',
      'Leaving trailing commas when deleting the last item in a multi-line array or object.',
      'Using unescaped line breaks or literal tab characters inside string values.',
      'Assuming JavaScript undefined or functions can be represented in JSON (they are omitted or cause serialization errors).',
    ],
    limitations: [
      'Browser memory limits JSON.parse() payload size (typically 50MB–200MB depending on V8 string heap).',
      'Numbers exceeding Number.MAX_SAFE_INTEGER (9007199254740991) lose precision during native JSON.parse().',
    ],
    references: [
      { title: 'IETF RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format', url: 'https://datatracker.ietf.org/doc/html/rfc8259' },
      { title: 'ECMA-404: The JSON Data Interchange Syntax', url: 'https://www.ecma-international.org/publications-and-standards/standards/ecma-404/' },
      { title: 'MDN Web Docs: JSON.parse()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse' },
    ],
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter', 'unicode-inspector'],
    workflowSlug: 'developer-data-debugging',
    samplePayload: `{\n  'errorExample': true,\n  items: [1, 2, 3,]\n}`,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'json-trailing-commas',
    slug: 'json-trailing-commas',
    title: 'JSON Trailing Commas: Why They Fail and How to Fix Them',
    shortDescription: 'Learn why trailing commas are illegal in standard JSON specifications and how to eliminate them before parser crashes.',
    cluster: 'json',
    clusterName: 'JSON & Data Serialization',
    problemStatement: 'Modern JavaScript (ES2017+) and TypeScript allow trailing commas in objects and arrays for clean git diffs, leading developers to mistakenly expect JSON parsers to accept them.',
    shortAnswer: 'Strict JSON (RFC 8259) does not allow trailing commas after the final key-value pair or array element. Always remove the final comma before closing braces `}` or brackets `]`.',
    technicalReason: 'JSON is designed for minimal implementation complexity across dozens of programming languages (C, Python, Java, Rust, Go). Allowing optional dangling commas would require every parser implementation to introduce backtracking or lookahead grammar rules.',
    examples: [
      {
        title: 'Object with Trailing Comma',
        invalid: `{\n  "title": "Senior Engineer",\n  "department": "Infrastructure",\n}`,
        reason: 'The comma after "Infrastructure" signals a key name must follow, but the object terminates with } instead.',
        validFix: `{\n  "title": "Senior Engineer",\n  "department": "Infrastructure"\n}`,
        language: 'json',
      },
      {
        title: 'Nested Array Trailing Comma',
        invalid: `{\n  "tags": [\n    "frontend",\n    "react",\n  ]\n}`,
        reason: 'Trailing comma after "react" breaks array grammar.',
        validFix: `{\n  "tags": [\n    "frontend",\n    "react"\n  ]\n}`,
        language: 'json',
      },
    ],
    commonMistakes: [
      'Relying on JSON5 or JSONC settings in VS Code (tsconfig.json, package.json) and expecting standard API endpoints to accept trailing commas.',
      'Automated code generation scripts printing loop items with commas without trimming the final iteration.',
    ],
    limitations: [
      'Some modern tools support relaxed JSON (JSON5, Hjson), but production HTTP REST APIs expecting application/json will reject them with 400 Bad Request.',
    ],
    references: [
      { title: 'RFC 8259 Grammar Specification', url: 'https://datatracker.ietf.org/doc/html/rfc8259#section-5' },
    ],
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter'],
    workflowSlug: 'developer-data-debugging',
    samplePayload: `{\n  "name": "Alex",\n  "active": true,\n}`,
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
  {
    id: 'json-vs-javascript-objects',
    slug: 'json-vs-javascript-objects',
    title: 'JSON vs JavaScript Objects: What is the Difference?',
    shortDescription: 'Understand the critical architectural differences between executable JavaScript memory objects and serialized JSON text.',
    cluster: 'json',
    clusterName: 'JSON & Data Serialization',
    problemStatement: 'Many developers conflate JavaScript object literals (`{ key: value }`) with JSON, causing syntax confusion, serialization data loss, and prototype pollution bugs.',
    shortAnswer: 'A JavaScript object is an in-memory runtime data structure that can hold functions, symbols, and references. JSON is a plain text serialization format with strict syntax rules.',
    technicalReason: 'JSON is language-agnostic text. JavaScript objects exist only within the V8/runtime heap. When `JSON.stringify(obj)` executes, functions, `undefined`, and Symbols are stripped out because JSON only supports strings, numbers, booleans, null, arrays, and objects.',
    examples: [
      {
        title: 'JavaScript Object Literal (Runtime Memory)',
        validFix: `// JavaScript In-Memory Object\nconst user = {\n  id: 42,\n  name: 'Dev',\n  greet: () => 'Hello',\n  createdAt: new Date(),\n  token: undefined\n};`,
        reason: 'Supports functions, dates, undefined, unquoted keys, and single quotes.',
        language: 'javascript',
      },
      {
        title: 'Serialized JSON Representation (Text)',
        validFix: `{\n  "id": 42,\n  "name": "Dev",\n  "createdAt": "2026-08-30T16:00:00.000Z"\n}`,
        reason: 'Notice that greet() and token (undefined) were removed, keys are strictly double-quoted, and the Date became an ISO string.',
        language: 'json',
      },
    ],
    commonMistakes: [
      'Expecting `JSON.stringify()` to preserve `undefined` values in object properties (they are silently dropped).',
      'Expecting `JSON.stringify()` to serialize functions or circular references (circular references throw TypeError).',
      'Thinking comments (`//` or `/* */`) are allowed in JSON files.',
    ],
    limitations: [
      'JSON cannot serialize `BigInt` without custom replacer functions (throws TypeError: Do not know how to serialize a BigInt).',
    ],
    references: [
      { title: 'MDN: JSON Specification Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON' },
    ],
    primaryToolId: 'json-formatter',
    relatedToolIds: ['json-validator'],
    samplePayload: `{\n  "description": "Valid double-quoted JSON",\n  "count": 10\n}`,
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'how-to-validate-large-json-files',
    slug: 'how-to-validate-large-json-files',
    title: 'How to Validate Large JSON Files in the Browser',
    shortDescription: 'Techniques and memory limits for checking multi-megabyte JSON payloads client-side without crashing your browser tab.',
    cluster: 'json',
    clusterName: 'JSON & Data Serialization',
    problemStatement: 'Validating 10MB–100MB database exports or API dump files in online editors often causes the browser to freeze or crash with "Out of Memory" errors.',
    shortAnswer: 'Large JSON files must be processed with chunked reading or local web workers. For files under 50MB, local in-browser validators check syntax without transmitting megabytes across the network.',
    technicalReason: 'When a browser processes a JSON string, it consumes memory for: 1) the raw string, 2) the DOM textarea representation, and 3) the instantiated JavaScript object tree. A 20MB JSON file can easily demand 80MB–120MB of V8 heap memory.',
    examples: [
      {
        title: 'Clean Structural Validation Strategy',
        validFix: `// Safe client-side validation check\ntry {\n  const parsed = JSON.parse(inputString);\n  console.log("Valid JSON with keys:", Object.keys(parsed).length);\n} catch (e) {\n  console.error("SyntaxError at position:", e.message);\n}`,
        reason: 'Avoid pretty-printing 50MB payloads into the DOM all at once; check validity first before formatting.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Pasting 100MB of JSON into a live-rendering syntax highlighter that recalculates DOM nodes on every keystroke.',
      'Uploading private database JSON dumps to unknown third-party cloud servers.',
    ],
    limitations: [
      'Client-side V8 engines have max string length caps (~512MB on 64-bit systems). Browser tabs are constrained to ~2GB total memory.',
    ],
    references: [
      { title: 'V8 Memory Management & Max String Length Limits', url: 'https://v8.dev/blog' },
    ],
    primaryToolId: 'json-validator',
    relatedToolIds: ['json-formatter'],
    workflowSlug: 'developer-data-debugging',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'json-escaping-explained',
    slug: 'json-escaping-explained',
    title: 'JSON Escaping Explained: Quotes, Backslashes & Unicode Escapes',
    shortDescription: 'Master JSON string escaping rules for double quotes, control characters, tabs, newlines, and Unicode code points.',
    cluster: 'json',
    clusterName: 'JSON & Data Serialization',
    problemStatement: 'Embedding raw quotes, file paths with backslashes (`C:\\Users`), or raw newlines inside JSON strings triggers parse errors.',
    shortAnswer: 'In JSON strings, literal double quotes must be escaped as `\\"`, backslashes as `\\\\`, newlines as `\\n`, tabs as `\\t`, and special Unicode characters as `\\uXXXX`.',
    technicalReason: 'RFC 8259 Section 7 reserves the backslash (`\\`) character as the escape prefix. Unescaped control characters (ASCII 0–31) are strictly prohibited inside JSON string literals.',
    examples: [
      {
        title: 'Unescaped Windows File Path',
        invalid: `{\n  "path": "C:\\Users\\admin\\documents"\n}`,
        reason: 'The single backslash in \\Users or \\documents is treated as an invalid escape sequence (\\U is not standard JSON escape).',
        validFix: `{\n  "path": "C:\\\\Users\\\\admin\\\\documents"\n}`,
        language: 'json',
      },
      {
        title: 'Unescaped Double Quotes Inside String',
        invalid: `{\n  "quote": "He said "Hello" to me"\n}`,
        reason: 'The inner quotes terminate the string early, causing a syntax crash on "Hello".',
        validFix: `{\n  "quote": "He said \\"Hello\\" to me"\n}`,
        language: 'json',
      },
    ],
    commonMistakes: [
      'Forgetting that a backslash in a regular expression or file path needs double escaping in JSON (`\\\\`).',
      'Pasting multiline text with raw carriage returns without converting them to `\\n`.',
    ],
    limitations: [
      'JSON does not support hex escapes like `\\x20` or octal escapes like `\\012`. Only 4-digit Unicode hex escapes `\\uXXXX` are legal.',
    ],
    references: [
      { title: 'RFC 8259 Section 7: Strings and Escaping', url: 'https://datatracker.ietf.org/doc/html/rfc8259#section-7' },
    ],
    primaryToolId: 'json-validator',
    relatedToolIds: ['unicode-inspector'],
    workflowSlug: 'developer-data-debugging',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLUSTER 2: JWT & AUTHENTICATION GUIDES (5)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'jwt-decoding-vs-verification',
    slug: 'jwt-decoding-vs-verification',
    title: 'JWT Decoding vs Verification: What is the Difference?',
    shortDescription: 'Understand the crucial distinction: decoding a JSON Web Token reveals its payload, but proves nothing about its authenticity.',
    cluster: 'jwt',
    clusterName: 'JWT & Authentication',
    problemStatement: 'Developers frequently assume that because a client-side library or browser successfully decoded a JWT, the user\'s identity, roles, and permissions are verified and trustworthy.',
    shortAnswer: 'Decoding a JWT only converts Base64URL strings back into readable JSON. Verification checks the cryptographic signature using the issuer\'s secret or public key (RS256/ES256/HS256) to guarantee the token has not been tampered with.',
    technicalReason: 'A JWT is structured as `Header.Payload.Signature`. The Header and Payload are simply Base64URL-encoded text—anyone can create an arbitrary payload with `{"admin": true}` and encode it. Only cryptographic verification against the Signature using a trusted public key or HMAC secret confirms authenticity.',
    examples: [
      {
        title: 'Client-Side Decoding (Viewing Data Only)',
        validFix: `// Decode Base64URL payload (Readable, NOT verified)\nconst payloadJson = JSON.parse(atob(jwt.split('.')[1]));\nconsole.log("User email:", payloadJson.email);`,
        reason: 'Safe for reading display names or expiry time on frontend, but NEVER use for authorization decisions.',
        language: 'javascript',
      },
      {
        title: 'Server-Side Cryptographic Verification (Security Gate)',
        validFix: `// Cryptographic Signature Verification (Server / Gateway)\nimport jwt from 'jsonwebtoken';\n\ntry {\n  const verified = jwt.verify(token, process.env.JWT_SECRET, {\n    algorithms: ['RS256'],\n    issuer: 'https://auth.company.com'\n  });\n  // Token is verified and authentic\n} catch (err) {\n  // Token is forged, expired, or invalid\n}`,
        reason: 'Verifies the signature matches the payload hash using the authoritative issuer key.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Granting administrative permissions in backend APIs based solely on decoded JWT payload claims without signature verification.',
      'Allowing the `none` algorithm or accepting tokens without validating the expected cryptographic algorithm.',
      'Storing sensitive credentials, passwords, or PII inside the JWT payload (JWT payloads are public to anyone holding the token).',
    ],
    limitations: [
      'Browser client-side tools cannot verify symmetric secret keys (HS256) without exposing the secret to the user. Verification belongs on authoritative backend gateways.',
    ],
    references: [
      { title: 'IETF RFC 7519: JSON Web Token (JWT)', url: 'https://datatracker.ietf.org/doc/html/rfc7519' },
      { title: 'IETF RFC 7515: JSON Web Signature (JWS)', url: 'https://datatracker.ietf.org/doc/html/rfc7515' },
    ],
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['base64-converter', 'timestamp-explorer'],
    workflowSlug: 'jwt-debugging-workflow',
    samplePayload: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIERldiIsImlhdCI6MTUxNjIzOTAyMn0.4zUX_example_signature_only',
    updatedAt: '2026-08-30',
    readTime: '5 min read',
  },
  {
    id: 'how-jwt-expiration-works-exp-iat-nbf',
    slug: 'how-jwt-expiration-works-exp-iat-nbf',
    title: 'How JWT Expiration Works: Understanding exp, iat, and nbf',
    shortDescription: 'A complete breakdown of time-based JWT security claims, Unix epochs, clock skew tolerances, and token expiry validation.',
    cluster: 'jwt',
    clusterName: 'JWT & Authentication',
    problemStatement: 'Tokens getting prematurely rejected or failing to expire as expected due to timezone mismatches or millisecond vs second confusion.',
    shortAnswer: 'RFC 7519 defines standard time claims in seconds since Unix Epoch (1970-01-01T00:00:00Z). `exp` marks expiration time, `iat` marks issuance time, and `nbf` marks the earliest time a token can be accepted.',
    technicalReason: 'JWT timestamp claims MUST be numeric values representing seconds, not milliseconds. If an application passes `Date.now()` (which returns 13-digit milliseconds) instead of `Math.floor(Date.now() / 1000)` (10-digit seconds), the token will appear to expire thousands of years in the future or fail validation immediately.',
    examples: [
      {
        title: 'Valid JWT Time Claims in Seconds',
        validFix: `{\n  "sub": "user_8923",\n  "iat": 1725033600,\n  "nbf": 1725033600,\n  "exp": 1725037200\n}`,
        reason: 'Standard 10-digit Unix timestamps in seconds. Here exp is exactly 3,600 seconds (1 hour) after iat.',
        language: 'json',
      },
      {
        title: 'Incorrect JWT Claims (Milliseconds Bug)',
        invalid: `{\n  "sub": "user_8923",\n  "iat": 1725033600000,\n  "exp": 1725037200000\n}`,
        reason: '13-digit milliseconds violate RFC 7519 NumericDate format and cause validator libraries to fail or misinterpret the date.',
        validFix: `{\n  "sub": "user_8923",\n  "iat": 1725033600,\n  "exp": 1725037200\n}`,
        language: 'json',
      },
    ],
    commonMistakes: [
      'Using JavaScript `Date.now()` directly without dividing by 1000.',
      'Not allowing for clock skew between distributed servers (e.g., auth server clock is 2 seconds ahead of API server clock).',
      'Assuming local timezone offsets matter in JWTs (all Unix timestamps are implicitly UTC).',
    ],
    limitations: [
      'Without clock synchronization (NTP) on backend servers, tokens with tight expiration windows (<60s) may fail intermittently.',
    ],
    references: [
      { title: 'RFC 7519 Section 4.1: Standard Claims', url: 'https://datatracker.ietf.org/doc/html/rfc7519#section-4.1' },
    ],
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['timestamp-explorer'],
    workflowSlug: 'jwt-debugging-workflow',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'how-to-debug-expired-jwt',
    slug: 'how-to-debug-expired-jwt',
    title: 'How to Debug an Expired JWT Token Step-by-Step',
    shortDescription: 'Practical guide to decoding an expired token, comparing Unix epochs, inspecting clock skew, and checking token lifespans.',
    cluster: 'jwt',
    clusterName: 'JWT & Authentication',
    problemStatement: 'Your API returns 401 Unauthorized with "TokenExpiredError", but you need to determine exactly when the token expired, when it was issued, and why.',
    shortAnswer: 'Split the token by periods, Base64URL-decode the payload segment (index 1), extract the `exp` timestamp, convert it to a readable date in Timestamp Explorer, and compare against current UTC time.',
    technicalReason: 'JWT expiration check is a simple mathematical comparison: `CurrentTimeUnix >= exp`. If the server clock or token claims are misconfigured, inspecting both `iat` and `exp` clarifies the exact token lifespan.',
    examples: [
      {
        title: 'Step-by-Step Expiry Calculation',
        validFix: `// Step 1: Decode token payload\nconst payload = JSON.parse(atob(jwtToken.split('.')[1]));\n\n// Step 2: Extract exp and compare\nconst expSeconds = payload.exp;\nconst nowSeconds = Math.floor(Date.now() / 1000);\n\nconst isExpired = nowSeconds >= expSeconds;\nconst diffMinutes = Math.round((nowSeconds - expSeconds) / 60);\n\nconsole.log(\`Token expired: \${isExpired} (\${diffMinutes} minutes ago)\`);`,
        reason: 'Gives the exact expiration delta in human-readable terms.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Confusing local browser time with server UTC time during manual troubleshooting.',
      'Forgetting that OAuth2 refresh token flows issue new access tokens and checking a stale token from localStorage.',
    ],
    limitations: [
      'Decoding an expired token does not tell you if it was revoked server-side before its expiration date.',
    ],
    references: [
      { title: 'RFC 7519 Section 4.1.4: "exp" (Expiration Time) Claim', url: 'https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4' },
    ],
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['timestamp-explorer'],
    workflowSlug: 'jwt-debugging-workflow',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'base64-vs-base64url-jwt',
    slug: 'base64-vs-base64url-jwt',
    title: 'Base64 vs Base64URL: What JWT Actually Uses',
    shortDescription: 'Learn why standard Base64 breaks in URLs and HTTP headers, and how Base64URL solves it by swapping characters and stripping padding.',
    cluster: 'jwt',
    clusterName: 'JWT & Authentication',
    problemStatement: 'Attempting to decode a JWT segment using standard Base64 decoders (`atob`) often throws errors due to missing padding (`=`) or unrecognized characters (`-` and `_`).',
    shortAnswer: 'JWTs use Base64URL (RFC 4648 §5), not standard Base64. Base64URL replaces `+` with `-`, `/` with `_`, and omits trailing padding equals signs (`=`) so tokens can safely pass in URLs and headers without encoding.',
    technicalReason: 'Standard Base64 uses `+` and `/`, which are reserved in URLs (`+` means space in queries, `/` separates path segments). Using Base64URL guarantees tokens can be passed in HTTP query params (`?token=...`) and Bearer Authorization headers without percent-encoding.',
    examples: [
      {
        title: 'Character Comparison Table',
        validFix: `Standard Base64: Uses '+' and '/' with '=' padding\nExample: eyJhbGciOiJIUzI1NiJ9==\n\nBase64URL:       Uses '-' and '_' with NO '=' padding\nExample: eyJhbGciOiJIUzI1NiJ9`,
        reason: 'Base64URL is strictly URL and filename safe.',
        language: 'text',
      },
      {
        title: 'Safe JavaScript Base64URL Decoder Function',
        validFix: `function decodeBase64Url(str) {\n  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');\n  while (base64.length % 4) {\n    base64 += '=';\n  }\n  return decodeURIComponent(escape(atob(base64)));\n}`,
        reason: 'Normalizes - and _ back to standard Base64 characters and restores padding before calling atob().',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Calling browser native `atob(tokenPart)` directly without converting `-` and `_` characters first.',
      'Manually adding `=` padding into HTTP Bearer header tokens.',
    ],
    limitations: [
      'Base64URL is strictly an encoding mechanism, not encryption. Anyone with access to the string can decode the original bytes.',
    ],
    references: [
      { title: 'IETF RFC 4648: The Base16, Base32, and Base64 Data Encodings (Section 5)', url: 'https://datatracker.ietf.org/doc/html/rfc4648#section-5' },
    ],
    primaryToolId: 'base64-converter',
    relatedToolIds: ['jwt-decoder'],
    workflowSlug: 'jwt-debugging-workflow',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'how-to-read-jwt-claims',
    slug: 'how-to-read-jwt-claims',
    title: 'How to Read and Interpret Standard JWT Claims',
    shortDescription: 'A guide to reading standard JWT registered claims like iss, sub, aud, jti, and understanding custom enterprise claims.',
    cluster: 'jwt',
    clusterName: 'JWT & Authentication',
    problemStatement: 'Understanding what claims mean when inspecting tokens from Identity Providers (Auth0, Okta, Firebase, AWS Cognito, Keycloak).',
    shortAnswer: 'Claims are key-value statements about an entity and metadata. Registered claims include `iss` (issuer), `sub` (subject/user ID), `aud` (audience/client ID), `exp` (expiration), `iat` (issued at), and `jti` (unique token ID).',
    technicalReason: 'RFC 7519 reserves 7 core claims to standardize interoperability across OAuth 2.0 / OpenID Connect systems. Custom claims (like `roles` or `org_id`) provide application-specific context.',
    examples: [
      {
        title: 'Real-World OpenID Connect Token Claims',
        validFix: `{\n  "iss": "https://auth.example.com/",\n  "sub": "auth0|64b8f1023a",\n  "aud": "https://api.example.com",\n  "iat": 1725000000,\n  "exp": 1725003600,\n  "jti": "d4a8e291-7681-432a-bc91",\n  "email": "developer@example.com",\n  "roles": ["admin", "billing"]\n}`,
        reason: 'Combines standard registered claims with custom application context.',
        language: 'json',
      },
    ],
    commonMistakes: [
      'Putting large arrays or bulky permissions lists in the JWT, exceeding the 8KB HTTP header size limit on nginx/Apache.',
      'Relying on `aud` without checking that it matches your specific API identifier.',
    ],
    limitations: [
      'JWT claims cannot be revoked individually before expiration unless the server checks a central revocation blocklist (using `jti`).',
    ],
    references: [
      { title: 'RFC 7519 Section 4: JWT Claims', url: 'https://datatracker.ietf.org/doc/html/rfc7519#section-4' },
    ],
    primaryToolId: 'jwt-decoder',
    relatedToolIds: ['json-formatter', 'timestamp-explorer'],
    workflowSlug: 'jwt-debugging-workflow',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLUSTER 3: UNICODE & TEXT INSPECTION GUIDES (5)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'how-to-find-invisible-unicode-characters',
    slug: 'how-to-find-invisible-unicode-characters',
    title: 'How to Find Invisible Unicode Characters in Code & Text',
    shortDescription: 'Detect hidden zero-width spaces, byte order marks (BOM), and non-breaking spaces that cause mysterious syntax errors.',
    cluster: 'unicode',
    clusterName: 'Unicode & Text Analysis',
    problemStatement: 'Code fails to compile or string comparisons evaluate to `false` even though both strings appear 100% identical in standard text editors.',
    shortAnswer: 'Invisible Unicode characters (like `U+200B` zero-width space, `U+FEFF` BOM, or `U+00A0` non-breaking space) take up 0 pixels of screen space but exist as distinct byte sequences. Paste the text into Unicode Inspector to reveal every underlying code point.',
    technicalReason: 'Typography and rendering engines omit visual glyphs for formatting and directionality control characters. However, programming language tokenizers treat `U+0020` (ASCII Space) as whitespace, while `U+00A0` or `U+200B` are treated as invalid identifiers.',
    examples: [
      {
        title: 'Hidden Zero-Width Space in Variable Name',
        invalid: `const apiKey\u200B = "secret_123";`,
        reason: 'Contains U+200B zero-width space between "apiKey" and " =". Appears normal to the eye, but JavaScript throws "SyntaxError: Invalid or unexpected token".',
        validFix: `const apiKey = "secret_123";`,
        language: 'javascript',
      },
      {
        title: 'Common Invisible Unicode Code Points',
        validFix: `• U+200B : Zero-Width Space (ZWSP)\n• U+200C : Zero-Width Non-Joiner (ZWNJ)\n• U+200D : Zero-Width Joiner (ZWJ, used in emoji sequences)\n• U+FEFF : Zero-Width No-Break Space / Byte Order Mark (BOM)\n• U+00A0 : Non-Breaking Space (NBSP)`,
        reason: 'Reference list of the most frequent hidden characters encountered in web text.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Copying code snippets from formatted Medium articles, Microsoft Word, or Rich Text emails that replace standard spaces with NBSP or ZWSP.',
      'Saving UTF-8 files with a Byte Order Mark (BOM) that breaks Linux shell scripts and JSON parsers.',
    ],
    limitations: [
      'Standard console loggers (`console.log`) hide these characters. You must inspect raw code point values.',
    ],
    references: [
      { title: 'The Unicode Standard: General Punctuation & Format Characters', url: 'https://www.unicode.org/charts/' },
    ],
    primaryToolId: 'unicode-inspector',
    relatedToolIds: ['case-converter', 'word-counter'],
    workflowSlug: 'developer-data-debugging',
    samplePayload: 'const\u200B user = "Alice";',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'what-is-zero-width-space',
    slug: 'what-is-zero-width-space',
    title: 'What is a Zero-Width Space (U+200B) and Why Does It Break Code?',
    shortDescription: 'Understand the typographic purpose of U+200B zero-width space, how it infiltrates copied text, and how to detect it.',
    cluster: 'unicode',
    clusterName: 'Unicode & Text Analysis',
    problemStatement: 'A zero-width space (`U+200B`) is invisible in your editor but prevents exact string matching (`"admin" !== "admin\u200B"`), breaks SQL queries, and ruins passwords.',
    shortAnswer: '`U+200B` is a Unicode character designed to suggest line-break opportunities in word processing without displaying a visible space. When pasted into code, programming languages treat it as an unrecognized symbol.',
    technicalReason: 'In UTF-8 encoding, a standard ASCII space (`U+0020`) is 1 byte (`0x20`). A zero-width space (`U+200B`) is 3 bytes (`0xE2 0x80 0x8B`). String length calculations report `6` characters instead of `5`, and byte-level comparisons fail.',
    examples: [
      {
        title: 'String Length & Equality Failure',
        validFix: `const strA = "admin";\nconst strB = "admin\\u200B";\n\nconsole.log(strA === strB); // false\nconsole.log(strA.length);   // 5\nconsole.log(strB.length);   // 6`,
        reason: 'Visually identical in the console, but strictly distinct in memory.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Assuming `trim()` removes zero-width spaces (standard `String.prototype.trim()` removes standard whitespace, but behavior on zero-width characters varies across platforms).',
    ],
    limitations: [
      'Regex `\\s` in older JavaScript engines may not match `U+200B`. Explicit regex `/[\\u200B-\\u200D\\uFEFF]/g` is required for stripping.',
    ],
    references: [
      { title: 'Unicode Character U+200B Specification', url: 'https://www.fileformat.info/info/unicode/char/200b/index.htm' },
    ],
    primaryToolId: 'unicode-inspector',
    relatedToolIds: ['remove-duplicate-lines'],
    samplePayload: 'admin\u200B',
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
  {
    id: 'utf-8-vs-utf-16-explained',
    slug: 'utf-8-vs-utf-16-explained',
    title: 'UTF-8 vs UTF-16 with Real Examples: Code Points & Surrogates',
    shortDescription: 'Clear, practical explanation of how UTF-8 and UTF-16 encode Unicode code points, byte sizes, and emoji surrogate pairs.',
    cluster: 'unicode',
    clusterName: 'Unicode & Text Analysis',
    problemStatement: 'Why `\'👋\'.length` returns `2` in JavaScript, why string slicing slices emojis in half, and how UTF-8 differs from JavaScript\'s internal UTF-16 string memory.',
    shortAnswer: 'Unicode defines code points (`U+0000` to `U+10FFFF`). UTF-8 is a variable-length encoding (1 to 4 bytes per character, backward compatible with ASCII). UTF-16 uses 2 or 4 bytes per character. Emojis and rare symbols in UTF-16 require two 16-bit code units called a surrogate pair.',
    technicalReason: 'JavaScript strings are internally represented in UTF-16. Characters above `U+FFFF` (like `🎉` `U+1F389`) cannot fit into a single 16-bit code unit, so JavaScript splits them into a High Surrogate (`0xD83C`) and a Low Surrogate (`0xDF89`), making `.length` return 2.',
    examples: [
      {
        title: 'Emoji Surrogate Pair Example',
        validFix: `// '🚀' is code point U+1F680\nconst rocket = '🚀';\nconsole.log(rocket.length); // 2 (UTF-16 code units)\nconsole.log([...rocket].length); // 1 (Iterating by Unicode code point)`,
        reason: 'Use array spread [...str] or Array.from(str) to count true visual characters instead of .length.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Using `str.substring(0, 1)` on emoji text, leaving a broken trailing high surrogate that renders as a question mark diamond .',
      'Assuming 1 character always equals 1 byte in database storage (UTF-8 multi-byte characters require 4 bytes in MySQL utf8mb4).',
    ],
    limitations: [
      'Complex emojis with skin tone modifiers and Zero-Width Joiners (like `👨‍👩‍👧‍👦`) consist of multiple code points combined together.',
    ],
    references: [
      { title: 'The Unicode Standard Chapter 2: General Structure', url: 'https://www.unicode.org/versions/latest/' },
    ],
    primaryToolId: 'unicode-inspector',
    relatedToolIds: ['word-counter'],
    samplePayload: 'Hello 🚀 World 👋',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'why-identical-characters-differ-confusables',
    slug: 'why-identical-characters-differ-confusables',
    title: 'Why Two Characters Can Look Identical But Be Different (Homoglyphs)',
    shortDescription: 'How homoglyphs and confusable Unicode characters from Cyrillic, Greek, and Latin alphabets trick developers and security scanners.',
    cluster: 'unicode',
    clusterName: 'Unicode & Text Analysis',
    problemStatement: 'A domain name or variable name looks 100% correct on screen, but tests or authentication systems treat it as completely different.',
    shortAnswer: 'Different language alphabets contain visually indistinguishable glyphs called homoglyphs. For example, Latin `a` (`U+0061`) and Cyrillic `а` (`U+0430`) look identical, but have different Unicode code points and byte values.',
    technicalReason: 'Unicode provides a unified catalog for all world scripts. Glyphs that share similar typographic historical roots across Latin, Cyrillic, and Greek have distinct code points to preserve script integrity. Attackers use this for IDN Homograph Attacks.',
    examples: [
      {
        title: 'Latin "a" vs Cyrillic "а"',
        validFix: `Latin 'a':    U+0061 (ASCII 97, Byte: 0x61)\nCyrillic 'а': U+0430 (Unicode 1072, UTF-8 Bytes: 0xD0 0xB0)\n\n'google.com' (Latin) !== 'gооgle.com' (Cyrillic о's)`,
        reason: 'Unicode Inspector reveals the exact script and hexadecimal code point.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Allowing un-normalized usernames in registration systems, permitting attackers to impersonate administrators with homoglyphs.',
    ],
    limitations: [
      'Human visual inspection cannot detect homoglyphs. Programmatic code point analysis is required.',
    ],
    references: [
      { title: 'Unicode Technical Report #36: Unicode Security Considerations', url: 'https://www.unicode.org/reports/tr36/' },
      { title: 'Unicode Technical Standard #39: Unicode Security Mechanisms (Confusables)', url: 'https://www.unicode.org/reports/tr39/' },
    ],
    primaryToolId: 'unicode-inspector',
    relatedToolIds: ['case-converter'],
    samplePayload: 'apple vs аpple',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'unicode-normalization-nfc-nfd',
    slug: 'unicode-normalization-nfc-nfd',
    title: 'Unicode Normalization Explained: NFC vs NFD & String Equality',
    shortDescription: 'Why string comparisons fail on accented characters like "é", and how NFC / NFD normalization solves text comparison bugs.',
    cluster: 'unicode',
    clusterName: 'Unicode & Text Analysis',
    problemStatement: 'Searching for "café" fails to match database records containing "café", even though spelling and casing are identical.',
    shortAnswer: 'Accented characters can be represented in two ways: as a single precomposed character (NFC: `é` = `U+00E9`) or as a base character plus a combining accent (NFD: `e` + `´` = `U+0065` + `U+0301`). String equality `===` fails unless strings are normalized.',
    technicalReason: 'macOS file systems (HFS+) historically decomposed filenames into NFD, whereas Windows and Linux use NFC. When files or text move between operating systems, un-normalized string comparisons evaluate to `false`.',
    examples: [
      {
        title: 'JavaScript Normalization Fix',
        validFix: `const strNFC = 'café';           // 'c', 'a', 'f', '\\u00E9'\nconst strNFD = 'cafe\\u0301';       // 'c', 'a', 'f', 'e', '\\u0301'\n\nconsole.log(strNFC === strNFD); // false\n\n// Fix: Normalize both to NFC\nconsole.log(strNFC.normalize('NFC') === strNFD.normalize('NFC')); // true`,
        reason: 'String.prototype.normalize("NFC") merges decomposed combining marks into canonical precomposed characters.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Indexing text in search engines or SQL databases without canonical NFC normalization during ingestion.',
    ],
    limitations: [
      'NFKD / NFKC compatibility normalization can alter semantic formatting (e.g. converting fractions ½ to 1/2 or ligature ﬁ to fi).',
    ],
    references: [
      { title: 'Unicode Standard Annex #15: Unicode Normalization Forms', url: 'https://www.unicode.org/reports/tr15/' },
      { title: 'MDN: String.prototype.normalize()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize' },
    ],
    primaryToolId: 'unicode-inspector',
    relatedToolIds: ['case-converter'],
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLUSTER 4: TIMESTAMPS & APIS (4)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'unix-timestamp-seconds-vs-milliseconds',
    slug: 'unix-timestamp-seconds-vs-milliseconds',
    title: 'Unix Timestamp Seconds vs Milliseconds: 10 vs 13 Digits',
    shortDescription: 'Quickly identify whether an epoch timestamp is in seconds or milliseconds and fix common date calculation bugs.',
    cluster: 'timestamp',
    clusterName: 'Timestamps & Dates',
    problemStatement: 'Your date shows up as year 53948 or 1970 because an API passed timestamp seconds into a function expecting milliseconds (or vice versa).',
    shortAnswer: 'Count the digits: 10 digits = Seconds (e.g., `1725000000`, common in Python, Go, PHP, JWTs, Unix OS). 13 digits = Milliseconds (e.g., `1725000000000`, standard in JavaScript `Date.now()` and Java `System.currentTimeMillis()`).',
    technicalReason: 'Unix Epoch is the number of units elapsed since 1970-01-01T00:00:00Z. In the 2020s, seconds timestamps are around `1.7 × 10^9` (10 digits) while millisecond timestamps are around `1.7 × 10^12` (13 digits). Multiplying or dividing by 1,000 resolves the mismatch.',
    examples: [
      {
        title: '10 Digits vs 13 Digits Comparison',
        validFix: `Seconds (10 digits):      1725033600      -> Sat Aug 30 2026 16:00:00 UTC\nMilliseconds (13 digits): 1725033600000   -> Sat Aug 30 2026 16:00:00 UTC\n\nBug in JS: new Date(1725033600)          -> Jan 20 1970 (Treated as 1.7 million ms!)`,
        reason: 'JavaScript new Date(num) ALWAYS expects milliseconds. Pass timestamp * 1000 if receiving seconds.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Passing a Python `time.time()` (seconds) directly into frontend JavaScript `new Date()` without multiplying by 1000.',
      'Passing a JavaScript `Date.now()` (milliseconds) into a JWT `exp` claim without dividing by 1000.',
    ],
    limitations: [
      'Microsecond timestamps (16 digits) and Nanosecond timestamps (19 digits) are used in databases like PostgreSQL and distributed tracing (OpenTelemetry).',
    ],
    references: [
      { title: 'The Open Group Base Specifications Issue 7: Seconds Since the Epoch', url: 'https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_15' },
    ],
    primaryToolId: 'timestamp-explorer',
    relatedToolIds: ['jwt-decoder'],
    workflowSlug: 'developer-data-debugging',
    samplePayload: '1725033600',
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
  {
    id: 'how-to-read-timestamps-in-jwt',
    slug: 'how-to-read-timestamps-in-jwt',
    title: 'How to Read and Convert Timestamps in JWT Tokens',
    shortDescription: 'Learn how to inspect the numeric dates in JWT exp, iat, and nbf claims and convert them to human-readable UTC and local time.',
    cluster: 'timestamp',
    clusterName: 'Timestamps & Dates',
    problemStatement: 'You decoded a token and see `"exp": 1725037200`. How do you convert that into your local timezone and determine exactly how many minutes remain?',
    shortAnswer: 'JWT timestamps are in seconds since Unix epoch. Multiply by 1000, pass into `new Date(exp * 1000)`, and format using `toLocaleTimeString()` or inspect in Timestamp Explorer.',
    technicalReason: 'RFC 7519 defines NumericDate specifically as seconds. All JWT timestamps are intrinsically UTC. Timezone offsets are only applied during human presentation on the client.',
    examples: [
      {
        title: 'JavaScript Expiry Inspector Snippet',
        validFix: `const expSeconds = 1725037200;\nconst expDate = new Date(expSeconds * 1000);\n\nconsole.log("UTC Date:", expDate.toUTCString());\nconsole.log("Local Date:", expDate.toLocaleString());\nconsole.log("Minutes remaining:", Math.round((expDate.getTime() - Date.now()) / 60000));`,
        reason: 'Correctly converts seconds to milliseconds for Date constructor.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Assuming the token was created in the server\'s local timezone (Unix epochs have no timezone; they are universal UTC).',
    ],
    limitations: [
      'Expired tokens cannot be extended client-side. The client must request a new token from the auth server using a refresh token.',
    ],
    references: [
      { title: 'RFC 7519 Section 2: NumericDate Definition', url: 'https://datatracker.ietf.org/doc/html/rfc7519#section-2' },
    ],
    primaryToolId: 'timestamp-explorer',
    relatedToolIds: ['jwt-decoder'],
    workflowSlug: 'jwt-debugging-workflow',
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
  {
    id: 'iso-8601-vs-rfc-3339',
    slug: 'iso-8601-vs-rfc-3339',
    title: 'ISO 8601 vs RFC 3339 Timestamps: Formatting Nuances',
    shortDescription: 'Understand the exact differences between ISO 8601 and RFC 3339 date-time formats in REST APIs and database schemas.',
    cluster: 'timestamp',
    clusterName: 'Timestamps & Dates',
    problemStatement: 'APIs reject timestamp strings or return formatting errors due to subtle syntax differences between ISO 8601 and RFC 3339.',
    shortAnswer: 'RFC 3339 is a strict profile of ISO 8601 optimized for Internet protocols. RFC 3339 mandates a 4-digit year, allows replacing `T` with a space, and requires a full timezone offset (`Z` or `+00:00`). ISO 8601 is broader and allows 2-digit years and fractional seconds without offsets.',
    technicalReason: 'ISO 8601 was too flexible for strict networking parsers. RFC 3339 eliminated ambiguities (like omitting dashes `20260830` or using ordinal dates `2026-242`) to create a deterministic Internet timestamp standard (`YYYY-MM-DDTHH:MM:SSZ`).',
    examples: [
      {
        title: 'Standard RFC 3339 Internet Timestamp',
        validFix: `2026-08-30T16:00:00.000Z\n2026-08-30T12:00:00-04:00\n2026-08-30 16:00:00Z (RFC 3339 allows space instead of T)`,
        reason: 'Deterministic, sortable, timezone-explicit format.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Omitting the `Z` or timezone offset at the end of the string, causing parsers to guess the local timezone and creating an 8-hour time shift.',
    ],
    limitations: [
      'Database `TIMESTAMP WITHOUT TIME ZONE` drops offset metadata, causing silent date shifts when migrated between regions.',
    ],
    references: [
      { title: 'IETF RFC 3339: Date and Time on the Internet', url: 'https://datatracker.ietf.org/doc/html/rfc3339' },
      { title: 'ISO 8601: Date and Time Format Standard', url: 'https://www.iso.org/iso-8601-date-and-time-format.html' },
    ],
    primaryToolId: 'timestamp-explorer',
    relatedToolIds: ['jwt-decoder'],
    samplePayload: '2026-08-30T16:00:00.000Z',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'why-api-timestamps-are-wrong',
    slug: 'why-api-timestamps-are-wrong',
    title: 'Why API Timestamps Look Wrong: Clock Skew & Timezone Traps',
    shortDescription: 'Troubleshoot date calculations that are off by hours, days, or decades due to parser assumptions and missing UTC offsets.',
    cluster: 'timestamp',
    clusterName: 'Timestamps & Dates',
    problemStatement: 'Orders created "in the future", logs displaying timestamps 5 hours behind, or countdowns jumping around unexpectedly.',
    shortAnswer: 'The 3 most common causes are: 1) Passing seconds into a millisecond parser (causing year 1970), 2) String date parsing without a `Z` offset (interpreted as local time), and 3) Server clock drift without NTP sync.',
    technicalReason: 'When JavaScript parses `"2026-08-30"`, ES5 specifications treat it as UTC midnight, whereas `"2026-08-30 12:00:00"` without `Z` is treated as local device time. This divergence causes silent hour shifts.',
    examples: [
      {
        title: 'Safe API Timestamp Ingestion Pattern',
        validFix: `// Safe UTC conversion helper\nfunction parseApiDate(input) {\n  if (typeof input === 'number') {\n    // Auto-detect seconds vs milliseconds\n    return input < 1e11 ? new Date(input * 1000) : new Date(input);\n  }\n  // Ensure string has timezone or append Z\n  const hasTimezone = /Z|[+-]\\d{2}:?\\d{2}$/.test(input);\n  return new Date(hasTimezone ? input : input + 'Z');\n}`,
        reason: 'Guards against 10-vs-13 digit bugs and implicit local timezone shifts.',
        language: 'javascript',
      },
    ],
    commonMistakes: [
      'Assuming server time and client device time are perfectly synchronized without NTP.',
      'Relying on client-controlled system clocks for security decisions or payment expiration checks.',
    ],
    limitations: [
      'Client device clocks can be altered by users in OS settings. Always enforce authoritative timestamps on backend servers.',
    ],
    references: [
      { title: 'W3C Date and Time Formats Note', url: 'https://www.w3.org/TR/NOTE-datetime' },
    ],
    primaryToolId: 'timestamp-explorer',
    relatedToolIds: ['jwt-decoder'],
    workflowSlug: 'developer-data-debugging',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLUSTER 5: PDF & DOCUMENT PROCESSING GUIDES (4)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'how-to-reduce-pdf-file-size',
    slug: 'how-to-reduce-pdf-file-size',
    title: 'How to Reduce PDF File Size: Images, Fonts & Tradeoffs',
    shortDescription: 'Learn what causes massive PDF documents, how image downsampling and stream compression work, and why some files resist shrinking.',
    cluster: 'pdf',
    clusterName: 'PDF & Document Workflows',
    problemStatement: 'PDF documents exceeding upload limits on email attachments, job portals, or government forms (e.g. >2MB / >10MB).',
    shortAnswer: 'PDF bloat is usually caused by uncompressed high-DPI scanned images and duplicate embedded fonts. Reducing PDF size involves downsampling embedded images (e.g. to 150 DPI) and applying Flate/Deflate binary stream compression.',
    technicalReason: 'A PDF is a container holding content streams, vector graphics, fonts, and raster images. Vector text takes kilobytes. A single 600 DPI scanned photograph inside a PDF can take 15MB. Compressing the PDF resizes the bitmap streams while preserving document metadata.',
    examples: [
      {
        title: 'PDF Component Size Breakdown',
        validFix: `• Vector text + layout: ~50 KB (negligible)\n• Embedded TrueType/OpenType Fonts: ~500 KB - 2 MB\n• Scanned 300 DPI Images: ~5 MB - 20 MB (90% of file size!)\n\nSolution: Compress and downsample bitmap raster images.`,
        reason: 'Shows why focusing on image compression provides the highest size reduction.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Attempting to compress a PDF that already contains only pure vector text and expecting a 90% size drop (pure text is already compact).',
      'Uploading confidential financial PDFs to unknown cloud servers that store files on remote disks.',
      'Re-compressing an already compressed PDF, which can sometimes increase file size due to metadata container overhead.',
    ],
    limitations: [
      'Scanned PDFs with heavy image downsampling may lose fine text legibility if compressed below 100 DPI.',
    ],
    references: [
      { title: 'ISO 32000-1: Document Management — Portable Document Format (PDF 1.7)', url: 'https://www.iso.org/standard/51502.html' },
    ],
    primaryToolId: 'pdf-compress',
    relatedToolIds: ['pdf-merge', 'images-to-pdf'],
    workflowSlug: 'pdf-processing-workflow',
    updatedAt: '2026-08-30',
    readTime: '4 min read',
  },
  {
    id: 'how-to-merge-pdf-files-correct-order',
    slug: 'how-to-merge-pdf-files-correct-order',
    title: 'How to Merge PDF Files in the Correct Page Sequence',
    shortDescription: 'Step-by-step workflow for combining multi-page contracts, invoices, and receipts into a unified document without server uploads.',
    cluster: 'pdf',
    clusterName: 'PDF & Document Workflows',
    problemStatement: 'Combining multiple PDF pages into one file where pages end up scrambled or out of chronological order.',
    shortAnswer: 'Load files into a client-side PDF merger, arrange the document order visually via drag-and-drop or ordering lists, and export a consolidated PDF binary stream directly in your browser.',
    technicalReason: 'Client-side PDF merging reads the cross-reference tables (XRef) and page trees (`/Pages` catalog) of each input PDF, clones page objects into a new PDF document structure, and generates an updated index stream in memory.',
    examples: [
      {
        title: 'Client-Side PDF Merge Pipeline',
        validFix: `1. Import File A (Cover letter, 1 page)\n2. Import File B (Contract agreement, 3 pages)\n3. Import File C (Signature appendix, 1 page)\n4. Execute in-browser merge -> Output: 5-page consolidated PDF.`,
        reason: 'Entire binary composition completes in local browser WebWorker.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Merging password-protected encrypted PDFs without unlocking them first.',
      'Uploading sensitive signed legal agreements to public cloud converters.',
    ],
    limitations: [
      'Merging 50+ heavy PDFs simultaneously may be constrained by device RAM limits on mobile browsers.',
    ],
    references: [
      { title: 'PDF Reference Section 3.6: Document Structure & Page Tree', url: 'https://opensource.adobe.com/dc-acrobat-sdk-docs/' },
    ],
    primaryToolId: 'pdf-merge',
    relatedToolIds: ['pdf-split', 'pdf-compress'],
    workflowSlug: 'pdf-processing-workflow',
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
  {
    id: 'how-to-extract-pages-from-pdf',
    slug: 'how-to-extract-pages-from-pdf',
    title: 'How to Extract Specific Pages from a PDF Document',
    shortDescription: 'Extract single pages, custom ranges (e.g. 1-3, 5, 8-10), or split massive PDF reports into individual documents.',
    cluster: 'pdf',
    clusterName: 'PDF & Document Workflows',
    problemStatement: 'You only need 2 pages from a 100-page financial report or medical record and need to extract them without sharing the rest of the document.',
    shortAnswer: 'Use PDF Split to define exact page numbers or ranges (e.g., `1, 3-5, 12`). The tool copies only the selected page objects and renders a lightweight standalone PDF in your browser.',
    technicalReason: 'The tool parses the document\'s `/Pages` array, extracts only the referenced `/Page` dictionary objects and associated `/Contents` streams, re-indexes the font resources, and writes a clean PDF.',
    examples: [
      {
        title: 'Page Range Syntax Guide',
        validFix: `• Single page:     4          -> Extracts page 4 only\n• Page range:      2-6        -> Extracts pages 2, 3, 4, 5, 6\n• Multiple ranges: 1, 3-5, 8  -> Extracts pages 1, 3, 4, 5, 8 into a single file\n• Split all:       Extracts every page as an individual standalone PDF`,
        reason: 'Flexible range syntax for precise extraction.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Entering page numbers outside the document\'s total page count (e.g. requesting page 15 of a 10-page document).',
    ],
    limitations: [
      'Page extraction preserves original resolution of embedded elements; compress the extracted file if size reduction is needed.',
    ],
    references: [
      { title: 'Adobe PDF Specification: Page Object Extraction', url: 'https://opensource.adobe.com/dc-acrobat-sdk-docs/' },
    ],
    primaryToolId: 'pdf-split',
    relatedToolIds: ['pdf-merge', 'pdf-compress'],
    workflowSlug: 'pdf-processing-workflow',
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
  {
    id: 'how-to-convert-images-to-pdf',
    slug: 'how-to-convert-images-to-pdf',
    title: 'How to Convert and Arrange Multiple Images into a Single PDF',
    shortDescription: 'Combine JPG, PNG, and WebP photos or scanned receipts into a clean, standardized multi-page PDF document.',
    cluster: 'pdf',
    clusterName: 'PDF & Document Workflows',
    problemStatement: 'You have multiple camera photos or receipts (`.jpg`, `.png`) that need to be submitted as a single multi-page PDF document.',
    shortAnswer: 'Upload the images into Images to PDF, arrange the sequence, select your target page orientation (A4, Letter, Auto), and generate a clean PDF binary locally in your browser.',
    technicalReason: 'Each raster image is drawn onto an HTML5 Canvas or converted directly into a PDF Image XObject (`/XObject /Subtype /Image`). The PDF writer scales the dimensions to fit standard print margins.',
    examples: [
      {
        title: 'Image to PDF Assembly Pipeline',
        validFix: `1. Select 3 receipt photos (IMG_001.jpg, IMG_002.png, IMG_003.webp)\n2. Set Page Size to 'A4' (or 'Fit Image Dimensions')\n3. Export -> Generates unified 3-page PDF instantly in memory.`,
        reason: 'Zero server uploads protect photo privacy and location EXIF data.',
        language: 'text',
      },
    ],
    commonMistakes: [
      'Using uncompressed 20MB raw smartphone photos without downscaling, resulting in a 60MB PDF file.',
      'Scrambling image order before conversion (drag and drop to re-order first).',
    ],
    limitations: [
      'Only raster formats (JPG, PNG, WebP) are supported. RAW camera files (.CR2, .NEF) must be exported to JPG first.',
    ],
    references: [
      { title: 'PDF Reference: Image XObjects', url: 'https://opensource.adobe.com/dc-acrobat-sdk-docs/' },
    ],
    primaryToolId: 'images-to-pdf',
    relatedToolIds: ['pdf-merge', 'pdf-compress'],
    workflowSlug: 'pdf-processing-workflow',
    updatedAt: '2026-08-30',
    readTime: '3 min read',
  },
];

export const WORKFLOWS_DATA: WorkflowGuide[] = [
  {
    id: 'developer-data-debugging',
    slug: 'developer-data-debugging',
    title: 'Developer Data Debugging Workflow',
    description: 'End-to-end workflow for inspecting, formatting, decoding, and resolving syntax issues across API data payloads.',
    steps: [
      {
        stepNumber: 1,
        title: 'Validate Syntax & Schema',
        description: 'Check for trailing commas, quotes, and structural mistakes in API response bodies.',
        toolId: 'json-validator',
        tips: 'Use the error position highlighter to locate syntax breaks instantly.',
      },
      {
        stepNumber: 2,
        title: 'Format & Indent Payload',
        description: 'Pretty-print minified JSON payloads for clean human readability.',
        toolId: 'json-formatter',
        tips: 'Toggle between 2-space and 4-space indentation.',
      },
      {
        stepNumber: 3,
        title: 'Inspect Authentication Tokens',
        description: 'Decode authorization JWT headers and claims to verify user roles and scope.',
        toolId: 'jwt-decoder',
        tips: 'Check exp and iat timestamps against current system time.',
      },
      {
        stepNumber: 4,
        title: 'Convert & Verify Timestamps',
        description: 'Convert numeric epochs into human-readable UTC and local timezones.',
        toolId: 'timestamp-explorer',
        tips: 'Watch for 10-digit (seconds) vs 13-digit (milliseconds) mismatches.',
      },
      {
        stepNumber: 5,
        title: 'Detect Invisible Unicode Characters',
        description: 'Scan copy-pasted strings for hidden zero-width spaces or non-breaking spaces.',
        toolId: 'unicode-inspector',
        tips: 'Inspect suspicious variable names that cause SyntaxErrors.',
      },
    ],
    relatedGuides: [
      'why-json-parse-fails-syntax-errors',
      'jwt-decoding-vs-verification',
      'unix-timestamp-seconds-vs-milliseconds',
      'how-to-find-invisible-unicode-characters',
    ],
    updatedAt: '2026-08-30',
  },
  {
    id: 'jwt-debugging-workflow',
    slug: 'jwt-debugging-workflow',
    title: 'JWT Token Inspection & Lifecycle Verification',
    description: 'Step-by-step pipeline for decoding JSON Web Tokens, verifying expiration claims, and inspecting Base64URL encodings.',
    steps: [
      {
        stepNumber: 1,
        title: 'Decode JWT Header & Payload',
        description: 'Inspect algorithm (RS256/HS256) and payload claims in readable JSON format.',
        toolId: 'jwt-decoder',
        tips: 'Remember that decoding does NOT verify cryptographic authenticity.',
      },
      {
        stepNumber: 2,
        title: 'Verify Base64URL Encoding',
        description: 'Examine raw Base64URL segments and decode custom binary values.',
        toolId: 'base64-converter',
        tips: 'Base64URL uses - and _ without trailing = padding.',
      },
      {
        stepNumber: 3,
        title: 'Evaluate Token Expiry (exp / iat)',
        description: 'Convert exp and iat numeric claims into precise local and UTC dates.',
        toolId: 'timestamp-explorer',
        tips: 'Ensure server clock skew does not exceed your token acceptance window.',
      },
    ],
    relatedGuides: [
      'jwt-decoding-vs-verification',
      'how-jwt-expiration-works-exp-iat-nbf',
      'how-to-debug-expired-jwt',
      'base64-vs-base64url-jwt',
    ],
    updatedAt: '2026-08-30',
  },
  {
    id: 'image-preparation-workflow',
    slug: 'image-preparation-workflow',
    title: 'Image Asset Optimization Pipeline',
    description: 'Client-side image preparation pipeline to crop, resize, compress, and convert graphics for production web apps.',
    steps: [
      {
        stepNumber: 1,
        title: 'Crop to Aspect Ratio',
        description: 'Frame your graphic to standard aspect ratios (16:9, 1:1, 4:3) with interactive marquee controls.',
        toolId: 'image-cropper',
        tips: 'Crop first to avoid resizing pixels you plan to discard.',
      },
      {
        stepNumber: 2,
        title: 'Resize Dimensions',
        description: 'Scale width and height to match target screen breakpoints while locking aspect ratio.',
        toolId: 'image-resizer',
        tips: 'Avoid delivering 4000px camera photos to 800px web containers.',
      },
      {
        stepNumber: 3,
        title: 'Compress File Size',
        description: 'Apply perceptual image compression to shrink file bytes with zero server uploads.',
        toolId: 'image-compressor',
        tips: 'Compare original vs compressed preview side-by-side.',
      },
      {
        stepNumber: 4,
        title: 'Convert to Modern WebP',
        description: 'Convert PNG/JPG assets into lightweight next-gen WebP format.',
        toolId: 'image-format-converter',
        tips: 'WebP offers ~30% smaller file sizes than standard JPEG at equivalent quality.',
      },
    ],
    relatedGuides: [
      'how-to-convert-images-to-pdf',
      'how-to-reduce-pdf-file-size',
    ],
    updatedAt: '2026-08-30',
  },
  {
    id: 'pdf-processing-workflow',
    slug: 'pdf-processing-workflow',
    title: 'Client-Side PDF Document Production Line',
    description: 'Complete private document workflow: Convert images to PDF, merge multiple files, split pages, and compress output.',
    steps: [
      {
        stepNumber: 1,
        title: 'Convert Images to PDF',
        description: 'Assemble photos or scanned receipts into clean multi-page PDF pages.',
        toolId: 'images-to-pdf',
        tips: 'Select standard A4 or Letter page sizing.',
      },
      {
        stepNumber: 2,
        title: 'Merge PDF Documents',
        description: 'Combine multiple PDF contracts, reports, and appendices in exact order.',
        toolId: 'pdf-merge',
        tips: 'Drag and drop rows to reorder before merging.',
      },
      {
        stepNumber: 3,
        title: 'Extract or Split Pages',
        description: 'Extract specific page ranges or split large documents into individual chapters.',
        toolId: 'pdf-split',
        tips: 'Use range syntax like 1-3, 5 to extract select pages.',
      },
      {
        stepNumber: 4,
        title: 'Compress Output Document',
        description: 'Shrink final document size for email attachment or portal submission limits.',
        toolId: 'pdf-compress',
        tips: 'Downsamples heavy embedded raster images inside local browser memory.',
      },
    ],
    relatedGuides: [
      'how-to-reduce-pdf-file-size',
      'how-to-merge-pdf-files-correct-order',
      'how-to-extract-pages-from-pdf',
      'how-to-convert-images-to-pdf',
    ],
    updatedAt: '2026-08-30',
  },
];
