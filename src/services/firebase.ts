import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAauYW0CeT3IsqAdJtU-TiAc4Wht9K9Zhc",
  authDomain: "infnet-7cc8b.firebaseapp.com",
  projectId: "infnet-7cc8b",
  storageBucket: "infnet-7cc8b.firebasestorage.app",
  messagingSenderId: "758044400313",
  appId: "1:758044400313:web:103f6ddc7bf9f02eab5968",
  measurementId: "G-H8D201QZX9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    await setPersistence(auth, inMemoryPersistence);
  }
})();
