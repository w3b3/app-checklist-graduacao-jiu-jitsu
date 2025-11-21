/**
 * Offline Queue for Network Resilience
 *
 * Persists form submissions to AsyncStorage when offline.
 * Automatically processes queue when network connection is restored.
 *
 * Usage:
 *   import { queueOffline, processOfflineQueue } from './queues/offlineQueue';
 *
 *   // When submitting
 *   try {
 *     await submitForm(data);
 *   } catch (error) {
 *     await queueOffline('formName', data);
 *   }
 *
 *   // On app start or network reconnection
 *   await processOfflineQueue();
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'forms_offline_queue';

interface QueuedSubmission {
  formName: string;
  data: any;
  timestamp: number;
  retries: number;
}

/**
 * Add failed submission to offline queue
 */
export async function queueOffline(
  formName: string,
  data: any
): Promise<void> {
  try {
    const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedSubmission[] = queueJson ? JSON.parse(queueJson) : [];

    queue.push({
      formName,
      data,
      timestamp: Date.now(),
      retries: 0,
    });

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log(`📥 Queued ${formName} for offline submission`);
  } catch (error) {
    console.error('Failed to queue offline submission:', error);
  }
}

/**
 * Process offline queue (submit all pending submissions)
 *
 * Call this on:
 * - App start
 * - Network reconnection
 */
export async function processOfflineQueue(): Promise<void> {
  try {
    const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
    if (!queueJson) return;

    const queue: QueuedSubmission[] = JSON.parse(queueJson);
    if (queue.length === 0) return;

    console.log(`📤 Processing ${queue.length} offline submissions...`);

    // Dynamically import form submission functions
    const forms = await import('../index');

    const results = await Promise.allSettled(
      queue.map(async (item) => {
        // Map form name to submission function
        const submitFn = (forms as any)[`submit${capitalize(item.formName)}`];

        if (!submitFn) {
          console.warn(`Unknown form: ${item.formName}`);
          return;
        }

        await submitFn(item.data);
      })
    );

    // Count successes and failures
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Submitted ${succeeded} offline forms`);
    if (failed > 0) {
      console.warn(`⚠ Failed to submit ${failed} offline forms`);
    }

    // Clear queue (even if some failed - we don't retry indefinitely)
    await AsyncStorage.removeItem(QUEUE_KEY);

  } catch (error) {
    console.error('Failed to process offline queue:', error);
  }
}

/**
 * Get offline queue size (for debugging)
 */
export async function getOfflineQueueSize(): Promise<number> {
  try {
    const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
    if (!queueJson) return 0;

    const queue: QueuedSubmission[] = JSON.parse(queueJson);
    return queue.length;
  } catch (error) {
    return 0;
  }
}

/**
 * Clear offline queue (for debugging)
 */
export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
  console.log('🗑 Cleared offline queue');
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
