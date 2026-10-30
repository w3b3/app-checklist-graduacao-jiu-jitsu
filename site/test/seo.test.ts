import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { buildSite, SITE_ORIGIN } from '../scripts/build-site.ts';

const out = mkdtempSync(join(tmpdir(), 'site-'));
const pages = [
  { lang: 'pt-BR', path: '', jsonTypes: ['MobileApplication', 'WebSite'] },
  { lang: 'pt-BR', path: 'checklist/', jsonTypes: ['BreadcrumbList'] },
  { lang: 'pt-BR', path: 'privacy/', jsonTypes: ['BreadcrumbList'] },
  { lang: 'pt-BR', path: 'support/', jsonTypes: ['BreadcrumbList'] },
  { lang: 'en-US', path: 'en/', jsonTypes: ['MobileApplication', 'WebSite'] },
  { lang: 'en-US', path: 'en/checklist/', jsonTypes: ['BreadcrumbList'] },
  { lang: 'en-US', path: 'en/privacy/', jsonTypes: ['BreadcrumbList'] },
  { lang: 'en-US', path: 'en/support/', jsonTypes: ['BreadcrumbList'] },
];

const dom = (rel: string) => new JSDOM(readFileSync(join(out, rel), 'utf8')).window.document;
const content = (d: Document, sel: string) => d.querySelector(sel)?.getAttribute('content') ?? '';

before(async () => {
  await buildSite(out);
});

test('every page+language has a unique title and description within length limits', () => {
  const titles = new Set<string>();
  const descs = new Set<string>();
  for (const p of pages) {
    const d = dom(join(p.path, 'index.html'));
    const title = d.title;
    const desc = content(d, 'meta[name=description]');
    assert.ok(title.length > 0 && title.length <= 60, `${p.path} title length ${title.length}`);
    assert.ok(desc.length >= 60 && desc.length <= 155, `${p.path} description length ${desc.length}`);
    assert.ok(!titles.has(title), `duplicate title ${title}`);
    assert.ok(!descs.has(desc), `duplicate description ${desc}`);
    titles.add(title);
    descs.add(desc);
  }
});

test('exactly one canonical, absolute https, self-referencing, with trailing slash', () => {
  for (const p of pages) {
    const d = dom(join(p.path, 'index.html'));
    const c = d.querySelectorAll('link[rel=canonical]');
    assert.equal(c.length, 1, p.path);
    assert.equal(c[0].getAttribute('href'), `${SITE_ORIGIN}/${p.path}`);
    assert.ok(!d.querySelector('meta[name=robots]'), `${p.path} must be indexable`);
  }
});

test('hreflang alternates are reciprocal, unique and self-inclusive', () => {
  const alts = (p: string) => {
    const d = dom(join(p, 'index.html'));
    return [...d.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]);
  };
  for (const p of pages) {
    const a = alts(p.path);
    assert.equal(new Set(a.map((x) => x[0])).size, a.length, `duplicate hreflang on ${p.path}`);
    assert.deepEqual(a.map((x) => x[0]).sort(), ['en-US', 'pt-BR', 'x-default']);
    for (const [, href] of a) {
      const target = new URL(href!).pathname.slice(1);
      assert.deepEqual(alts(target), a, `${p.path} -> ${target} not reciprocal`);
    }
  }
});

test('Open Graph and X card tags are complete with absolute URLs and real images under 300 KB', () => {
  for (const p of pages) {
    const d = dom(join(p.path, 'index.html'));
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:site_name', 'og:locale', 'og:image', 'og:image:alt']) {
      assert.ok(content(d, `meta[property="${prop}"]`), `${p.path} missing ${prop}`);
    }
    assert.equal(content(d, 'meta[property="og:type"]'), 'website');
    assert.equal(content(d, 'meta[name="twitter:card"]'), 'summary_large_image');
    assert.equal(content(d, 'meta[property="og:title"]'), d.title);
    assert.equal(content(d, 'meta[property="og:url"]'), `${SITE_ORIGIN}/${p.path}`);
    assert.equal(content(d, 'meta[property="og:image:width"]'), '1200');
    assert.equal(content(d, 'meta[property="og:image:height"]'), '630');
    assert.ok(d.querySelector('meta[property="og:locale:alternate"]'));
    const img = content(d, 'meta[property="og:image"]');
    assert.ok(img.startsWith(`${SITE_ORIGIN}/`));
    const file = join(out, new URL(img).pathname);
    assert.ok(existsSync(file), `${img} not built`);
    assert.ok(statSync(file).size < 300 * 1024, `${img} too large`);
    assert.ok(img.includes(p.lang === 'pt-BR' ? 'og-image-pt' : 'og-image-en'));
  }
});

