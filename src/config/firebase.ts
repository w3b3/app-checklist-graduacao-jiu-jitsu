/**
 * Firebase Configuration
 *
 * Initialize Firebase for authentication.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Firebase config for tatame0-production
const firebaseConfig = {
  apiKey: 'AIzaSyAaLnRzpVrBraSuUaCLnCReXdioerxT0mA',
  authDomain: 'tatame0-production.firebaseapp.com',
  projectId: 'tatame0-production',
  storageBucket: 'tatame0-production.firebasestorage.app',
  messagingSenderId: '304352889765',
  appId: '1:304352889765:web:0ed3dfe6f7ba30aa5eb64c',
  measurementId: 'G-47S56B9FNX',
};

/**
 * Initialize Firebase
 */
export function initializeFirebaseApp(): void {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }
}

/**
 * Get the Firebase Auth instance
 * Initializes Firebase if not already done
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebaseApp();
  }
  return auth!;
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseInitialized(): boolean {
  return getApps().length > 0;
}
