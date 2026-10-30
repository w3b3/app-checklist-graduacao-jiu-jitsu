import { createProgressStore } from './progress-store.ts';
import { mountChecklist } from './checklist-ui.ts';
import { stringsFor } from './i18n.ts';
import type { RequirementsData } from './types.ts';

const root = document.getElementById('checklist');

async function start(el: HTMLElement) {
  // The page picks the language (<html lang>); progress storage is shared across languages.
  const labels = stringsFor(document.documentElement.lang);
  try {
    const res = await fetch(labels.dataUrl);
    if (!res.ok) throw new Error(String(res.status));
    const data: RequirementsData = await res.json();
    mountChecklist(el, data, createProgressStore(window.localStorage), { labels });
  } catch {
    el.textContent = labels.loadFailed;
  }
}

if (root) start(root);