test('JSON-LD parses and has the right @type; app data is honest', () => {
  for (const p of pages) {
    const d = dom(join(p.path, 'index.html'));
    const blocks = [...d.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent!));
    assert.deepEqual(blocks.map((b) => b['@type']), p.jsonTypes, p.path);
    for (const b of blocks) assert.equal(b['@context'], 'https://schema.org');
    const app = blocks.find((b) => b['@type'] === 'MobileApplication');
    if (app) {
      assert.equal(app.offers.price, '0');
      assert.equal(app.inLanguage, p.lang);
      assert.equal(app.publisher.url, 'https://tatame0.com');
      assert.equal(app.applicationCategory, 'SportsApplication');
      assert.ok(app.downloadUrl.every((u: string) => u.startsWith('https://')));
      assert.ok(!('aggregateRating' in app) && !('review' in app));
    }
    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    if (crumbs) {
      assert.equal(crumbs.itemListElement.length, 2);
      assert.equal(crumbs.itemListElement[1].item, `${SITE_ORIGIN}/${p.path}`);
    }
  }
});

test('sitemap lists every page with reciprocal hreflang alternates and a lastmod', () => {
  const xml = readFileSync(join(out, 'sitemap.xml'), 'utf8');
  const doc = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  const urls = [...doc.getElementsByTagName('url')];
  const locs = urls.map((u) => u.getElementsByTagName('loc')[0].textContent);
  assert.equal(locs.length, pages.length);
  for (const p of pages) assert.ok(locs.includes(`${SITE_ORIGIN}/${p.path}`), p.path);
  for (const u of urls) {
    assert.match(u.getElementsByTagName('lastmod')[0].textContent!, /^\d{4}-\d{2}-\d{2}$/);
    const hrefs = [...u.getElementsByTagName('xhtml:link')].map((l) => l.getAttribute('href'));
    assert.equal(hrefs.length, 3);
  }
  // each listed URL is an alternate of every URL that lists it
  const alt = new Map(urls.map((u) => [u.getElementsByTagName('loc')[0].textContent, [...u.getElementsByTagName('xhtml:link')].map((l) => l.getAttribute('href')!)]));
  for (const [loc, hrefs] of alt) for (const h of hrefs) if (h !== `${SITE_ORIGIN}/` || alt.has(h)) assert.ok(alt.get(h)?.includes(loc!), `${loc} <-> ${h}`);
});

test('robots.txt allows all and points at the sitemap, without blocking assets', () => {
  const robots = readFileSync(join(out, 'robots.txt'), 'utf8');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.doesNotMatch(robots, /^Disallow: \S/m);
  assert.match(robots, new RegExp(`^Sitemap: ${SITE_ORIGIN}/sitemap\\.xml$`, 'm'));
});

test('assets are fingerprinted and every local reference in the HTML resolves to a built file', () => {
  for (const p of pages) {
    const d = dom(join(p.path, 'index.html'));
    const css = d.querySelector('link[rel=stylesheet][href^="/"]')!.getAttribute('href')!;
    assert.match(css, /^\/styles-[0-9a-f]{10}\.css$/);
    for (const el of d.querySelectorAll('link[href^="/"], script[src^="/"], img[src^="/"]')) {
      const url = el.getAttribute('href') ?? el.getAttribute('src')!;
      assert.ok(existsSync(join(out, url.split('?')[0])), `${p.path}: ${url} does not exist`);
    }
  }
  for (const p of pages.filter((x) => x.path.endsWith('checklist/'))) {
    const js = dom(join(p.path, 'index.html')).querySelector('script[src]')!.getAttribute('src')!;
    assert.match(js, /^\/checklist\/app-[0-9a-f]{10}\.js$/);
  }
  assert.ok(!existsSync(join(out, 'styles.css')) && !existsSync(join(out, 'checklist/app.js')));
});

test('landing hero image is not lazy, has dimensions, and every img has width/height/alt', () => {
  for (const p of pages) {
    const d = dom(join(p.path, 'index.html'));
    for (const img of d.querySelectorAll('img')) {
      assert.ok(img.getAttribute('width') && img.getAttribute('height'), `${p.path} img without size`);
      assert.notEqual(img.getAttribute('loading'), 'lazy');
      assert.ok(img.hasAttribute('alt'));
    }
  }
  for (const root of ['', 'en/']) {
    assert.equal(dom(join(root, 'index.html')).querySelector('.hero-fig img')!.getAttribute('fetchpriority'), 'high');
  }
});

test('Google Fonts URL swaps fonts in (display=swap) and fonts are preconnected', () => {
  const d = dom('index.html');
  assert.ok([...d.querySelectorAll('link[rel=stylesheet]')].some((l) => l.getAttribute('href')!.includes('display=swap')));
  assert.ok(d.querySelector('link[rel=preconnect][href="https://fonts.gstatic.com"]'));
});

test('404 page exists, is noindex, and has no canonical or social tags', () => {
  const d = dom('404.html');
  assert.match(content(d, 'meta[name=robots]'), /noindex/);
  assert.ok(!d.querySelector('link[rel=canonical]'));
  assert.ok(!d.querySelector('meta[property^="og:"]'));
  assert.equal(d.querySelectorAll('h1').length, 1);
  assert.match(d.querySelector('link[rel=stylesheet][href^="/styles-"]')!.getAttribute('href')!, /^\/styles-[0-9a-f]{10}\.css$/);
  assert.ok(readdirSync(out).includes('404.html'));
});
