import type { RequirementsData } from './types.ts';
import { stringsFor, APP_STORE_URL, PLAY_URL, type Strings } from './i18n.ts';
import type { createProgressStore, StorageLike } from './progress-store.ts';

type Store = ReturnType<typeof createProgressStore>;

/** UI preference (not tracking): the visitor closed the soft app banner. */
export const UPSELL_DISMISSED_KEY = 'graduacao.upsell.dismissed.v1';
/** Ticks (across all belts) before the soft app banner shows. */
export const UPSELL_THRESHOLD = 5;

export interface ChecklistOptions {
  confirm?: (message: string) => boolean;
  /** UI text. Defaults to Portuguese. */
  labels?: Strings;
  /** Where UI preferences live. Defaults to localStorage when it is usable. */
  prefs?: StorageLike;
  /** Anonymous event sink (see beacon.ts). Defaults to doing nothing. */
  track?: (event: string, props?: Record<string, string>) => void;
}

export function mountChecklist(root: HTMLElement, data: RequirementsData, store: Store, opts: ChecklistOptions = {}) {
  const doc = root.ownerDocument;
  const LABELS = opts.labels ?? stringsFor('pt-BR');
  const confirmReset = opts.confirm ?? ((m: string) => globalThis.confirm(m));
  let selected = data.belts[0].id;
  const track = (event: string, props?: Record<string, string>) => {
    try {
      opts.track?.(event, props);
    } catch {}
  };
  const prefs: StorageLike | undefined = opts.prefs ?? (() => {
    try {
      return globalThis.localStorage;
    } catch {
      return undefined;
    }
  })();
  const isDismissed = () => {
    try {
      return prefs?.getItem(UPSELL_DISMISSED_KEY) === '1';
    } catch {
      return false;
    }
  };
  let dismissed = isDismissed();
  let bannerOn = false; // once the soft banner shows it stays until closed
  const shown = new Set<string>(); // each prompt reports "shown" once per page load

  const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, ...kids: (Node | string)[]) => {
    const node = doc.createElement(tag);
    Object.assign(node, props);
    node.append(...kids);
    return node;
  };

  function badges(where: string) {
    const link = (href: string, store: string, src: string, alt: string, width: number) => {
      const img = h('img', { src, alt, width, height: 40 });
      const a = h('a', { href }, img);
      a.dataset.store = store;
      a.dataset.where = where;
      a.addEventListener('click', () => track('upsell_click', { where, store }));
      return a;
    };
    return h('p', { className: 'stores' },
      link(APP_STORE_URL, 'app_store', '/badges/app-store.svg', LABELS.appStoreAlt, 120),
      link(PLAY_URL, 'google_play', LABELS.playBadge, LABELS.playAlt, 135),
    );
  }

  const reportShown = (where: string) => {
    if (shown.has(where)) return;
    shown.add(where);
    track('upsell_shown', { where });
  };

  /** The belt-complete prompt wins over the soft banner; only one shows at a time. */
  function renderUpsell(slot: HTMLElement, belt: { name: string }, pct: number) {
    if (store.totalCompleted() >= UPSELL_THRESHOLD && !dismissed) bannerOn = true;
    if (pct >= 100) {
      const where = 'belt_complete';
      const title = LABELS.completeTitle.replace('{belt}', belt.name);
      reportShown(where);
      slot.replaceChildren(
        h('section', { className: 'upsell upsell-complete', ariaLabel: title },
          h('h2', { textContent: title }),
          h('p', { textContent: LABELS.completeBody }),
          badges(where),
          h('p', { className: 'upsell-note', textContent: LABELS.completeNote }),
        ),
      );
    } else if (bannerOn && !dismissed) {
      reportShown('banner');
      const close = h('button', { type: 'button', className: 'upsell-close', textContent: '×' });
      close.setAttribute('aria-label', LABELS.upsellClose);
      close.addEventListener('click', () => {
        dismissed = true;
        bannerOn = false;
        try {
          prefs?.setItem(UPSELL_DISMISSED_KEY, '1');
        } catch {}
        slot.replaceChildren();
      });
      const section = h('section', { className: 'upsell upsell-banner' },
        h('h2', { textContent: LABELS.upsellTitle }),
        h('p', { textContent: LABELS.upsellBody }),
        badges('banner'),
        close,
      );
      section.setAttribute('aria-label', LABELS.upsellTitle);
      slot.replaceChildren(section);
    } else {
      slot.replaceChildren();
    }
  }

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

    const upsellSlot = h('div', { className: 'upsell-slot', role: 'status' });
    const refreshUpsell = () => renderUpsell(upsellSlot, belt, store.percent(belt.id, ids.length, ids));
    refreshUpsell();

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
          refreshUpsell();
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

    root.replaceChildren(tabs, bar, notice, upsellSlot, ...sections, reset);
  }

  render();
}
