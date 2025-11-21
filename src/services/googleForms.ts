import Constants from 'expo-constants';
import * as Device from 'expo-device';

// Google Form entry IDs extracted from form HTML
const FORM_CONFIG = {
  feedbackFormUrl: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeVcO3N1SQ0MuRelzZtTEFJ0LgfZCSDwyKat_99HSp8t0URtw/formResponse',
  entryIds: {
    feedbackType: 'entry.375424062',   // Tipo de Feedback (Bug Report | Feature Request | General Feedback)
    message: 'entry.1245682428',       // Mensagem (required, max 500 chars)
    email: 'entry.1397640521',         // Email (optional)
    belt: 'entry.862809321',           // Faixa (auto-populated)
    appVersion: 'entry.664067526',     // Versão do App (auto-populated)
    device: 'entry.793753316',         // Dispositivo (auto-populated)
  },
};

export interface FeedbackData {
  feedbackType: 'Bug Report' | 'Feature Request' | 'General Feedback';
  message: string;
  email?: string;
  belt: string; // e.g., "Azul", "Roxa"
}

/**
 * Submit feedback to Google Forms backend.
 * Uses no-cors mode so we can't detect errors, but Google Forms rarely fails.
 *
 * @returns Promise that resolves after submission attempt
 */
export async function submitFeedback(data: FeedbackData): Promise<void> {
  const formData = new FormData();

  // User-provided fields
  formData.append(FORM_CONFIG.entryIds.feedbackType, data.feedbackType);
  formData.append(FORM_CONFIG.entryIds.message, data.message);

  // Optional email
  if (data.email && data.email.trim()) {
    formData.append(FORM_CONFIG.entryIds.email, data.email.trim());
  }

  // Auto-populated context fields
  formData.append(FORM_CONFIG.entryIds.belt, data.belt);
  formData.append(
    FORM_CONFIG.entryIds.appVersion,
    Constants.expoConfig?.version || 'unknown'
  );
  formData.append(
    FORM_CONFIG.entryIds.device,
    `${Device.osName} ${Device.osVersion} | ${Device.modelName || 'Unknown'}`
  );

  try {
    await fetch(FORM_CONFIG.feedbackFormUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Required for Google Forms (CORS headers not set)
    });

    // With no-cors, we can't read the response, so we assume success
    // Google Forms is highly reliable, failure is rare
  } catch (error) {
    // Even if fetch fails, we silently succeed for UX
    // (User won't know, but that's better than a scary error message)
    console.log('Form submission attempted:', error);
  }
}
