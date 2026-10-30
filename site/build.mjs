import { build } from 'esbuild';
import { mkdirSync, copyFileSync, cpSync, rmSync, writeFileSync } from 'node:fs';
import { buildRequirementsData } from './scripts/requirements-data.ts';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/checklist', { recursive: true });

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  outfile: 'dist/checklist/app.js',
});

writeFileSync('dist/checklist/requirements.json', JSON.stringify(buildRequirementsData()));
copyFileSync('pages/checklist.html', 'dist/checklist/index.html');
cpSync('public', 'dist', { recursive: true });
console.log('built dist/');
