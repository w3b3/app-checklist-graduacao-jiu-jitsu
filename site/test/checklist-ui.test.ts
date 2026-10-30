import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { buildRequirementsData } from '../scripts/build-requirements-data.ts';
import { createProgressStore, STORAGE_KEY } from '../src/progress-store.ts';
import { mountChecklist } from '../src/checklist-ui.ts';
import { memoryStorage } from './memory-storage.ts';

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
