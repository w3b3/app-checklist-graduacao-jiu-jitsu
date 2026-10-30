// First-party, anonymous measurement: one small POST to /_e on our own origin per event.
// nginx answers 204 and writes one log line. No cookies, no storage, no ids, no third parties.

export type Send = (url: string) => void;
export type Track = (event: string, props?: Record<string, string>) => void;

export const EVENT_PATH = '/_e';
const STORES = ['app_store', 'google_play'];
const PLACEMENTS = ['hero', 'landing', 'banner', 'belt_complete', 'header'];

const clip = (v: unknown, max = 100) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Do Not Track, Global Privacy Control and automated browsers get no measurement at all. */
export function isOptedOut(win: any): boolean {
  const nav = win.navigator ?? {};
  const on = (v: unknown) => v === '1' || v === 'yes' || v === true;
  return on(nav.doNotTrack) || on(win.doNotTrack) || on(nav.msDoNotTrack) || nav.globalPrivacyControl === true || nav.webdriver === true;
}

export function defaultSend(win: any): Send {
  return (url) => {
    try {
      if (win.navigator.sendBeacon?.(url)) return;
    } catch {}
    try {
      Promise.resolve(win.fetch(url, { method: 'POST', keepalive: true })).catch(() => {});
    } catch {}
  };
}

export function createTracker(win: any, send: Send): Track {
  return (event, props = {}) => {
    try {
      const q = new URLSearchParams({ e: clip(event, 30), path: clip(win.location.pathname, 200), lang: clip(win.document.documentElement.lang, 10) });
      for (const [k, v] of Object.entries(props)) if (clip(v)) q.set(k, clip(v));
      // nginx logs the raw query string, so keep slashes readable (they are legal in a query).
      send(`${EVENT_PATH}?${q.toString().replace(/%2F/gi, '/')}`);
    } catch {
      // Measuring must never break the page.
    }
  };
}

function pageViewProps(win: any): Record<string, string> {
  const props: Record<string, string> = {};
  try {
    const host = new URL(win.document.referrer).hostname.toLowerCase().replace(/^www\./, '');
    if (host && host !== win.location.hostname.toLowerCase().replace(/^www\./, '')) props.ref = host;
  } catch {}
  try {
    const params = new URLSearchParams(win.location.search);
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) if (params.get(k)) props[k] = clip(params.get(k));
  } catch {}
  return props;
}

/** Starts measuring; returns the tracker, or null when the visitor opted out. */
export function startBeacon(win: any, send: Send = defaultSend(win)): Track | null {
  if (isOptedOut(win)) return null;
  const track = createTracker(win, send);
  win.graduacaoTrack = track;
  track('page_view', pageViewProps(win));
  win.document.addEventListener(
    'click',
    (ev: any) => {
      try {
        const a = ev.target?.closest?.('a[data-store]');
        const store = a?.dataset.store;
        const where = a?.dataset.where;
        if (STORES.includes(store) && PLACEMENTS.includes(where)) track('badge_click', { store, where });
      } catch {}
    },
    true,
  );
  return track;
}
