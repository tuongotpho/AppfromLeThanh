
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Thay thế thông tin bên dưới bằng config từ Firebase Console của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCIXqoRO5tdlwBh91NmxubzhQPCG18OPDM",
  authDomain: "app-from-ai.firebaseapp.com",
  projectId: "app-from-ai",
  storageBucket: "app-from-ai.firebasestorage.app",
  messagingSenderId: "895767442095",
  appId: "1:895767442095:web:0e187abfa31b87a9259a5a",
  measurementId: "G-NMM2QS6XP1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
