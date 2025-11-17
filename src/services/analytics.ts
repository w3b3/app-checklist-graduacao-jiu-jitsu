/**
 * Google Analytics 4 (GA4) using Measurement Protocol
 *
 * Setup:
 * 1. Go to https://analytics.google.com
 * 2. Create a GA4 property
 * 3. Get your Measurement ID (G-XXXXXXXXXX) from Admin > Data Streams
 * 4. Get your API Secret from Admin > Data Streams > Measurement Protocol API secrets
 * 5. Replace the values below
 */

const GA4_MEASUREMENT_ID = 'G-M3G9573NSZ'; // BJJ Checklist GA4 Web Property
const GA4_API_SECRET = '6bvu8GsGTsW3wpWaiKEvAw'; // Android API Secret

/**
 * Generate a unique client ID for this device
 */
const getClientId = async (): Promise<string> => {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  let clientId = await AsyncStorage.getItem('ga4_client_id');

  if (!clientId) {
    // Generate a random UUID-like client ID
    clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    await AsyncStorage.setItem('ga4_client_id', clientId);
  }

  return clientId;
};

/**
 * Log a custom event to Google Analytics 4
 * @param eventName Name of the event (e.g., 'join_class_beta_clicked')
 * @param params Optional parameters to include with the event
 */
export async function logEvent(eventName: string, params?: Record<string, any>) {
  try {
    const clientId = await getClientId();

    const payload = {
      client_id: clientId,
      events: [{
        name: eventName,
        params: {
          ...params,
          engagement_time_msec: '1',
        }
      }]
    };

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(`📊 GA4: ${eventName}`, params);
  } catch (error) {
    console.warn('Analytics error:', error);
  }
}

/**
 * Set a user property for analytics
 * @param name Property name
 * @param value Property value
 */
export async function setUserProperty(name: string, value: string) {
  try {
    const clientId = await getClientId();

    const payload = {
      client_id: clientId,
      user_properties: {
        [name]: { value }
      }
    };

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn('Analytics error:', error);
  }
}

/**
 * Log a screen view
 * @param screenName Name of the screen
 */
export async function logScreenView(screenName: string) {
  await logEvent('screen_view', { screen_name: screenName });
}
