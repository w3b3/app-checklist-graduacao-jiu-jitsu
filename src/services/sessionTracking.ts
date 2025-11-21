/**
 * Session Tracking Service
 *
 * Tracks user session metrics and submits telemetry data.
 *
 * Automatically tracks:
 * - Session start/end times
 * - Belts viewed during session
 * - Techniques checked/unchecked
 * - Notes and media added
 * - Share events
 *
 * Usage:
 *   import {
 *     startSession,
 *     endSession,
 *     trackBeltView,
 *     trackTechniqueCheck,
 *     ...
 *   } from './services/sessionTracking';
 *
 *   // In App.tsx
 *   useEffect(() => {
 *     startSession();
 *     return () => { endSession(); };
 *   }, []);
 *
 *   // In components
 *   trackBeltView('azul');
 *   trackTechniqueCheck();
 */

import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

let sessionId: string | null = null;
let sessionStart: number | null = null;

interface SessionMetrics {
  beltsViewed: Set<string>;
  techniquesChecked: number;
  techniquesUnchecked: number;
  notesAdded: number;
  mediasAdded: number;
  shareCount: number;
}

let metrics: SessionMetrics = {
  beltsViewed: new Set(),
  techniquesChecked: 0,
  techniquesUnchecked: 0,
  notesAdded: 0,
  mediasAdded: 0,
  shareCount: 0,
};

/**
 * Start a new session
 */
export function startSession(): void {
  sessionId = uuidv4();
  sessionStart = Date.now();

  // Reset metrics
  metrics = {
    beltsViewed: new Set(),
    techniquesChecked: 0,
    techniquesUnchecked: 0,
    notesAdded: 0,
    mediasAdded: 0,
    shareCount: 0,
  };

  console.log(`📊 Session started: ${sessionId}`);
}

/**
 * End current session and submit telemetry
 */
export async function endSession(): Promise<void> {
  if (!sessionId || !sessionStart) {
    console.warn('No active session to end');
    return;
  }

  const duration = Math.floor((Date.now() - sessionStart) / 1000);

  // Prepare telemetry data
  const telemetryData = {
    sessionId,
    sessionStart: new Date(sessionStart).toISOString(),
    sessionEnd: new Date().toISOString(),
    durationSeconds: duration.toString(),
    beltsViewed: Array.from(metrics.beltsViewed).join(',') || 'none',
    techniquesChecked: metrics.techniquesChecked.toString(),
    techniquesUnchecked: metrics.techniquesUnchecked.toString(),
    notesAdded: metrics.notesAdded.toString(),
    mediasAdded: metrics.mediasAdded.toString(),
    shareCount: metrics.shareCount.toString(),
    deviceInfo: `${Device.osName || Platform.OS} ${Device.osVersion || Platform.Version} | ${Device.modelName || 'Unknown'}`,
  };

  console.log(`📊 Session ended: ${sessionId} (${duration}s)`);

  // Submit telemetry (only if form exists)
  try {
    const forms = await import('./forms');
    // Check if form exists
    if ('submitSessionTelemetry' in forms) {
      const submitFn = (forms as any).submitSessionTelemetry;
      await submitFn(telemetryData);
      console.log('✓ Session telemetry submitted');
    } else {
      console.warn('Session telemetry form not yet created');
    }
  } catch (error) {
    console.warn('Error submitting session telemetry:', error);
  }

  // Reset session
  sessionId = null;
  sessionStart = null;
}

/**
 * Get current session ID
 */
export function getSessionId(): string | null {
  return sessionId;
}

/**
 * Track belt view
 */
export function trackBeltView(beltId: string): void {
  metrics.beltsViewed.add(beltId);
}

/**
 * Track technique check
 */
export function trackTechniqueCheck(): void {
  metrics.techniquesChecked++;
}

/**
 * Track technique uncheck
 */
export function trackTechniqueUncheck(): void {
  metrics.techniquesUnchecked++;
}

/**
 * Track note addition
 */
export function trackNoteAdded(): void {
  metrics.notesAdded++;
}

/**
 * Track media addition
 */
export function trackMediaAdded(): void {
  metrics.mediasAdded++;
}

/**
 * Track share event
 */
export function trackShare(): void {
  metrics.shareCount++;
}

/**
 * Get current session metrics (for debugging)
 */
export function getSessionMetrics(): SessionMetrics {
  return {
    ...metrics,
    beltsViewed: new Set(metrics.beltsViewed), // Clone set
  };
}
