import { build } from 'esbuild';
import { mkdirSync, cpSync, rmSync, writeFileSync, readFileSync, existsSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildRequirementsData, type NameTranslation } from './requirements-data.ts';
import { buildHead, buildRobots, buildSitemap, breadcrumbList, softwareApplication, webSite, type Alternate } from './seo.ts';

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

/** Short content hash used to fingerprint assets, e.g. styles-1a2b3c4d5e.css */
const hashOf = (content: string | Buffer) => createHash('sha256').update(content).digest('hex').slice(0, 10);

/** Renames outDir/<name>.<ext> to <name>-<hash>.<ext> and returns the site-relative URL. */
function fingerprint(outDir: string, rel: string): string {
  const abs = join(outDir, rel);
  const dot = rel.lastIndexOf('.');
  const hashed = `${rel.slice(0, dot)}-${hashOf(readFileSync(abs))}${rel.slice(dot)}`;
  renameSync(abs, join(outDir, hashed));
  return '/' + hashed;
}

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
  await build({
    entryPoints: [join(root, 'src/beacon-entry.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2020',
    outfile: join(outDir, 'b.js'),
  });
  cpSync(join(root, 'public'), outDir, { recursive: true });
  // Content-hashed names: a changed file gets a new URL, so no cache can serve it stale.
  const stylesHref = fingerprint(outDir, 'styles.css');
  const appJs = fingerprint(outDir, 'checklist/app.js');
  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemapEntries: { url: string; alternates: Alternate[] }[] = [];

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
      const alternates: Alternate[] = [
        ...languages.map((l) => ({ hreflang: l.code, url: SITE_ORIGIN + pageUrl(l, page.slug) })),
        { hreflang: 'x-default', url: SITE_ORIGIN + pageUrl(languages[0], page.slug) },
      ];
      const canonical = SITE_ORIGIN + pageUrl(lang, page.slug);
      sitemapEntries.push({ url: canonical, alternates });
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
        appJs,
      });
      const html = fill(layout, {
        ...strings,
        ...meta[page.name],
        mainClass: page.mainClass,
        body,
        stylesHref,
        seoHead: buildHead({
          origin: SITE_ORIGIN,
          title: meta[page.name].title,
          description: meta[page.name].description,
          canonical,
          alternates,
          ogLocale: strings.ogLocale,
          ogAlternateLocales: languages.filter((l) => l.code !== lang.code).map(() => strings.ogAlternateLocale),
          siteName: strings.ogSiteName,
          imageUrl: SITE_ORIGIN + strings.ogImage,
          imageAlt: strings.ogImageAlt,
          jsonLd:
            page.name === 'index'
              ? [
                  softwareApplication({
                    name: strings.appName,
                    url: canonical,
                    inLanguage: lang.code,
                    description: meta[page.name].description,
                    image: SITE_ORIGIN + strings.ogImage,
                  }),
                  webSite({ name: strings.appName, url: canonical, inLanguage: lang.code }),
                ]
              : [
                  breadcrumbList([
                    { name: strings.brand, url: SITE_ORIGIN + pageUrl(lang, '') },
                    { name: meta[page.name].crumb, url: canonical },
                  ]),
                ],
        }),
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

  // Friendly bilingual 404 (nginx serves it with a real 404 status), kept out of the index.
  const pt = JSON.parse(read('content', 'pt-BR', 'layout.json'));
  const notFound = fill(layout, {
    ...pt,
    title: 'Página não encontrada | Page not found',
    description: 'Página não encontrada. Page not found.',
    mainClass: 'prose',
    body: read('content', '404.html'),
    stylesHref,
    seoHead: buildHead({
      origin: SITE_ORIGIN, title: '', description: '', canonical: '', alternates: [], ogLocale: '',
      ogAlternateLocales: [], siteName: '', imageUrl: '', imageAlt: '', jsonLd: [], noindex: true,
    }),
    langSwitch: '',
    homeHref: '/',
    checklistHref: '/checklist/',
    privacyHref: '/privacy/',
    supportHref: '/support/',
  });
  writeFileSync(join(outDir, '404.html'), notFound);

  writeFileSync(join(outDir, 'sitemap.xml'), buildSitemap(sitemapEntries, lastmod));
  writeFileSync(join(outDir, 'robots.txt'), buildRobots(SITE_ORIGIN));
}
