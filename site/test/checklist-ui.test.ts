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
