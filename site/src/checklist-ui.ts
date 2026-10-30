import type { RequirementsData } from '../scripts/build-requirements-data.ts';
import type { createProgressStore } from './progress-store.ts';

type Store = ReturnType<typeof createProgressStore>;

export interface ChecklistOptions {
  confirm?: (message: string) => boolean;
}

const LABELS = {
  progress: 'Progresso',
  noteAndLink: 'Nota e link',
  notePlaceholder: 'Sua anotação',
  linkPlaceholder: 'Link de vídeo (YouTube, etc.)',
  reset: 'Zerar esta faixa',
  resetConfirm: 'Zerar todo o progresso desta faixa?',
};

export function mountChecklist(root: HTMLElement, data: RequirementsData, store: Store, opts: ChecklistOptions = {}) {
  const doc = root.ownerDocument;
  const confirmReset = opts.confirm ?? ((m: string) => globalThis.confirm(m));
  let selected = data.belts[0].id;

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...kids: (Node | string)[]) => {
    const node = doc.createElement(tag);
    Object.assign(node, props);
    node.append(...kids);
    return node;
  };

  function render() {
    const belt = data.belts.find((b) => b.id === selected)!;
    const total = belt.categories.reduce((n, c) => n + c.items.length, 0);

    const tabs = el('div', { role: 'tablist', className: 'belt-tabs' });
    for (const b of data.belts) {
      const tab = el('button', { type: 'button', role: 'tab', textContent: b.name, className: 'belt-tab' });
      tab.setAttribute('aria-selected', String(b.id === selected));
      tab.addEventListener('click', () => {
        selected = b.id;
        render();
      });
      tabs.append(tab);
    }

    const fill = el('div', { className: 'progress-fill' });
    const label = el('span', { className: 'progress-label' });
    const bar = el('div', { role: 'progressbar', className: 'progress' }, fill, label);
    bar.setAttribute('aria-label', LABELS.progress);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    const updateBar = () => {
      const pct = store.percent(belt.id, total);
      bar.setAttribute('aria-valuenow', String(pct));
      fill.style.width = `${pct}%`;
      label.textContent = `${pct}%`;
    };
    updateBar();

    const sections = belt.categories.map((cat) => {
      const list = el('ul', { className: 'requirements' });
      for (const item of cat.items) {
        const p = store.get(belt.id, item.id);
        const box = el('input', { type: 'checkbox', checked: p.completed });
        box.addEventListener('change', () => {
          store.toggle(belt.id, item.id);
          updateBar();
        });
        const note = el('textarea', { value: p.note, placeholder: LABELS.notePlaceholder, rows: 2 });
        note.addEventListener('input', () => store.setNote(belt.id, item.id, note.value));
        const link = el('input', { type: 'url', value: p.mediaUrl, placeholder: LABELS.linkPlaceholder });
        link.addEventListener('input', () => store.setMediaUrl(belt.id, item.id, link.value));
        list.append(
          el('li', {},
            el('label', {}, box, ' ', item.name),
            el('details', {}, el('summary', { textContent: LABELS.noteAndLink }), note, link),
          ),
        );
      }
      return el('section', { className: 'category' }, el('h2', { textContent: cat.name }), list);
    });

    const reset = el('button', { type: 'button', textContent: LABELS.reset, className: 'reset' });
    reset.dataset.action = 'reset';
    reset.addEventListener('click', () => {
      if (!confirmReset(LABELS.resetConfirm)) return;
      store.resetBelt(belt.id);
      render();
    });

    root.replaceChildren(tabs, bar, ...sections, reset);
  }

  render();
}
