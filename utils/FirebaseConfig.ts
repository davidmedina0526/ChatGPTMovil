import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxBhFW9Gi2x30OnxdlchL3BiWfmZxE_wI",
  authDomain: "dam-chatgpt-2025.firebaseapp.com",
  projectId: "dam-chatgpt-2025",
  storageBucket: "dam-chatgpt-2025.firebasestorage.app",
  messagingSenderId: "255524190049",
  appId: "1:255524190049:web:b5b431cc937f9452b1f720",
  measurementId: "G-BPS90C572R"
};

const app = initializeApp(firebaseConfig);

// Solo inicializamos Analytics en el entorno del navegador
if (typeof window !== "undefined") {
  getAnalytics(app);
}

export const db = getFirestore(app);
export const auth = getAuth(app);