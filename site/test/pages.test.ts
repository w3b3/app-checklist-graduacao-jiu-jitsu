import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { buildSite } from '../scripts/build-site.ts';

const ORIGIN = 'https://graduacao.tatame0.com';
const slugs = ['', 'checklist/', 'privacy/', 'support/'];
const langs = [
  { code: 'pt-BR', prefix: '', switchLabel: 'EN', ownersUrl: 'https://tatame0.com/pt/?utm_source=graduacao&utm_medium=site&utm_campaign=owner_cta', byUrl: 'https://tatame0.com/pt/', noCookies: /Não usamos cookies/ },
  { code: 'en-US', prefix: '/en', switchLabel: 'PT', ownersUrl: 'https://tatame0.com/?utm_source=graduacao&utm_medium=site&utm_campaign=owner_cta', byUrl: 'https://tatame0.com/', noCookies: /We don't use cookies/ },
];
const urlOf = (prefix: string, slug: string) => `${prefix}/${slug}`;
const fileOf = (url: string) => (url.endsWith('/') ? url + 'index.html' : url).slice(1);

let out: string;
const docs: Record<string, Document> = {};

before(async () => {
  out = mkdtempSync(join(tmpdir(), 'graduacao-site-'));
  await buildSite(out);
  for (const l of langs) for (const slug of slugs) {
    const url = urlOf(l.prefix, slug);
    docs[url] = new JSDOM(readFileSync(join(out, fileOf(url)), 'utf8')).window.document;
  }
});
after(() => rmSync(out, { recursive: true, force: true }));

for (const l of langs) {
  const urls = slugs.map((s) => urlOf(l.prefix, s));
  const home = urlOf(l.prefix, '');
  const sub = (slug: string) => docs[urlOf(l.prefix, slug)];

  test(`[${l.code}] each page is built`, () => {
    for (const url of urls) assert.ok(existsSync(join(out, fileOf(url))), url);
  });

  test(`[${l.code}] each page has one h1 and the right lang`, () => {
    for (const url of urls) {
      assert.equal(docs[url].querySelectorAll('h1').length, 1, url);
      assert.equal(docs[url].documentElement.lang, l.code, url);
    }
  });

  test(`[${l.code}] titles and meta descriptions are present and unique`, () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const url of urls) {
      const title = docs[url].title.trim();
      const desc = docs[url].querySelector('meta[name=description]')?.getAttribute('content')?.trim();
      assert.ok(title, `title ${url}`);
      assert.ok(desc, `description ${url}`);
      titles.add(title);
      descriptions.add(desc!);
    }
    assert.equal(titles.size, 4);
    assert.equal(descriptions.size, 4);
  });

  test(`[${l.code}] internal links and assets resolve to built files`, () => {
    for (const url of urls) {
      const refs = [...docs[url].querySelectorAll('a[href], img[src], link[href], script[src]')].map(
        (el) => el.getAttribute('href') ?? el.getAttribute('src')!,
      );
      for (const ref of refs) {
        if (!ref.startsWith('/')) continue;
        assert.ok(existsSync(join(out, fileOf(ref.split(/[?#]/)[0]))), `${url} -> ${ref}`);
      }
    }
  });

  test(`[${l.code}] landing page has the CTA, store links and owner utm link`, () => {
    const hrefs = [...docs[home].querySelectorAll('a')].map((a) => a.getAttribute('href'));
    assert.ok(hrefs.includes(urlOf(l.prefix, 'checklist/')));
    assert.ok(hrefs.includes('https://apps.apple.com/app/id6754972177'));
    assert.ok(hrefs.includes('https://play.google.com/store/apps/details?id=com.brothersfight.bjjchecklist'));
    assert.ok(hrefs.includes(l.ownersUrl));
    assert.ok(hrefs.includes(l.byUrl));
    for (const img of docs[home].querySelectorAll('img')) assert.ok(img.getAttribute('alt'));
  });

  test(`[${l.code}] every page shares the site header and footer links`, () => {
    for (const url of urls) {
      assert.equal(docs[url].querySelector('.site-header .brand')?.getAttribute('href'), home, url);
      const footer = [...docs[url].querySelectorAll('.site-footer a')].map((a) => a.getAttribute('href'));
      assert.ok(footer.includes(urlOf(l.prefix, 'privacy/')) && footer.includes(urlOf(l.prefix, 'support/')), url);
    }
  });

  test(`[${l.code}] privacy and support give the support email; privacy says no cookies`, () => {
    for (const slug of ['privacy/', 'support/']) assert.match(sub(slug).body.textContent!, /suporte@tatame0\.com/);
    assert.match(sub('privacy/').body.textContent!, l.noCookies);
  });

  test(`[${l.code}] checklist page loads the shared script`, () => {
    assert.match(sub('checklist/').querySelector('script[src]')?.getAttribute('src') ?? '', /^\/checklist\/app-[0-9a-f]{10}\.js$/);
    assert.ok(sub('checklist/').getElementById('checklist'));
  });
}

test('the language switch links to the same page in the other language', () => {
  for (const slug of slugs) {
    const pt = docs[urlOf('', slug)];
    const en = docs[urlOf('/en', slug)];
    assert.equal(pt.querySelector('.lang-switch a')?.getAttribute('href'), urlOf('/en', slug));
    assert.equal(pt.querySelector('.lang-switch a')?.textContent, 'EN');
    assert.equal(pt.querySelector('.lang-switch [aria-current]')?.textContent, 'PT');
    assert.equal(en.querySelector('.lang-switch a')?.getAttribute('href'), urlOf('', slug));
    assert.equal(en.querySelector('.lang-switch a')?.textContent, 'PT');
    assert.equal(en.querySelector('.lang-switch [aria-current]')?.textContent, 'EN');
  }
});

test('hreflang alternates are present, absolute, self-referencing and reciprocal', () => {
  const alternates = (doc: Document) =>
    Object.fromEntries([...doc.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]));
  for (const slug of slugs) {
    const expected = {
      'pt-BR': ORIGIN + urlOf('', slug),
      'en-US': ORIGIN + urlOf('/en', slug),
      'x-default': ORIGIN + urlOf('', slug),
    };
    for (const prefix of ['', '/en']) {
      const doc = docs[urlOf(prefix, slug)];
      assert.deepEqual(alternates(doc), expected, urlOf(prefix, slug));
      assert.equal(doc.querySelector('link[rel=canonical]')?.getAttribute('href'), ORIGIN + urlOf(prefix, slug));
    }
  }
});

test('no external script tags', () => {
  for (const [url, doc] of Object.entries(docs)) {
    for (const s of doc.querySelectorAll('script')) {
      assert.ok(!/^(https?:)?\/\//.test(s.getAttribute('src') ?? ''), url);
    }
  }
});

test('each language ships its own requirements.json with the same ids', () => {
  const read = (f: string) => JSON.parse(readFileSync(join(out, f), 'utf8'));
  const ids = (d: any) => d.belts.flatMap((b: any) => b.categories.flatMap((c: any) => c.items.map((i: any) => i.id)));
  const pt = read('checklist/requirements.json');
  const en = read('en/checklist/requirements.json');
  assert.deepEqual(ids(en), ids(pt));
  assert.equal(pt.belts[0].name, 'Azul');
  assert.equal(en.belts[0].name, 'Blue');
});

test('hero image stays small', () => {
  assert.ok(statSync(join(out, 'hero-checklist.webp')).size < 150 * 1024);
});
