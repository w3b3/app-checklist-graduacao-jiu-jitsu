import { REQUIREMENTS } from '../../src/data/requirements.ts';
import { BELT_ORDER } from '../../src/data/belts.ts';
import type { RequirementsData } from '../src/types.ts';

/** Per-language names. Ids never change; only the display text does. */
export interface NameTranslation {
  belts: Record<string, string>;
  categories: Record<string, string>;
  names: Record<string, string>;
}

/** Builds the checklist data. Without a translation you get the Portuguese source text. */
export function buildRequirementsData(tr?: NameTranslation): RequirementsData {
  const pick = (table: Record<string, string> | undefined, key: string, kind: string) => {
    if (!table) return key;
    const v = table[key];
    if (!v) throw new Error(`missing ${kind} translation: ${key}`);
    return v;
  };
  return {
    belts: BELT_ORDER.map((belt) => {
      const categories = new Map<string, { id: string; name: string }[]>();
      for (const r of REQUIREMENTS.filter((r) => r.belt === belt.id)) {
        const category = pick(tr?.categories, r.category, 'category');
        if (!categories.has(category)) categories.set(category, []);
        categories.get(category)!.push({ id: r.id, name: tr ? pick(tr.names, r.id, 'name') : r.name });
      }
      return {
        id: belt.id,
        name: tr ? pick(tr.belts, belt.id, 'belt') : belt.displayName,
        color: belt.color,
        textColor: belt.textColor,
        lightColor: belt.lightColor,
        categories: [...categories].map(([name, items]) => ({ name, items })),
      };
    }),
  };
}
