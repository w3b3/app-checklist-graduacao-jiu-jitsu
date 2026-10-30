import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { buildSite } from '../scripts/build-site.ts';

const pagePaths = { '/': 'index.html', '/checklist/': 'checklist/index.html', '/privacy/': 'privacy/index.html', '/support/': 'support/index.html' };
let out: string;
const docs: Record<string, Document> = {};

before(async () => {
  out = mkdtempSync(join(tmpdir(), 'graduacao-site-'));
  await buildSite(out);
  for (const [url, file] of Object.entries(pagePaths)) docs[url] = new JSDOM(readFileSync(join(out, file), 'utf8')).window.document;
});
after(() => rmSync(out, { recursive: true, force: true }));

test('each page is built', () => {
  for (const file of Object.values(pagePaths)) assert.ok(existsSync(join(out, file)), file);
});

test('each page has one h1 and lang pt-BR', () => {
  for (const [url, doc] of Object.entries(docs)) {
    assert.equal(doc.querySelectorAll('h1').length, 1, url);
    assert.equal(doc.documentElement.lang, 'pt-BR', url);
  }
});

test('titles and meta descriptions are present and unique', () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const [url, doc] of Object.entries(docs)) {
    const title = doc.title.trim();
    const desc = doc.querySelector('meta[name=description]')?.getAttribute('content')?.trim();
    assert.ok(title, `title ${url}`);
    assert.ok(desc, `description ${url}`);
    titles.add(title);
    descriptions.add(desc!);
  }
  assert.equal(titles.size, 4);
  assert.equal(descriptions.size, 4);
});

test('internal links and assets resolve to built files', () => {
  for (const [url, doc] of Object.entries(docs)) {
    const refs = [...doc.querySelectorAll('a[href], img[src], link[href], script[src]')].map(
      (el) => el.getAttribute('href') ?? el.getAttribute('src')!,
    );
    for (const ref of refs) {
      if (!ref.startsWith('/')) continue;
      const path = ref.split(/[?#]/)[0];
      const file = join(out, path.endsWith('/') ? path + 'index.html' : path);
      assert.ok(existsSync(file), `${url} -> ${ref}`);
    }
  }
});

test('landing page has the CTA, store links and owner utm link', () => {
  const hrefs = [...docs['/'].querySelectorAll('a')].map((a) => a.getAttribute('href'));
  assert.ok(hrefs.includes('/checklist/'));
  assert.ok(hrefs.includes('https://apps.apple.com/app/id6754972177'));
  assert.ok(hrefs.includes('https://play.google.com/store/apps/details?id=com.brothersfight.bjjchecklist'));
  assert.ok(hrefs.includes('https://tatame0.com/pt/?utm_source=graduacao&utm_medium=site&utm_campaign=owner_cta'));
  assert.ok(hrefs.includes('https://tatame0.com/pt/'));
  for (const img of docs['/'].querySelectorAll('img')) assert.ok(img.getAttribute('alt'));
});

test('every page shares the site header and footer links', () => {
  for (const [url, doc] of Object.entries(docs)) {
    assert.equal(doc.querySelector('.site-header .brand')?.getAttribute('href'), '/', url);
    const footer = [...doc.querySelectorAll('.site-footer a')].map((a) => a.getAttribute('href'));
    assert.ok(footer.includes('/privacy/') && footer.includes('/support/'), url);
  }
});

test('privacy and support pages give the support email; privacy says no cookies', () => {
  for (const url of ['/privacy/', '/support/']) {
    assert.match(docs[url].body.textContent!, /suporte@tatame0\.com/);
  }
  assert.match(docs['/privacy/'].body.textContent!, /Não usamos cookies/);
});

test('no external script tags', () => {
  for (const [url, doc] of Object.entries(docs)) {
    for (const s of doc.querySelectorAll('script')) {
      assert.ok(!/^(https?:)?\/\//.test(s.getAttribute('src') ?? ''), url);
    }
  }
});

test('hero image stays small', () => {
  assert.ok(statSync(join(out, 'hero-checklist.webp')).size < 150 * 1024);
});
