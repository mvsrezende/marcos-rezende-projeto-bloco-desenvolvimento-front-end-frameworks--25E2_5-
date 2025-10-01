import './shim';
import { Platform } from 'react-native';
import { FIREBASE } from './config';

const firebaseMod = require('firebase');
const firebase: any = firebaseMod?.default ?? firebaseMod;

require('firebase/auth');
require('firebase/firestore');

let initError: string | null = null;

try {
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(FIREBASE);
  }
} catch (e: any) {
  initError = `initializeApp failed: ${e?.message ?? String(e)}`;
  console.error(initError);
}

export const auth = (() => {
  try {
    return firebase.auth();
  } catch (e: any) {
    initError = `auth() failed: ${e?.message ?? String(e)}`;
    console.error(initError);
    return null;
  }
})();

export const db = (() => {
  try {
    const _db = firebase.firestore();
    if (Platform.OS !== 'web') {
      // melhora compat no RN com SDK web
      try {
        _db.settings({
          experimentalForceLongPolling: true,
          useFetchStreams: false,
        } as any);
      } catch {}
    }
    return _db;
  } catch (e: any) {
    initError = `firestore() failed: ${e?.message ?? String(e)}`;
    console.error(initError);
    return null;
  }
})();

try {
  if (auth) {
    if (Platform.OS === 'web') {
      auth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch(() =>
          auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
        );
    } else {
      auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(() => {});
    }
  }
} catch (e: any) {
  console.warn('auth.setPersistence erro:', e?.message ?? String(e));
}

export const firebaseInitError = initError;
export default firebase;
