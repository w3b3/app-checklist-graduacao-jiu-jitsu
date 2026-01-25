/**
 * Progress API
 *
 * Functions for syncing technique progress with the backend.
 */

import apiClient from './client';

export interface TechniqueProgress {
  completed: boolean;
  note: string;
  mediaUrl: string;
  completedAt?: string;
  updatedAt: string;
}

export interface SyncProgressRequest {
  list_id: string;
  progress: Record<string, Partial<TechniqueProgress>>;
  last_synced_at?: string;
}

export interface SyncProgressResponse {
  progress: Record<string, TechniqueProgress>;
  server_timestamp: string;
  inserted: number;
  updated: number;
}

/**
 * Get progress for a specific list
 */
export async function getProgress(listId: string): Promise<Record<string, TechniqueProgress>> {
  const response = await apiClient.get('/api/progress', {
    params: { list_id: listId },
  });
  return response.data.progress;
}

/**
 * Update progress for a single technique
 */
export async function updateProgress(
  listId: string,
  techniqueKey: string,
  progress: Partial<TechniqueProgress>
): Promise<TechniqueProgress> {
  const response = await apiClient.put(
    `/api/progress/${listId}/${techniqueKey}`,
    {
      completed: progress.completed,
      note: progress.note,
      media_url: progress.mediaUrl,
    }
  );
  return response.data.progress;
}

/**
 * Sync all progress for a list
 * Uses last-write-wins conflict resolution
 */
export async function syncProgress(request: SyncProgressRequest): Promise<SyncProgressResponse> {
  const response = await apiClient.post('/api/progress/sync', request);
  return response.data;
}

/**
 * Get progress statistics for a list
 */
export async function getProgressStats(listId: string): Promise<{
  total_techniques: number;
  total_tracked: number;
  completed_count: number;
  completion_percentage: number;
  by_category: Array<{
    category: string;
    total: number;
    completed: number;
    percentage: number;
  }>;
}> {
  const response = await apiClient.get('/api/progress/stats', {
    params: { list_id: listId },
  });
  return response.data;
}
