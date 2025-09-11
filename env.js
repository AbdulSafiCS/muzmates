// env.js
let local = {};
try {
  // Optional local fallback (gitignored)
  local = require("./keys.local");
} catch (_) {}

/**
 * Prefer EXPO_PUBLIC_* at build/runtime (Expo/EAS),
 * fall back to keys.local.js when running locally.
 */
export const FIREBASE_CONFIG = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? local.FIREBASE_CONFIG?.apiKey,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    local.FIREBASE_CONFIG?.authDomain,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    local.FIREBASE_CONFIG?.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    local.FIREBASE_CONFIG?.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    local.FIREBASE_CONFIG?.messagingSenderId,
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? local.FIREBASE_CONFIG?.appId,
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ??
    local.FIREBASE_CONFIG?.measurementId,
};

export const GOOGLE_PLACES_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? local.GOOGLE_PLACES_KEY;
