import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAPLUpSRjKNtl5wWz1ABdEpiNmSmDNeq-M",
  authDomain: "vitalink-d9c1a.firebaseapp.com",
  databaseURL: "https://vitalink-d9c1a-default-rtdb.firebaseio.com",
  projectId: "vitalink-d9c1a",
  storageBucket: "vitalink-d9c1a.firebasestorage.app",
  messagingSenderId: "1079769204426",
  appId: "1:1079769204426:web:37c811fb12956e1f2d5633",
  measurementId: "G-7TZWKS60WP"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

console.log("✅ Firebase inicializado");