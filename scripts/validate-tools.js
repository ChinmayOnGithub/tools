/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../src/config/tools-registry.ts');
const categoriesPath = path.join(__dirname, '../src/config/categories.ts');

if (!fs.existsSync(registryPath)) {
  console.error('❌ Registry file not found at:', registryPath);
  process.exit(1);
}

// 1. Read and parse Categories
let categoriesList = [];
try {
  const categoriesText = fs.readFileSync(categoriesPath, 'utf8');
  const catRegex = /slug:\s*'([^']+)'/g;
  let match;
  while ((match = catRegex.exec(categoriesText)) !== null) {
    categoriesList.push(match[1]);
  }
} catch (err) {
  console.error('❌ Failed to read categories configurations:', err.message);
  process.exit(1);
}

// 2. Read and parse Tools Registry by slicing the array string
let tools = [];
try {
  const registryText = fs.readFileSync(registryPath, 'utf8');
  const arrayStartIndex = registryText.indexOf('TOOLS_REGISTRY');
  if (arrayStartIndex === -1) {
    throw new Error("Could not find TOOLS_REGISTRY definition inside TS file.");
  }
  const startIndex = registryText.indexOf('[', arrayStartIndex);
  const endIndex = registryText.indexOf('];', startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Could not locate array brackets around registry tools.");
  }
  const arrayText = registryText.slice(startIndex, endIndex + 1);
  eval('tools = ' + arrayText);
} catch (err) {
  console.error('❌ Failed to parse tools-registry.ts array:', err.message);
  process.exit(1);
}

console.log(`🔍 Auditing registry containing ${tools.length} tool entries...`);

let errors = [];
let warnings = [];
const registeredSlugs = new Set();
const seoTitles = new Set();
const seoDescriptions = new Set();

// Audit each tool metadata entry
tools.forEach((tool, index) => {
  const toolName = tool.name || `Tool [Index ${index}]`;

  // Check unique slug id
  if (!tool.id) {
    errors.push(`Tool at index ${index} is missing mandatory 'id' parameter.`);
  } else {
    if (registeredSlugs.has(tool.id)) {
      errors.push(`Duplicate tool id registered: '${tool.id}'`);
    }
    registeredSlugs.add(tool.id);
  }

  // Check category reference
  if (!tool.category) {
    errors.push(`Tool '${toolName}' is missing 'category' definition.`);
  } else if (!categoriesList.includes(tool.category)) {
    errors.push(`Tool '${toolName}' category '${tool.category}' is invalid. Registered categories are: ${categoriesList.join(', ')}`);
  }

  // Check mandatory metadata fields
  const requiredFields = [
    'name', 'description', 'tags', 'keywords', 'icon', 
    'seoTitle', 'seoDescription', 'relatedTools', 'requirements', 'addedAt'
  ];
  requiredFields.forEach((field) => {
    if (tool[field] === undefined) {
      errors.push(`Tool '${toolName}' is missing mandatory field: '${field}'`);
    }
  });

  // Verify tags and keywords size
  if (Array.isArray(tool.tags) && tool.tags.length < 3) {
    warnings.push(`Tool '${toolName}' tags size is small (${tool.tags.length}). Recommend at least 3 tags.`);
  }
  if (Array.isArray(tool.keywords) && tool.keywords.length === 0) {
    warnings.push(`Tool '${toolName}' keywords array is empty.`);
  }

  // Verify unique SEO fields to detect duplicate content
  if (tool.seoTitle) {
    if (seoTitles.has(tool.seoTitle)) {
      warnings.push(`Duplicate SEO title detected: '${tool.seoTitle}' (Tool: ${toolName})`);
    }
    seoTitles.add(tool.seoTitle);
  }
  if (tool.seoDescription) {
    if (seoDescriptions.has(tool.seoDescription)) {
      warnings.push(`Duplicate SEO description detected: '${tool.seoDescription}' (Tool: ${toolName})`);
    }
    seoDescriptions.add(tool.seoDescription);
  }

  // Verify local isolated folders and assets for active tools
  if (tool.id && tool.status !== 'planned' && tool.status !== 'draft') {
    const toolFolder = path.join(__dirname, `../src/components/tools/${tool.id}`);
    const indexFile = path.join(toolFolder, 'index.tsx');
    const localeFolder = path.join(toolFolder, 'locales');
    const localeFile = path.join(localeFolder, 'en.json');

    if (!fs.existsSync(toolFolder)) {
      errors.push(`Tool '${toolName}' folder does not exist at: ${toolFolder}`);
    } else {
      if (!fs.existsSync(indexFile)) {
        errors.push(`Tool '${toolName}' entry component does not exist at: ${indexFile}`);
      }
      if (!fs.existsSync(localeFolder)) {
        errors.push(`Tool '${toolName}' locales directory does not exist at: ${localeFolder}`);
      } else if (!fs.existsSync(localeFile)) {
        errors.push(`Tool '${toolName}' translation file does not exist at: ${localeFile}`);
      } else {
        // Parse translation file json
        try {
          const localesText = fs.readFileSync(localeFile, 'utf8');
          const localesJson = JSON.parse(localesText);
          if (!localesJson.title || !localesJson.description) {
            errors.push(`Tool '${toolName}' en.json is missing required properties: 'title' or 'description'.`);
          }
        } catch (err) {
          errors.push(`Tool '${toolName}' en.json parsing failed: ${err.message}`);
        }
      }
    }
  }
});

// Verify relatedTools references
tools.forEach((tool) => {
  if (Array.isArray(tool.relatedTools)) {
    tool.relatedTools.forEach((relatedId) => {
      // Allow linking to registered slugs or the placeholders in registry
      if (!registeredSlugs.has(relatedId)) {
        errors.push(`Tool '${tool.name}' links to unregistered related tool ID: '${relatedId}'`);
      }
    });
  }
});

// Summary output
console.log('\n--- Auditing Summary ---');
if (warnings.length > 0) {
  console.warn(`⚠️ Warnings (${warnings.length}):`);
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

if (errors.length > 0) {
  console.error(`❌ Errors (${errors.length}):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  console.error('\nResult: Verification FAILED.');
  process.exit(1);
} else {
  console.log('✅ Result: Verification PASSED. All tool directories and configurations are compliant.');
  process.exit(0);
}
