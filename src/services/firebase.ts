import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function mustGet(name: string): string {
  const v = (process.env as any)[name] as string | undefined;
  if (!v) {
    throw new Error(`Missing env var: ${name}`);
  }
  return v;
}

const firebaseConfig = {
  apiKey: mustGet("REACT_APP_FIREBASE_API_KEY"),
  authDomain: mustGet("REACT_APP_FIREBASE_AUTH_DOMAIN"),
  projectId: mustGet("REACT_APP_FIREBASE_PROJECT_ID"),
  storageBucket: mustGet("REACT_APP_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: mustGet("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"),
  appId: mustGet("REACT_APP_FIREBASE_APP_ID"),
  measurementId: (process.env as any)["REACT_APP_FIREBASE_MEASUREMENT_ID"]
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    await setPersistence(auth, inMemoryPersistence);
  }
})();
