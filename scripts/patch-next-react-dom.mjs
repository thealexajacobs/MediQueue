import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const patterns = [
  // next dist/compiled/react-dom (used by webpack client bundle)
  'node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js',
  'node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.production.js',
  'node_modules/next/dist/compiled/react-dom/cjs/react-dom-profiling.development.js',
  'node_modules/next/dist/compiled/react-dom/cjs/react-dom-profiling.profiling.js',
  // experimental variants
  'node_modules/next/dist/compiled/react-dom-experimental/cjs/react-dom-client.development.js',
  'node_modules/next/dist/compiled/react-dom-experimental/cjs/react-dom-client.production.js',
  'node_modules/next/dist/compiled/react-dom-experimental/cjs/react-dom-profiling.development.js',
  'node_modules/next/dist/compiled/react-dom-experimental/cjs/react-dom-profiling.profiling.js',
];

const root = resolve(import.meta.dirname, '..');

let patched = 0;

for (const rel of patterns) {
  const file = resolve(root, rel);
  try {
    let content = readFileSync(file, 'utf-8');
    let updated = content;

    // Pattern 1: development files (void 0 !== destroy &&)
    updated = updated.replace(
      /void\s+0\s*!==\s*destroy\s*&&/g,
      'typeof destroy === \'function\' &&'
    );

    // Pattern 2: production files (if (void 0 !== destroy) {)
    updated = updated.replace(
      /if\s*\(\s*void\s+0\s*!==\s*destroy\s*\)\s*\{/g,
      'if (typeof destroy === \'function\') {'
    );

    if (updated !== content) {
      writeFileSync(file, updated, 'utf-8');
      patched++;
      console.log(`  ✓ patched: ${rel}`);
    }
  } catch {
    // file doesn't exist — skip
  }
}

if (patched > 0) {
  console.log(`\n✅ Patched ${patched} Next.js bundled react-dom file(s)`);
} else {
  console.log('  No files needed patching (already patched?)');
}
