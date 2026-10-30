import type { RequirementsData } from './types.ts';
import { stringsFor, type Strings } from './i18n.ts';
import type { createProgressStore } from './progress-store.ts';

type Store = ReturnType<typeof createProgressStore>;

export interface ChecklistOptions {
  confirm?: (message: string) => boolean;
  /** UI text. Defaults to Portuguese. */
  labels?: Strings;
}

export function mountChecklist(root: HTMLElement, data: RequirementsData, store: Store, opts: ChecklistOptions = {}) {
  const doc = root.ownerDocument;
  const LABELS = opts.labels ?? stringsFor('pt-BR');
  const confirmReset = opts.confirm ?? ((m: string) => globalThis.confirm(m));
  let selected = data.belts[0].id;

  const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...kids: (Node | string)[]) => {
    const node = doc.createElement(tag);
    Object.assign(node, props);
    node.append(...kids);
    return node;
  };

  function render() {
    const belt = data.belts.find((b) => b.id === selected)!;
    const ids = belt.categories.flatMap((c) => c.items.map((i) => i.id));

    const tabs = h('div', { role: 'tablist', className: 'belt-tabs' });
    for (const b of data.belts) {
      const tab = h('button', { type: 'button', role: 'tab', textContent: b.name, className: 'belt-tab' });
      tab.setAttribute('aria-selected', String(b.id === selected));
      tab.addEventListener('click', () => {
        selected = b.id;
        render();
      });
      tabs.append(tab);
    }

    const fill = h('div', { className: 'progress-fill' });
    const label = h('span', { className: 'progress-label' });
    const bar = h('div', { role: 'progressbar', className: 'progress' }, fill, label);
    bar.setAttribute('aria-label', LABELS.progress);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    const updateBar = () => {
      const pct = store.percent(belt.id, ids.length, ids);
      bar.setAttribute('aria-valuenow', String(pct));
      fill.style.width = `${pct}%`;
      label.textContent = `${pct}%`;
    };
    updateBar();

    const notice = h('p', { role: 'status', className: 'save-notice' });
    const refreshNotice = () => {
      notice.textContent = store.saveFailed() ? LABELS.saveFailed : '';
    };

    const sections = belt.categories.map((cat) => {
      const list = h('ul', { className: 'requirements' });
      for (const item of cat.items) {
        const p = store.get(belt.id, item.id);
        const box = h('input', { type: 'checkbox', checked: p.completed });
        box.addEventListener('change', () => {
          store.toggle(belt.id, item.id);
          updateBar();
          refreshNotice();
        });
        const note = h('textarea', { value: p.note, placeholder: LABELS.notePlaceholder, rows: 2 });
        note.addEventListener('input', () => {
          store.setNote(belt.id, item.id, note.value);
          refreshNotice();
        });
        const link = h('input', { type: 'url', value: p.mediaUrl, placeholder: LABELS.linkPlaceholder });
        link.addEventListener('input', () => {
          store.setMediaUrl(belt.id, item.id, link.value);
          refreshNotice();
        });
        list.append(
          h('li', {},
            h('label', {}, box, ' ', item.name),
            h('details', {}, h('summary', { textContent: LABELS.noteAndLink }), note, link),
          ),
        );
      }
      return h('section', { className: 'category' }, h('h2', { textContent: cat.name }), list);
    });

    const reset = h('button', { type: 'button', textContent: LABELS.reset, className: 'reset' });
    reset.dataset.action = 'reset';
    reset.addEventListener('click', () => {
      if (!confirmReset(LABELS.resetConfirm)) return;
      store.resetBelt(belt.id);
      render();
    });

    root.replaceChildren(tabs, bar, notice, ...sections, reset);
  }

  render();
}
