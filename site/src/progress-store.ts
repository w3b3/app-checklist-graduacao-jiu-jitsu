export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RequirementProgress {
  completed: boolean;
  note: string;
  mediaUrl: string;
}

type State = Record<string, Record<string, RequirementProgress>>;

export const STORAGE_KEY = 'graduacao.progress.v1';

const EMPTY: RequirementProgress = { completed: false, note: '', mediaUrl: '' };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function load(storage: StorageLike): State {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return {};
    const state: State = {};
    for (const [belt, items] of Object.entries(parsed)) {
      if (!isRecord(items)) continue;
      state[belt] = {};
      for (const [id, p] of Object.entries(items)) {
        if (!isRecord(p)) continue;
        state[belt][id] = {
          completed: p.completed === true,
          note: typeof p.note === 'string' ? p.note : '',
          mediaUrl: typeof p.mediaUrl === 'string' ? p.mediaUrl : '',
        };
      }
    }
    return state;
  } catch {
    return {};
  }
}

export function createProgressStore(storage: StorageLike) {
  const state: State = load(storage);

  let saveFailed = false;
  const save = () => {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      saveFailed = false;
    } catch {
      // Private mode or full storage: keep working in memory, and let the UI say so.
      saveFailed = true;
    }
  };

  const entry = (belt: string, id: string): RequirementProgress => {
    state[belt] ??= {};
    return (state[belt][id] ??= { ...EMPTY });
  };

  const completedCount = (belt: string, ids?: string[]) =>
    Object.entries(state[belt] ?? {}).filter(([id, p]) => p.completed && (!ids || ids.includes(id))).length;

  return {
    get: (belt: string, id: string): RequirementProgress => ({ ...(state[belt]?.[id] ?? EMPTY) }),
    toggle(belt: string, id: string) {
      const e = entry(belt, id);
      e.completed = !e.completed;
      save();
    },
    setNote(belt: string, id: string, note: string) {
      entry(belt, id).note = note;
      save();
    },
    setMediaUrl(belt: string, id: string, mediaUrl: string) {
      entry(belt, id).mediaUrl = mediaUrl;
      save();
    },
    completedCount,
    /** Ticked requirements across every belt. */
    totalCompleted: () =>
      Object.values(state).reduce((n, items) => n + Object.values(items).filter((p) => p.completed).length, 0),
    saveFailed: () => saveFailed,
    percent(belt: string, total: number, ids?: string[]) {
      return total === 0 ? 0 : Math.min(100, Math.round((completedCount(belt, ids) / total) * 100));
    },
    resetBelt(belt: string) {
      delete state[belt];
      save();
    },
  };
}
