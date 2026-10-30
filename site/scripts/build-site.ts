import { build } from 'esbuild';
import { mkdirSync, cpSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRequirementsData } from './requirements-data.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Pages to render. `path` is where the page lives in the built site. */
const pages = [
  { name: 'index', path: 'index.html', mainClass: 'landing' },
  { name: 'checklist', path: 'checklist/index.html', mainClass: 'app' },
  { name: 'privacy', path: 'privacy/index.html', mainClass: 'prose' },
  { name: 'support', path: 'support/index.html', mainClass: 'prose' },
];

/** Languages shipped. Add 'en-US' here once content/en-US exists (ship pt-BR only for now). */
const languages = ['pt-BR'];

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`missing template value: ${key}`);
    return values[key];
  });
}

const read = (...p: string[]) => readFileSync(join(root, ...p), 'utf8');

export async function buildSite(outDir: string) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(join(outDir, 'checklist'), { recursive: true });

  await build({
    entryPoints: [join(root, 'src/main.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2020',
    outfile: join(outDir, 'checklist/app.js'),
  });
  writeFileSync(join(outDir, 'checklist/requirements.json'), JSON.stringify(buildRequirementsData()));
  cpSync(join(root, 'public'), outDir, { recursive: true });

  const layout = read('pages/layout.html');
  const heroSize = JSON.parse(read('content/hero-checklist.json'));
  for (const lang of languages) {
    const strings = JSON.parse(read('content', lang, 'layout.json'));
    const meta = JSON.parse(read('content', lang, 'meta.json'));
    for (const page of pages) {
      const body = fill(read('content', lang, `${page.name}.html`), {
        heroW: String(heroSize.width),
        heroH: String(heroSize.height),
      });
      const html = fill(layout, { ...strings, ...meta[page.name], mainClass: page.mainClass, body });
      // First language lives at the site root; later ones would go under /<lang>/.
      const target = join(outDir, page.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, html);
    }
  }
}
