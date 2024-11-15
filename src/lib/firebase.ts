import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZ5Z6o-DdSmuHlNw8lLS_i37SoGMGC0vg",
  authDomain: "prep-me-19321.firebaseapp.com",
  projectId: "prep-me-19321",
  storageBucket: "prep-me-19321.appspot.com",
  messagingSenderId: "731878634918",
  appId: "1:731878634918:web:95886a50ff0bae29accb67",
  measurementId: "G-ZBD1TDBHLD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Only connect to emulator in development
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch (error) {
    console.warn('Failed to connect to auth emulator:', error);
  }
}

export { app, auth, db, storage, googleProvider };