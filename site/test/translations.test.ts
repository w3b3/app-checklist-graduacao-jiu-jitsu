import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildRequirementsData, type NameTranslation } from '../scripts/requirements-data.ts';

const en: NameTranslation = JSON.parse(readFileSync(new URL('../content/en/requirement-names.json', import.meta.url), 'utf8'));
const pt = buildRequirementsData();
const items = (d: ReturnType<typeof buildRequirementsData>) => d.belts.flatMap((b) => b.categories.flatMap((c) => c.items));
const ptIds = items(pt).map((i) => i.id);

test('every requirement id has a non-empty English name, and there are no extras', () => {
  assert.equal(ptIds.length, 205);
  const missing = ptIds.filter((id) => !en.names[id]?.trim());
  assert.deepEqual(missing, []);
  assert.deepEqual(Object.keys(en.names).filter((id) => !ptIds.includes(id)), []);
});

test('every category and belt has a non-empty English name, and there are no extras', () => {
  const cats = new Set(pt.belts.flatMap((b) => b.categories.map((c) => c.name)));
  assert.equal(cats.size, 14);
  assert.deepEqual([...cats].filter((c) => !en.categories[c]?.trim()), []);
  assert.deepEqual(Object.keys(en.categories).filter((c) => !cats.has(c)), []);
  assert.deepEqual(pt.belts.filter((b) => !en.belts[b.id]?.trim()).map((b) => b.id), []);
  assert.deepEqual(Object.keys(en.belts).sort(), pt.belts.map((b) => b.id).sort());
});

test('PT and EN data have identical belts, ids and structure', () => {
  const enData = buildRequirementsData(en);
  const shape = (d: typeof pt) => d.belts.map((b) => ({ id: b.id, color: b.color, categories: b.categories.map((c) => c.items.map((i) => i.id)) }));
  assert.deepEqual(shape(enData), shape(pt));
  assert.equal(enData.belts[0].categories[0].name, 'Takedowns');
  assert.equal(enData.belts[0].categories[0].items[0].name, 'Double Leg');
});

test('a missing translation fails the build instead of leaking Portuguese', () => {
  const broken = { ...en, names: { ...en.names, 'azul-quedas-1': '' } };
  assert.throws(() => buildRequirementsData(broken), /missing name translation: azul-quedas-1/);
});
