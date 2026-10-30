import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { startBeacon, isOptedOut, defaultSend } from '../src/beacon.ts';

function page(url = 'https://graduacao.tatame0.com/en/checklist/?utm_source=ig&utm_medium=bio&utm_campaign=oct', referrer = 'https://www.google.com/search?q=x', nav: Record<string, unknown> = {}) {
  const dom = new JSDOM(
    '<!doctype html><html lang="en-US"><body><a id="a" data-store="app_store" data-where="hero" href="#x">a</a><a id="b" data-store="google_play" data-where="banner" href="#y">b</a><a id="c" href="#z">c</a></body>',
    { url, referrer },
  );
  const win: any = dom.window;
  for (const [k, v] of Object.entries(nav)) Object.defineProperty(win.navigator, k, { value: v, configurable: true });
  const sent: string[] = [];
  return { win, sent, send: (u: string) => void sent.push(u) };
}
const q = (u: string) => Object.fromEntries(new URL(u, 'https://x').searchParams);

test('page_view carries path, language, referrer host only and utm tags', () => {
  const { win, sent, send } = page();
  startBeacon(win, send);
  assert.equal(sent.length, 1);
  assert.ok(sent[0].startsWith('/_e?'));
  assert.match(sent[0], /path=\/en\/checklist\/&/); // readable in the nginx log
  assert.deepEqual(q(sent[0]), { e: 'page_view', path: '/en/checklist/', lang: 'en-US', ref: 'google.com', utm_source: 'ig', utm_medium: 'bio', utm_campaign: 'oct' });
});

test('a same-site referrer is not reported, and no utm means no utm params', () => {
  const { win, sent, send } = page('https://graduacao.tatame0.com/', 'https://graduacao.tatame0.com/en/');
  startBeacon(win, send);
  assert.deepEqual(q(sent[0]), { e: 'page_view', path: '/', lang: 'en-US' });
});

test('store badge clicks send badge_click with store and placement; other links do not', () => {
  const { win, sent, send } = page();
  startBeacon(win, send);
  sent.length = 0;
  win.document.getElementById('a').click();
  win.document.getElementById('b').click();
  win.document.getElementById('c').click();
  assert.equal(sent.length, 2);
  assert.deepEqual([q(sent[0]).e, q(sent[0]).store, q(sent[0]).where], ['badge_click', 'app_store', 'hero']);
  assert.deepEqual([q(sent[1]).e, q(sent[1]).store, q(sent[1]).where], ['badge_click', 'google_play', 'banner']);
});

test('an unknown store or placement is ignored', () => {
  const { win, sent, send } = page();
  startBeacon(win, send);
  sent.length = 0;
  const a = win.document.getElementById('a');
  a.dataset.store = 'evil';
  a.click();
  a.dataset.store = 'app_store';
  a.dataset.where = 'nowhere';
  a.click();
  assert.equal(sent.length, 0);
});

test('Do Not Track, Global Privacy Control and webdriver send nothing', () => {
  for (const nav of [{ doNotTrack: '1' }, { globalPrivacyControl: true }, { webdriver: true }, { msDoNotTrack: '1' }]) {
    const { win, sent, send } = page(undefined, undefined, nav);
    assert.equal(isOptedOut(win), true, JSON.stringify(nav));
    assert.equal(startBeacon(win, send), null);
    win.document.getElementById('a').click();
    assert.equal(sent.length, 0, JSON.stringify(nav));
    assert.equal(win.graduacaoTrack, undefined);
  }
});

test('without opt-out signals it measures', () => {
  const { win } = page(undefined, undefined, { doNotTrack: '0' });
  assert.equal(isOptedOut(win), false);
});

test('a failing sender is swallowed', () => {
  const { win } = page();
  assert.doesNotThrow(() => {
    const track = startBeacon(win, () => {
      throw new Error('network');
    })!;
    track('upsell_shown', { where: 'banner' });
    win.document.getElementById('a').click();
  });
});

test('the default sender falls back to fetch and swallows every failure', async () => {
  const calls: unknown[] = [];
  const win: any = {
    navigator: { sendBeacon: () => false },
    fetch: (u: string, o: unknown) => (calls.push([u, o]), Promise.reject(new Error('offline'))),
  };
  assert.doesNotThrow(() => defaultSend(win)('/_e?e=x'));
  assert.deepEqual(calls, [['/_e?e=x', { method: 'POST', keepalive: true }]]);
  await new Promise((r) => setTimeout(r, 0)); // no unhandled rejection
  const broken: any = { navigator: { sendBeacon: () => { throw new Error('x'); } }, fetch: () => { throw new Error('y'); } };
  assert.doesNotThrow(() => defaultSend(broken)('/_e'));
});

test('the default sender prefers sendBeacon', () => {
  const beacons: string[] = [];
  const win: any = { navigator: { sendBeacon: (u: string) => (beacons.push(u), true) }, fetch: () => assert.fail('no fetch') };
  defaultSend(win)('/_e?e=y');
  assert.deepEqual(beacons, ['/_e?e=y']);
});
