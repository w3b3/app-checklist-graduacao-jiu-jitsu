/**
 * Lists API
 *
 * Functions for managing technique lists and subscriptions.
 */

import apiClient from './client';

export interface TechniqueList {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  is_default: boolean;
  share_code: string | null;
  target_belt: string | null;
  technique_count: number;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface TechniqueItem {
  id: string;
  technique_key: string;
  category: string;
  name: string;
  belt: string | null;
  description: string | null;
  video_url: string | null;
  target_count: number | null;
  sort_order: number;
}

export interface ListWithTechniques {
  list: TechniqueList;
  techniques: TechniqueItem[];
}

export interface ListsResponse {
  default: TechniqueList | null;
  my_lists: TechniqueList[];
  subscribed: TechniqueList[];
  public: TechniqueList[];
}

/**
 * Get all available lists for the current user
 */
export async function getLists(options?: {
  public?: boolean;
  belt?: string;
  search?: string;
}): Promise<ListsResponse> {
  const response = await apiClient.get('/api/technique-lists', {
    params: options,
  });
  return response.data;
}

/**
 * Get the default Brothers Fight list
 */
export async function getDefaultList(): Promise<ListWithTechniques> {
  const response = await apiClient.get('/api/technique-lists/default');
  return response.data;
}

/**
 * Get a list by UUID
 */
export async function getListById(uuid: string): Promise<ListWithTechniques> {
  const response = await apiClient.get(`/api/technique-lists/${uuid}`);
  return response.data;
}

/**
 * Get a list by share code
 */
export async function getListByShareCode(shareCode: string): Promise<ListWithTechniques> {
  const response = await apiClient.get(`/api/technique-lists/by-code/${shareCode}`);
  return response.data;
}

/**
 * Create a new technique list
 */
export async function createList(data: {
  name: string;
  description?: string;
  is_public?: boolean;
  target_belt?: string | null;
}): Promise<TechniqueList> {
  const response = await apiClient.post('/api/technique-lists', data);
  return response.data.list;
}

/**
 * Update a technique list
 */
export async function updateList(
  uuid: string,
  data: {
    name?: string;
    description?: string;
    is_public?: boolean;
    target_belt?: string | null;
  }
): Promise<TechniqueList> {
  const response = await apiClient.put(`/api/technique-lists/${uuid}`, data);
  return response.data.list;
}

/**
 * Delete a technique list
 */
export async function deleteList(uuid: string): Promise<void> {
  await apiClient.delete(`/api/technique-lists/${uuid}`);
}

/**
 * Generate a share code for a list
 */
export async function generateShareCode(uuid: string): Promise<string> {
  const response = await apiClient.post(`/api/technique-lists/${uuid}/generate-share-code`);
  return response.data.share_code;
}

/**
 * Subscribe to a list by share code
 */
export async function subscribeByShareCode(shareCode: string): Promise<TechniqueList> {
  const response = await apiClient.post('/api/technique-lists/subscribe', {
    share_code: shareCode,
  });
  return response.data.list;
}

/**
 * Subscribe to a list by ID
 */
export async function subscribeById(listId: string): Promise<TechniqueList> {
  const response = await apiClient.post('/api/technique-lists/subscribe', {
    list_id: listId,
  });
  return response.data.list;
}

/**
 * Unsubscribe from a list
 */
export async function unsubscribe(listId: string): Promise<void> {
  await apiClient.delete(`/api/technique-lists/subscribe/${listId}`);
}

/**
 * Get user's subscriptions
 */
export async function getSubscriptions(): Promise<TechniqueList[]> {
  const response = await apiClient.get('/api/technique-lists/user/subscriptions');
  return response.data.subscriptions;
}

/**
 * Add a technique to a list
 */
export async function addTechnique(
  listId: string,
  technique: {
    technique_key: string;
    category: string;
    name: string;
    belt?: string | null;
    description?: string;
    video_url?: string;
    target_count?: number;
    sort_order?: number;
  }
): Promise<TechniqueItem> {
  const response = await apiClient.post(
    `/api/technique-lists/${listId}/techniques`,
    technique
  );
  return response.data.technique;
}

/**
 * Bulk add techniques to a list
 */
export async function addTechniquesBulk(
  listId: string,
  techniques: Array<{
    technique_key: string;
    category: string;
    name: string;
    belt?: string | null;
    target_count?: number;
    sort_order?: number;
  }>
): Promise<number> {
  const response = await apiClient.post(
    `/api/technique-lists/${listId}/techniques/bulk`,
    { techniques }
  );
  return response.data.created;
}
