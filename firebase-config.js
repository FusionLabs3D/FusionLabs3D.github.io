/**
 * FusionLabs3D — Firebase Configuration
 * 
 * Replace the values below with your Firebase project credentials from:
 * https://console.firebase.google.com -> Project Settings -> General -> Web App
 * 
 * When config is empty or in local mode, the website automatically falls back to 
 * local storage / data/materials.json so it always works seamlessly!
 */

const firebaseConfig = {
  apiKey: "AIzaSyCh5pC4FSdPrDqBRkZV3lF8Ke9p37Bxzfg",
  authDomain: "fusionlabs3d-india.firebaseapp.com",
  projectId: "fusionlabs3d-india",
  storageBucket: "fusionlabs3d-india.firebasestorage.app",
  messagingSenderId: "1012098418624",
  appId: "1:1012098418624:web:f423591bcac119dea52a25",
  measurementId: "G-44P4M4XS7J"
};

// Initialize Firebase if loaded and configured
let firebaseApp = null;
let firebaseDb = null;

try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseDb = firebase.firestore();
    console.log("FusionLabs3D: Firebase Firestore connected.");
  }
} catch (err) {
  console.warn("FusionLabs3D: Firebase offline, using local mode:", err);
}
