/**
 * Batch Queue for High-Frequency Analytics Events
 *
 * Batches events to reduce submission count and prevent hitting rate limits.
 * Auto-flushes based on:
 * - Time interval (e.g., every 30 seconds)
 * - Batch size (e.g., every 10 events)
 *
 * Usage:
 *   const queue = new BatchQueue({
 *     batchSize: 10,
 *     flushInterval: 30000,
 *     submitFn: submitTechniqueAnalytics,
 *   });
 *
 *   queue.add({ techniqueId: '123', action: 'Checked', ... });
 */

export interface BatchQueueConfig {
  batchSize: number;
  flushInterval: number;
  submitFn: (data: any) => Promise<void>;
}

export class BatchQueue {
  private queue: any[] = [];
  private config: BatchQueueConfig;
  private timer: NodeJS.Timeout | null = null;

  constructor(config: BatchQueueConfig) {
    this.config = config;
  }

  /**
   * Add event to queue
   */
  add(event: any): void {
    this.queue.push(event);

    // Flush if batch size reached
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
    // Otherwise, start flush timer if not already running
    else if (!this.timer) {
      this.timer = setTimeout(
        () => this.flush(),
        this.config.flushInterval
      );
    }
  }

  /**
   * Flush all queued events
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    // Clear timer
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Submit all events in parallel
    const results = await Promise.allSettled(
      batch.map(event => this.config.submitFn(event))
    );

    // Log failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Failed to submit event ${index}:`, result.reason);
      }
    });
  }

  /**
   * Force flush (e.g., on app backgrounding)
   */
  async forceFlush(): Promise<void> {
    await this.flush();
  }

  /**
   * Get queue size (for debugging)
   */
  size(): number {
    return this.queue.length;
  }
}
