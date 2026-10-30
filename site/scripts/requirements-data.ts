import { REQUIREMENTS } from '../../src/data/requirements.ts';
import { BELT_ORDER } from '../../src/data/belts.ts';
import type { RequirementsData } from '../src/types.ts';

export function buildRequirementsData(): RequirementsData {
  return {
    belts: BELT_ORDER.map((belt) => {
      const categories = new Map<string, { id: string; name: string }[]>();
      for (const r of REQUIREMENTS.filter((r) => r.belt === belt.id)) {
        if (!categories.has(r.category)) categories.set(r.category, []);
        categories.get(r.category)!.push({ id: r.id, name: r.name });
      }
      return {
        id: belt.id,
        name: belt.displayName,
        color: belt.color,
        textColor: belt.textColor,
        lightColor: belt.lightColor,
        categories: [...categories].map(([name, items]) => ({ name, items })),
      };
    }),
  };
}
