/**
 * Sync Service
 *
 * Handles syncing local progress with the backend.
 * Uses a queue system to batch changes and sync when online.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncProgress, SyncProgressResponse } from '../api/progress';
import { getDefaultList } from '../api/lists';
import { BeltProgress, RequirementProgress } from '../types';

const SYNC_QUEUE_KEY = 'bjj-sync-queue';
const LAST_SYNCED_KEY = 'bjj-last-synced';
const DEFAULT_LIST_ID_KEY = 'bjj-default-list-id';

interface PendingChange {
  id: string;
  techniqueKey: string;
  data: Partial<RequirementProgress>;
  timestamp: number;
}

interface SyncQueue {
  changes: PendingChange[];
  lastSyncedAt: string | null;
}

/**
 * Get the sync queue from storage
 */
async function getSyncQueue(): Promise<SyncQueue> {
  try {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading sync queue:', error);
  }
  return { changes: [], lastSyncedAt: null };
}

/**
 * Save the sync queue to storage
 */
async function saveSyncQueue(queue: SyncQueue): Promise<void> {
  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Add a change to the sync queue
 */
export async function queueChange(
  techniqueKey: string,
  data: Partial<RequirementProgress>
): Promise<void> {
  const queue = await getSyncQueue();

  // Remove any existing change for this technique
  queue.changes = queue.changes.filter((c) => c.techniqueKey !== techniqueKey);

  // Add new change
  queue.changes.push({
    id: `${techniqueKey}-${Date.now()}`,
    techniqueKey,
    data,
    timestamp: Date.now(),
  });

  await saveSyncQueue(queue);
}

/**
 * Clear the sync queue
 */
export async function clearSyncQueue(): Promise<void> {
  await saveSyncQueue({ changes: [], lastSyncedAt: new Date().toISOString() });
}

/**
 * Get the default list ID (fetched from server)
 */
export async function getDefaultListId(): Promise<string | null> {
  try {
    // Check cache first
    const cached = await AsyncStorage.getItem(DEFAULT_LIST_ID_KEY);
    if (cached) {
      return cached;
    }

    // Fetch from server
    const result = await getDefaultList();
    if (result.list) {
      await AsyncStorage.setItem(DEFAULT_LIST_ID_KEY, result.list.id);
      return result.list.id;
    }
  } catch (error) {
    console.error('Error getting default list ID:', error);
  }
  return null;
}

/**
 * Convert local progress format to API format
 */
function convertProgressForSync(
  progress: { [beltId: string]: BeltProgress }
): Record<string, { completed: boolean; note: string; mediaUrl: string; updatedAt: string }> {
  const result: Record<string, { completed: boolean; note: string; mediaUrl: string; updatedAt: string }> = {};

  for (const [beltId, beltProgress] of Object.entries(progress)) {
    for (const [reqId, reqProgress] of Object.entries(beltProgress)) {
      // The reqId in local storage is the full technique key (e.g., 'azul-quedas-1')
      result[reqId] = {
        completed: reqProgress.completed,
        note: reqProgress.note || '',
        mediaUrl: reqProgress.mediaUrl || '',
        updatedAt: new Date().toISOString(), // We don't track this locally, use now
      };
    }
  }

  return result;
}

/**
 * Convert API progress format to local format
 */
function convertProgressFromSync(
  apiProgress: Record<string, { completed: boolean; note: string; mediaUrl: string }>
): { [beltId: string]: BeltProgress } {
  const result: { [beltId: string]: BeltProgress } = {};

  for (const [techniqueKey, progress] of Object.entries(apiProgress)) {
    // Extract belt from technique key (e.g., 'azul-quedas-1' -> 'azul')
    const beltId = techniqueKey.split('-')[0];

    if (!result[beltId]) {
      result[beltId] = {};
    }

    result[beltId][techniqueKey] = {
      completed: progress.completed,
      note: progress.note || '',
      mediaUrl: progress.mediaUrl || '',
      photoUri: undefined, // Photos are local-only
    };
  }

  return result;
}

/**
 * Sync progress with the server
 *
 * @param localProgress Current local progress
 * @param onProgressUpdate Callback to update local progress with merged result
 * @returns True if sync was successful
 */
export async function performSync(
  localProgress: { [beltId: string]: BeltProgress },
  onProgressUpdate: (progress: { [beltId: string]: BeltProgress }) => void
): Promise<boolean> {
  try {
    const listId = await getDefaultListId();
    if (!listId) {
      console.log('No default list ID available, skipping sync');
      return false;
    }

    const queue = await getSyncQueue();

    // Convert local progress to API format
    const progressForSync = convertProgressForSync(localProgress);

    // Call sync API
    const response = await syncProgress({
      list_id: listId,
      progress: progressForSync,
      last_synced_at: queue.lastSyncedAt || undefined,
    });

    // Convert response back to local format
    const mergedProgress = convertProgressFromSync(response.progress);

    // Merge with local progress to preserve photos (which aren't synced)
    const finalProgress = { ...mergedProgress };
    for (const [beltId, beltProgress] of Object.entries(localProgress)) {
      if (!finalProgress[beltId]) {
        finalProgress[beltId] = {};
      }
      for (const [reqId, reqProgress] of Object.entries(beltProgress)) {
        if (reqProgress.photoUri) {
          if (finalProgress[beltId][reqId]) {
            finalProgress[beltId][reqId].photoUri = reqProgress.photoUri;
          } else {
            finalProgress[beltId][reqId] = {
              ...reqProgress,
            };
          }
        }
      }
    }

    // Update local progress
    onProgressUpdate(finalProgress);

    // Clear queue and update last synced time
    await saveSyncQueue({
      changes: [],
      lastSyncedAt: response.server_timestamp,
    });

    console.log(`Sync complete: ${response.inserted} inserted, ${response.updated} updated`);
    return true;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
}

/**
 * Get the last sync timestamp
 */
export async function getLastSyncedAt(): Promise<string | null> {
  const queue = await getSyncQueue();
  return queue.lastSyncedAt;
}

/**
 * Check if there are pending changes to sync
 */
export async function hasPendingChanges(): Promise<boolean> {
  const queue = await getSyncQueue();
  return queue.changes.length > 0;
}
