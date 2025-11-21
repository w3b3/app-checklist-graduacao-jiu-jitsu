// ⚠️ PLACEHOLDER - NOT USED IN APP ⚠️
// This file was auto-generated for testing the form automation script.
// The actual feedback form being used is in ./feedback.ts
//
// Auto-generated - DO NOT EDIT MANUALLY
// Config: forms/featureRequest.config.json
// Form: https://docs.google.com/forms/d/e/1FAIpQLSfxa1eFVGzGHDRDEHjpsa0CjkM2Mxtk1qe0ymzsEdXWJRpFWA/viewform
// Generated: 2025-11-20T23:16:58.812Z

export const FEATUREREQUEST_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeVcO3N1SQ0MuRelzZtTEFJ0LgfZCSDwyKat_99HSp8t0URtw/formResponse',
  sheetUrl: '',
  entryIds: {
    feedbackType: 'entry.375424062', // Tipo de Feedback
    message: 'entry.1245682428', // Mensagem
    email: 'entry.1397640521', // Email
    belt: 'entry.862809321', // Faixa
    appVersion: 'entry.664067526', // Versão do App
    device: 'entry.793753316', // Dispositivo
  },
};

export interface FeatureRequestData {
  feedbackType: 'Bug Report' | 'Feature Request' | 'General Feedback';
  message: string;
  email?: string;
  belt?: string;
  appVersion?: string;
  device?: string;
}

export async function submitFeatureRequest(
  data: FeatureRequestData
): Promise<void> {
  const formData = new FormData();

  formData.append(FEATUREREQUEST_CONFIG.entryIds.feedbackType, String(data.feedbackType));
  formData.append(FEATUREREQUEST_CONFIG.entryIds.message, String(data.message));

  if (data.email !== undefined) {
    formData.append(FEATUREREQUEST_CONFIG.entryIds.email, String(data.email));
  }
  if (data.belt !== undefined) {
    formData.append(FEATUREREQUEST_CONFIG.entryIds.belt, String(data.belt));
  }
  if (data.appVersion !== undefined) {
    formData.append(FEATUREREQUEST_CONFIG.entryIds.appVersion, String(data.appVersion));
  }
  if (data.device !== undefined) {
    formData.append(FEATUREREQUEST_CONFIG.entryIds.device, String(data.device));
  }

  try {
    await fetch(FEATUREREQUEST_CONFIG.formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });
  } catch (error) {
    console.log('Form submission attempted:', error);
  }
}
