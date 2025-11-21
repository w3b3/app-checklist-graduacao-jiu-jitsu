// ⚠️ PLACEHOLDER - NOT USED IN APP ⚠️
// This file was auto-generated for testing the form automation script.
// It is not currently integrated into the app.
//
// Auto-generated - DO NOT EDIT MANUALLY
// Config: forms/sessionTelemetry.config.json
// Form: https://docs.google.com/forms/d/e/1FAIpQLSeToV8sFGvgnUU2lNfV5Cr3GhtK9RZIHqrzyQ_laLMVeRJfsQ/viewform
// Generated: 2025-11-20T23:16:36.616Z

export const SESSIONTELEMETRY_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeToV8sFGvgnUU2lNfV5Cr3GhtK9RZIHqrzyQ_laLMVeRJfsQ/formResponse',
  sheetUrl: '',
  entryIds: {
    sessionId: 'entry.1362124290', // Session ID
    sessionStart: 'entry.1498550048', // Session Start Time
    sessionEnd: 'entry.1292392108', // Session End Time
    durationSeconds: 'entry.114041559', // Duration (seconds)
    beltsViewed: 'entry.645724826', // Belts Viewed
    techniquesChecked: 'entry.1769188699', // Techniques Checked
    techniquesUnchecked: 'entry.280412990', // Techniques Unchecked
    notesAdded: 'entry.1866314038', // Notes Added
    mediasAdded: 'entry.1008196615', // Media URLs Added
    shareCount: 'entry.684264089', // Shares
    deviceInfo: 'entry.1025069568', // Device Info
  },
};

export interface SessionTelemetryData {
  sessionId: string;
  sessionStart: string;
  sessionEnd: string;
  durationSeconds: string;
  beltsViewed: string;
  techniquesChecked: string;
  techniquesUnchecked: string;
  notesAdded: string;
  mediasAdded: string;
  shareCount: string;
  deviceInfo: string;
}

export async function submitSessionTelemetry(
  data: SessionTelemetryData
): Promise<void> {
  const formData = new FormData();

  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.sessionId, String(data.sessionId));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.sessionStart, String(data.sessionStart));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.sessionEnd, String(data.sessionEnd));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.durationSeconds, String(data.durationSeconds));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.beltsViewed, String(data.beltsViewed));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.techniquesChecked, String(data.techniquesChecked));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.techniquesUnchecked, String(data.techniquesUnchecked));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.notesAdded, String(data.notesAdded));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.mediasAdded, String(data.mediasAdded));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.shareCount, String(data.shareCount));
  formData.append(SESSIONTELEMETRY_CONFIG.entryIds.deviceInfo, String(data.deviceInfo));

  try {
    await fetch(SESSIONTELEMETRY_CONFIG.formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });
  } catch (error) {
    console.log('Form submission attempted:', error);
  }
}
