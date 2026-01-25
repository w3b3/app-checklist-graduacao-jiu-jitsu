/**
 * Firebase Configuration
 *
 * Initialize Firebase for authentication.
 * Uses compat layer for better React Native compatibility.
 */

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

/**
 * Get the Firebase Auth instance
 */
export function getFirebaseAuth() {
  return auth;
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseInitialized(): boolean {
  return firebase.apps.length > 0;
}

export { auth };
export default firebase;
