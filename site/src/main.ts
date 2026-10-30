import { createProgressStore } from './progress-store.ts';
import { mountChecklist } from './checklist-ui.ts';
import type { RequirementsData } from './types.ts';

const root = document.getElementById('checklist');

async function start(el: HTMLElement) {
  try {
    const res = await fetch('/checklist/requirements.json');
    if (!res.ok) throw new Error(String(res.status));
    const data: RequirementsData = await res.json();
    mountChecklist(el, data, createProgressStore(window.localStorage));
  } catch {
    el.textContent = 'Não foi possível carregar o checklist. Recarregue a página.';
  }
}

if (root) start(root);
