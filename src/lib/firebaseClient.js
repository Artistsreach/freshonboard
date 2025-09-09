import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, collection, query, where, getDocs, limit, addDoc, serverTimestamp, doc, setDoc, writeBatch } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"; // Import getFunctions
import { generateStoreUrl } from "./utils.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAZLKhYHLevVvBVfWG9ZLwVZMlQ9Fh8zA",
  authDomain: "fresh25.firebaseapp.com",
  projectId: "fresh25",
  storageBucket: "fresh25.firebasestorage.app",
  messagingSenderId: "382962850342",
  appId: "1:382962850342:web:4a87b6ee30d0c77bf2a4e7",
  measurementId: "G-CZZW8LMXN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
// Use explicit region for Functions
export const functions = getFunctions(app, 'us-central1');

// Optionally connect to the Functions emulator if explicitly enabled
try {
  let useEmulator = false;
  let host = 'localhost';
  let port = 5001;

  if (typeof window !== 'undefined') {
    // Prefer Vite env flag when present
    try {
      if (import.meta && import.meta.env) {
        if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
          useEmulator = true;
        }
        if (import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST) {
          host = import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST;
        }
        if (import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT) {
          const p = Number(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT);
          if (!Number.isNaN(p)) port = p;
        }
      }
    } catch (_) { /* ignore if import.meta is unavailable */ }

    // Allow forcing via window flag
    if (window.__USE_FUNCTIONS_EMULATOR__ === true) {
      useEmulator = true;
    }
  }

  if (useEmulator) {
    connectFunctionsEmulator(functions, host, port);
    console.log(`Connected Functions to emulator at ${host}:${port}`);
  }
} catch (e) {
  console.warn('Could not connect Functions emulator:', e);
}

// Enable offline persistence for Firestore
try {
  enableIndexedDbPersistence(firestoreDb, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED // Optional: Or a specific size in bytes
  })
  .then(() => {
    console.log("Firestore offline persistence enabled.");
  })
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn("Firestore offline persistence failed: Multiple tabs open or other precondition failed.", err);
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn("Firestore offline persistence failed: Browser does not support required features.", err);
    } else {
      console.error("Firestore offline persistence failed with error: ", err);
    }
  });
} catch (err) {
  console.error("Error enabling Firestore offline persistence: ", err);
}

export const db = firestoreDb;

/**
 * Checks if a store name (after conversion to a URL slug) is already taken in Firestore.
 * @param {string} storeName The store name to check.
 * @returns {Promise<boolean>} True if the name is taken, false otherwise.
 * @throws {Error} If Firestore query fails.
 */
export async function isStoreNameTaken(storeName) {
  if (!storeName || typeof storeName !== 'string' || storeName.trim() === '') {
    return false;
  }

  const nameToQuery = storeName.trim().toLowerCase();

  try {
    const storesCollectionRef = collection(db, "stores");
    
    const q = query(storesCollectionRef, where("name_lowercase", "==", nameToQuery), limit(1));
    
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking store name availability in Firestore:", error);
    throw new Error("Failed to check store name availability due to a database error.");
  }
}

/**
 * Saves a page to the 'saved_templates' collection in Firestore.
 * @param {string} userId The ID of the user saving the page.
 * @param {string} templateCode The HTML code of the page to save.
 * @param {string} title The title of the page.
 * @param {string} primaryColor The primary color of the page.
 * @returns {Promise<void>}
 * @throws {Error} If Firestore query fails.
 */
export async function savePage(userId, templateCode, title, primaryColor) {
  if (!userId || !templateCode || !title || !primaryColor) {
    throw new Error("User ID, page code, title, and primary color are required to save a page.");
  }

  const slug = generateStoreUrl(title);
  const userTemplatesRef = collection(db, "users", userId, "saved_templates");
  const newTemplateRef = doc(userTemplatesRef);
  const publicTemplatesRef = doc(db, "public_templates", slug);

  const templateData = {
    name: title,
    slug: slug,
    code: templateCode,
    primaryColor: primaryColor,
    createdAt: serverTimestamp(),
    userId: userId,
  };

  try {
    const batch = writeBatch(db);
    batch.set(newTemplateRef, templateData);
    batch.set(publicTemplatesRef, templateData);
    await batch.commit();
    console.log("Page saved successfully to user collection and public collection.");
  } catch (error) {
    console.error("Error saving page to Firestore:", error);
    throw new Error("Failed to save page due to a database error.");
  }
}
