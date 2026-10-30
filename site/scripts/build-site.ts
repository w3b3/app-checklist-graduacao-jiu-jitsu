import { build } from 'esbuild';
import { mkdirSync, cpSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRequirementsData, type NameTranslation } from './requirements-data.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const SITE_ORIGIN = 'https://graduacao.tatame0.com';

/** Pages to render. `slug` is the path under the language root ('' is the home page). */
const pages = [
  { name: 'index', slug: '', mainClass: 'landing' },
  { name: 'checklist', slug: 'checklist/', mainClass: 'app' },
  { name: 'privacy', slug: 'privacy/', mainClass: 'prose' },
  { name: 'support', slug: 'support/', mainClass: 'prose' },
];

/**
 * Languages shipped. `dir` is the folder under the site root ('' = the root itself) and
 * `short` is the label in the language switch. Content lives in content/<content>/.
 * The first entry is also the x-default.
 */
const languages = [
  { code: 'pt-BR', content: 'pt-BR', dir: '', short: 'PT' },
  { code: 'en-US', content: 'en', dir: 'en', short: 'EN' },
];

/** Site-relative URL of a page in a language, e.g. /en/checklist/ */
export const pageUrl = (lang: (typeof languages)[number], slug: string) =>
  `/${lang.dir ? lang.dir + '/' : ''}${slug}`;

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
  cpSync(join(root, 'public'), outDir, { recursive: true });

  const layout = read('pages/layout.html');
  const heroSize = JSON.parse(read('content/hero-checklist.json'));
  for (const lang of languages) {
    const strings = JSON.parse(read('content', lang.content, 'layout.json'));
    const meta = JSON.parse(read('content', lang.content, 'meta.json'));
    const prefix = lang.dir ? `/${lang.dir}` : '';

    // Each language gets its own data file; ids are identical so progress is shared.
    const namesFile = join('content', lang.content, 'requirement-names.json');
    const translation: NameTranslation | undefined = existsSync(join(root, namesFile))
      ? JSON.parse(read(namesFile))
      : undefined;
    mkdirSync(join(outDir, lang.dir, 'checklist'), { recursive: true });
    writeFileSync(
      join(outDir, lang.dir, 'checklist/requirements.json'),
      JSON.stringify(buildRequirementsData(translation)),
    );

    for (const page of pages) {
      const alternates = [
        ...languages.map((l) => ({ hreflang: l.code, url: SITE_ORIGIN + pageUrl(l, page.slug) })),
        { hreflang: 'x-default', url: SITE_ORIGIN + pageUrl(languages[0], page.slug) },
      ]
        .map((a) => `  <link rel="alternate" hreflang="${a.hreflang}" href="${a.url}">`)
        .join('\n');
      const langSwitch =
        `      <span class="lang-switch" role="group" aria-label="${strings.langLabel}">` +
        languages
          .map((l) =>
            l.code === lang.code
              ? `<span aria-current="true">${l.short}</span>`
              : `<a href="${pageUrl(l, page.slug)}" hreflang="${l.code}" lang="${l.code}">${l.short}</a>`,
          )
          .join('<span aria-hidden="true">|</span>') +
        '</span>';
      const body = fill(read('content', lang.content, `${page.name}.html`), {
        heroW: String(heroSize.width),
        heroH: String(heroSize.height),
        prefix,
        ownersUrl: strings.ownersUrl,
      });
      const html = fill(layout, {
        ...strings,
        ...meta[page.name],
        mainClass: page.mainClass,
        body,
        canonical: SITE_ORIGIN + pageUrl(lang, page.slug),
        alternates,
        langSwitch,
        homeHref: pageUrl(lang, ''),
        checklistHref: pageUrl(lang, 'checklist/'),
        privacyHref: pageUrl(lang, 'privacy/'),
        supportHref: pageUrl(lang, 'support/'),
      });
      const target = join(outDir, lang.dir, page.slug, 'index.html');
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, html);
    }
  }
}
