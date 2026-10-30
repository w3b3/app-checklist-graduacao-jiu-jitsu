import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildRequirementsData } from '../scripts/requirements-data.ts';

const swift = JSON.parse(
  readFileSync(new URL('../../ios-swiftui/Sources/BJJChecklist/Resources/default_curriculum.json', import.meta.url), 'utf8'),
);

const data = buildRequirementsData();
const allItems = data.belts.flatMap((b) => b.categories.flatMap((c) => c.items));

test('has the four belts in progression order', () => {
  assert.deepEqual(data.belts.map((b) => b.id), ['azul', 'roxa', 'marrom', 'preta']);
});

test('has the known number of requirements per belt', () => {
  const counts = Object.fromEntries(
    data.belts.map((b) => [b.id, b.categories.reduce((n, c) => n + c.items.length, 0)]),
  );
  assert.deepEqual(counts, { azul: 49, roxa: 40, marrom: 58, preta: 58 });
});

test('requirement ids are unique', () => {
  assert.equal(new Set(allItems.map((i) => i.id)).size, allItems.length);
});

test('matches the ids in the native iOS curriculum', () => {
  const swiftIds = swift.requirements.map((r: { id: string }) => r.id).sort();
  assert.deepEqual(allItems.map((i) => i.id).sort(), swiftIds);
});

test('agrees with the native iOS curriculum on belt, category and name of every id', () => {
  const web = new Map(
    data.belts.flatMap((b) => b.categories.flatMap((c) => c.items.map((i) => [i.id, `${b.id}|${c.name}|${i.name}`]))),
  );
  const mismatches = swift.requirements
    .map((r: { id: string; beltId: string; category: string; name: string }) => ({
      id: r.id,
      swift: `${r.beltId}|${r.category}|${r.name}`,
      web: web.get(r.id),
    }))
    .filter((m: { swift: string; web?: string }) => m.swift !== m.web);
  assert.deepEqual(mismatches, []);
});

test('keeps the Portuguese name and category of each requirement', () => {
  const first = data.belts[0].categories[0];
  assert.equal(first.name, 'Quedas');
  assert.deepEqual(first.items.map((i) => i.name), ['Double Leg', 'Single Leg']);
});
