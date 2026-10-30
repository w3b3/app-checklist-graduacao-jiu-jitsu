import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { buildRequirementsData } from '../scripts/requirements-data.ts';
import { createProgressStore, STORAGE_KEY } from '../src/progress-store.ts';
import { mountChecklist } from '../src/checklist-ui.ts';
import { memoryStorage } from './memory-storage.ts';
import { stringsFor } from '../src/i18n.ts';
import { readFileSync } from 'node:fs';

const data = buildRequirementsData();

function setup(initial: Record<string, string> = {}, confirmAnswer = true) {
  const dom = new JSDOM('<!doctype html><main id="root"></main>');
  const { document } = dom.window;
  const storage = memoryStorage(initial);
  const store = createProgressStore(storage);
  const root = document.getElementById('root')!;
  mountChecklist(root, data, store, { confirm: () => confirmAnswer });
  const checkboxes = () => [...root.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
  const bar = () => root.querySelector('[role=progressbar]')!;
  const tab = (name: string) =>
    [...root.querySelectorAll<HTMLButtonElement>('[role=tab]')].find((t) => t.textContent === name)!;
  return { root, storage, checkboxes, bar, tab, document };
}

test('shows the four belt tabs and the first belt\'s 49 requirements', () => {
  const { root, checkboxes } = setup();
  const tabs = [...root.querySelectorAll('[role=tab]')].map((t) => t.textContent);
  assert.deepEqual(tabs, ['Azul', 'Roxa', 'Marrom', 'Preta']);
  assert.equal(checkboxes().length, 49);
});

test('ticking a requirement moves the progress bar and saves it', () => {
  const { checkboxes, bar, storage } = setup();
  assert.equal(bar().getAttribute('aria-valuenow'), '0');
  checkboxes()[0].click();
  assert.equal(bar().getAttribute('aria-valuenow'), '2'); // 1 of 49
  assert.equal(JSON.parse(storage.data[STORAGE_KEY]).azul['azul-quedas-1'].completed, true);
});

test('switching belt shows that belt\'s requirements and its own progress', () => {
  const { checkboxes, bar, tab } = setup();
  checkboxes()[0].click();
  tab('Roxa').click();
  assert.equal(checkboxes().length, 40);
  assert.equal(bar().getAttribute('aria-valuenow'), '0');
  tab('Azul').click();
  assert.equal(bar().getAttribute('aria-valuenow'), '2');
  assert.equal(checkboxes()[0].checked, true);
});

test('restores ticked requirements from storage on load', () => {
  const stored = JSON.stringify({ azul: { 'azul-quedas-1': { completed: true, note: '', mediaUrl: '' } } });
  const { checkboxes, bar } = setup({ [STORAGE_KEY]: stored });
  assert.equal(checkboxes()[0].checked, true);
  assert.equal(bar().getAttribute('aria-valuenow'), '2');
});

test('a note typed on a requirement is saved', () => {
  const { root, storage } = setup();
  const note = root.querySelector<HTMLTextAreaElement>('textarea')!;
  note.value = 'Treinar entrada baixa';
  note.dispatchEvent(new note.ownerDocument.defaultView!.Event('input', { bubbles: true }));
  assert.equal(JSON.parse(storage.data[STORAGE_KEY]).azul['azul-quedas-1'].note, 'Treinar entrada baixa');
});

test('reset asks first: declining keeps progress, accepting clears the belt', () => {
  const declined = setup({}, false);
  declined.checkboxes()[0].click();
  declined.root.querySelector<HTMLButtonElement>('[data-action=reset]')!.click();
  assert.equal(declined.checkboxes()[0].checked, true);

  const accepted = setup({}, true);
  accepted.checkboxes()[0].click();
  accepted.root.querySelector<HTMLButtonElement>('[data-action=reset]')!.click();
  assert.equal(accepted.checkboxes()[0].checked, false);
  assert.equal(accepted.bar().getAttribute('aria-valuenow'), '0');
});

test('warns when the browser refuses to save, and stays quiet otherwise', () => {
  const dom = new JSDOM('<!doctype html><main id="root"></main>');
  const root = dom.window.document.getElementById('root')!;
  let failing = true;
  const flaky = {
    getItem: () => null,
    setItem: () => {
      if (failing) throw new Error('quota');
    },
  };
  mountChecklist(root, data, createProgressStore(flaky), { confirm: () => true });
  const notice = () => root.querySelector('[role=status]')!;
  assert.equal(notice().textContent, '');
  root.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
  assert.match(notice().textContent!, /não foi possível salvar/i);
  failing = false;
  root.querySelectorAll<HTMLInputElement>('input[type=checkbox]')[1].click();
  assert.equal(notice().textContent, '');
});

test('English: tabs, labels, shared storage key and ids, and the save warning', () => {
  const names = JSON.parse(readFileSync(new URL('../content/en/requirement-names.json', import.meta.url), 'utf8'));
  const en = buildRequirementsData(names);
  const dom = new JSDOM('<!doctype html><main id="root"></main>');
  const root = dom.window.document.getElementById('root')!;
  const storage = memoryStorage();
  mountChecklist(root, en, createProgressStore(storage), { confirm: () => true, labels: stringsFor('en-US') });

  assert.deepEqual([...root.querySelectorAll('[role=tab]')].map((t) => t.textContent), ['Blue', 'Purple', 'Brown', 'Black']);
  assert.equal(root.querySelector('[role=progressbar]')!.getAttribute('aria-label'), 'Progress');
  assert.equal(root.querySelector('h2')!.textContent, 'Takedowns');
  assert.equal(root.querySelector('summary')!.textContent, 'Note and link');
  assert.equal(root.querySelector('textarea')!.placeholder, 'Your note');
  assert.equal(root.querySelector('[data-action=reset]')!.textContent, 'Reset this belt');
  assert.equal(root.querySelectorAll('input[type=checkbox]').length, 49);

  root.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
  // Same key and same id as the Portuguese page, so progress carries over between languages.
  assert.equal(JSON.parse(storage.data[STORAGE_KEY]).azul['azul-quedas-1'].completed, true);
});

test('English: the save failure notice is in English', () => {
  const dom = new JSDOM('<!doctype html><main id="root"></main>');
  const root = dom.window.document.getElementById('root')!;
  const failing = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
  mountChecklist(root, data, createProgressStore(failing), { labels: stringsFor('en-US') });
  root.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
  assert.match(root.querySelector('[role=status]')!.textContent!, /could not save/i);
});

test('language is picked from the page lang, with Portuguese as the fallback', () => {
  assert.equal(stringsFor('en-US').dataUrl, '/en/checklist/requirements.json');
  assert.equal(stringsFor('en').dataUrl, '/en/checklist/requirements.json');
  assert.equal(stringsFor('pt-BR').dataUrl, '/checklist/requirements.json');
  assert.equal(stringsFor('').dataUrl, '/checklist/requirements.json');
  assert.match(stringsFor('en-US').loadFailed, /Could not load/);
});

// ---- App upsell ----

import { UPSELL_DISMISSED_KEY } from '../src/checklist-ui.ts';

function upsellSetup(opts: { initial?: Record<string, string>; prefs?: ReturnType<typeof memoryStorage>; lang?: string } = {}) {
  const dom = new JSDOM('<!doctype html><main id="root"></main>');
  const root = dom.window.document.getElementById('root')!;
  const storage = memoryStorage(opts.initial);
  const prefs = opts.prefs ?? memoryStorage();
  const events: [string, Record<string, string> | undefined][] = [];
  const names = opts.lang === 'en-US' ? JSON.parse(readFileSync(new URL('../content/en/requirement-names.json', import.meta.url), 'utf8')) : undefined;
  mountChecklist(root, buildRequirementsData(names), createProgressStore(storage), {
    confirm: () => true,
    prefs,
    labels: stringsFor(opts.lang ?? 'pt-BR'),
    track: (e, p) => void events.push([e, p]),
  });
  const boxes = () => [...root.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
  const banner = () => root.querySelector('.upsell-banner');
  const complete = () => root.querySelector('.upsell-complete');
  return { root, storage, prefs, events, boxes, banner, complete };
}

test('the soft banner appears exactly at the 5th tick, not before', () => {
  const { boxes, banner, events } = upsellSetup();
  for (let i = 0; i < 4; i++) boxes()[i].click();
  assert.equal(banner(), null);
  assert.deepEqual(events, []);
  boxes()[4].click();
  assert.ok(banner());
  assert.deepEqual(events, [['upsell_shown', { where: 'banner' }]]);
});

test('the 5 ticks count across belts', () => {
  const { root, boxes, banner } = upsellSetup();
  for (let i = 0; i < 3; i++) boxes()[i].click();
  [...root.querySelectorAll<HTMLButtonElement>('[role=tab]')].find((t) => t.textContent === 'Roxa')!.click();
  boxes()[0].click();
  assert.equal(banner(), null);
  boxes()[1].click();
  assert.ok(banner());
});

test('the banner is an accessible region with store badges and a focusable close button', () => {
  const { boxes, banner } = upsellSetup();
  for (let i = 0; i < 5; i++) boxes()[i].click();
  const el = banner()!;
  assert.equal(el.closest('[role=status]') !== null, true);
  assert.ok(el.getAttribute('aria-label'));
  const links = [...el.querySelectorAll<HTMLAnchorElement>('a[data-store]')];
  assert.deepEqual(links.map((a) => [a.dataset.store, a.dataset.where]), [['app_store', 'banner'], ['google_play', 'banner']]);
  assert.ok(links.every((a) => a.querySelector('img')!.alt));
  const close = el.querySelector<HTMLButtonElement>('button.upsell-close')!;
  assert.equal(close.type, 'button');
  assert.ok(close.getAttribute('aria-label'));
});

test('dismissing hides the banner, stores the preference and survives a reload', () => {
  const first = upsellSetup();
  for (let i = 0; i < 5; i++) first.boxes()[i].click();
  first.root.querySelector<HTMLButtonElement>('.upsell-close')!.click();
  assert.equal(first.banner(), null);
  assert.equal(first.prefs.data[UPSELL_DISMISSED_KEY], '1');
  first.boxes()[5].click(); // more ticks do not bring it back
  assert.equal(first.banner(), null);

  const reloaded = upsellSetup({ initial: first.storage.data, prefs: first.prefs });
  assert.equal(reloaded.banner(), null);
  assert.deepEqual(reloaded.events, []);
});

test('the banner is shown again on reload if it was not dismissed', () => {
  const first = upsellSetup();
  for (let i = 0; i < 5; i++) first.boxes()[i].click();
  const reloaded = upsellSetup({ initial: first.storage.data });
  assert.ok(reloaded.banner());
});

test('clicking a badge reports upsell_click with its placement and store', () => {
  const { root, boxes, events } = upsellSetup();
  for (let i = 0; i < 5; i++) boxes()[i].click();
  events.length = 0;
  root.querySelector<HTMLAnchorElement>('a[data-store=google_play]')!.addEventListener('click', (e) => e.preventDefault());
  root.querySelector<HTMLAnchorElement>('a[data-store=google_play]')!.click();
  assert.deepEqual(events, [['upsell_click', { where: 'banner', store: 'google_play' }]]);
});

test('reaching 100% on a belt shows the stronger belt-complete prompt once', () => {
  const { boxes, banner, complete, events } = upsellSetup();
  const n = boxes().length;
  for (let i = 0; i < n - 1; i++) boxes()[i].click();
  assert.equal(complete(), null);
  assert.ok(banner());
  boxes()[n - 1].click();
  assert.ok(complete());
  assert.equal(banner(), null);
  assert.match(complete()!.textContent!, /Faixa Azul completa/);
  assert.match(complete()!.textContent!, /levar seu progresso para o app/);
  assert.deepEqual([...complete()!.querySelectorAll<HTMLAnchorElement>('a[data-store]')].map((a) => a.dataset.where), ['belt_complete', 'belt_complete']);
  assert.deepEqual(events.map((e) => e[1]!.where), ['banner', 'belt_complete']);
  assert.equal(events.filter((e) => e[0] === 'upsell_shown').length, 2);
});

test('English copy for banner and belt-complete', () => {
  const { boxes, banner, complete } = upsellSetup({ lang: 'en-US' });
  for (let i = 0; i < 5; i++) boxes()[i].click();
  assert.match(banner()!.textContent!, /works offline/);
  assert.equal(banner()!.querySelector('img[src*=google-play-en]') !== null, true);
  const n = boxes().length;
  for (let i = 5; i < n; i++) boxes()[i].click();
  assert.match(complete()!.textContent!, /Blue belt complete!/);
});

test('a throwing tracker or unusable preference storage never breaks the checklist', () => {
  const dom = new JSDOM('<!doctype html><main id="root"></main>');
  const root = dom.window.document.getElementById('root')!;
  const broken = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
  mountChecklist(root, data, createProgressStore(memoryStorage()), {
    prefs: broken,
    track: () => { throw new Error('boom'); },
  });
  const boxes = [...root.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
  assert.doesNotThrow(() => boxes.slice(0, 5).forEach((b) => b.click()));
  assert.ok(root.querySelector('.upsell-banner'));
  assert.doesNotThrow(() => root.querySelector<HTMLButtonElement>('.upsell-close')!.click());
  assert.equal(root.querySelector('.upsell-banner'), null);
});
