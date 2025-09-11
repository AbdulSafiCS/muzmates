// FirebaseConfig.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "./env";

// Initialize Firebase
export const FIREBASE_APP = initializeApp(FIREBASE_CONFIG);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);

// Auth with React Native persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const USER_REF = collection(FIRESTORE_DB, "users");
export const LISTING_REF = collection(FIRESTORE_DB, "listings");
