import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgressStore, STORAGE_KEY } from '../src/progress-store.ts';
import { memoryStorage } from './memory-storage.ts';

test('progress survives a reload (a new store over the same storage)', () => {
  const storage = memoryStorage();
  const first = createProgressStore(storage);
  first.toggle('azul', 'azul-quedas-1');
  first.setNote('azul', 'azul-quedas-1', 'nota');

  const second = createProgressStore(storage);
  assert.deepEqual(second.get('azul', 'azul-quedas-1'), { completed: true, note: 'nota', mediaUrl: '' });
});

test('a reset is persisted too', () => {
  const storage = memoryStorage();
  const first = createProgressStore(storage);
  first.toggle('azul', 'a');
  first.resetBelt('azul');
  assert.equal(createProgressStore(storage).completedCount('azul'), 0);
});

test('corrupted storage starts empty instead of crashing', () => {
  const store = createProgressStore(memoryStorage({ [STORAGE_KEY]: '{not json' }));
  assert.equal(store.completedCount('azul'), 0);
});

test('storage with an unexpected shape starts empty', () => {
  const store = createProgressStore(memoryStorage({ [STORAGE_KEY]: '[1,2,3]' }));
  assert.equal(store.completedCount('azul'), 0);
});

test('unreadable or full storage keeps working in memory', () => {
  const broken = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('quota');
    },
  };
  const store = createProgressStore(broken);
  store.toggle('azul', 'a');
  assert.equal(store.get('azul', 'a').completed, true);
});

test('stored entries with missing fields are filled in with defaults', () => {
  const storage = memoryStorage({
    [STORAGE_KEY]: JSON.stringify({ azul: { a: { completed: true } } }),
  });
  assert.deepEqual(createProgressStore(storage).get('azul', 'a'), { completed: true, note: '', mediaUrl: '' });
});
