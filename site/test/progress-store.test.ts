import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgressStore } from '../src/progress-store.ts';
import { memoryStorage } from './memory-storage.ts';

const fresh = () => createProgressStore(memoryStorage());

test('an untouched requirement is incomplete with an empty note and link', () => {
  assert.deepEqual(fresh().get('azul', 'azul-quedas-1'), { completed: false, note: '', mediaUrl: '' });
});

test('toggling completes a requirement, toggling again undoes it', () => {
  const s = fresh();
  s.toggle('azul', 'azul-quedas-1');
  assert.equal(s.get('azul', 'azul-quedas-1').completed, true);
  s.toggle('azul', 'azul-quedas-1');
  assert.equal(s.get('azul', 'azul-quedas-1').completed, false);
});

test('a note and a link are kept alongside completion', () => {
  const s = fresh();
  s.toggle('azul', 'azul-quedas-1');
  s.setNote('azul', 'azul-quedas-1', 'Treinar entrada baixa');
  s.setMediaUrl('azul', 'azul-quedas-1', 'https://youtu.be/abc');
  assert.deepEqual(s.get('azul', 'azul-quedas-1'), {
    completed: true,
    note: 'Treinar entrada baixa',
    mediaUrl: 'https://youtu.be/abc',
  });
});

test('percent is the rounded share of completed requirements in a belt', () => {
  const s = fresh();
  s.toggle('azul', 'a');
  s.toggle('azul', 'b');
  s.toggle('azul', 'c');
  assert.equal(s.completedCount('azul'), 3);
  assert.equal(s.percent('azul', 8), 38); // 37.5 rounds up
  assert.equal(s.percent('azul', 3), 100);
  assert.equal(s.percent('roxa', 40), 0);
});

test('resetting a belt clears only that belt', () => {
  const s = fresh();
  s.toggle('azul', 'a');
  s.setNote('azul', 'a', 'x');
  s.toggle('roxa', 'r');
  s.resetBelt('azul');
  assert.deepEqual(s.get('azul', 'a'), { completed: false, note: '', mediaUrl: '' });
  assert.equal(s.get('roxa', 'r').completed, true);
});

test('percent ignores completed ids that are no longer in the belt', () => {
  const s = fresh();
  s.toggle('azul', 'a');
  s.toggle('azul', 'removed-later');
  assert.equal(s.percent('azul', 1, ['a']), 100);
  assert.equal(s.completedCount('azul', ['a']), 1);
});
