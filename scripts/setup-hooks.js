/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const gitHooksDir = path.join(__dirname, '../.git/hooks');

if (!fs.existsSync(gitHooksDir)) {
  fs.mkdirSync(gitHooksDir, { recursive: true });
}

const preCommitContent = `#!/bin/sh
echo "🔍 Running pre-commit quality gates (validate-tools, typecheck, lint)..."

node scripts/validate-tools.js
if [ $? -ne 0 ]; then
  echo "❌ Registry validation failed. Commit aborted."
  exit 1
fi

pnpm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript check failed. Commit aborted."
  exit 1
fi

pnpm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint check failed. Commit aborted."
  exit 1
fi

echo "✅ Pre-commit quality gates passed!"
`;

const prePushContent = `#!/bin/sh
echo "🚀 Running pre-push quality gates (tests, production build)..."

pnpm run test
if [ $? -ne 0 ]; then
  echo "❌ Unit tests failed. Push aborted."
  exit 1
fi

pnpm run build
if [ $? -ne 0 ]; then
  echo "❌ Production build failed. Push aborted."
  exit 1
fi

echo "✅ Pre-push quality gates passed!"
`;

const preCommitFile = path.join(gitHooksDir, 'pre-commit');
const prePushFile = path.join(gitHooksDir, 'pre-push');

fs.writeFileSync(preCommitFile, preCommitContent, { mode: 0o755 });
fs.writeFileSync(prePushFile, prePushContent, { mode: 0o755 });

console.log('✅ Git pre-commit and pre-push hooks configured successfully!');
