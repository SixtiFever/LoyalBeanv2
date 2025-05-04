// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBqr4tFt3UH-nBu8nN-rZyYA16whZ83VE",
  authDomain: "loyalbean-31b79.firebaseapp.com",
  projectId: "loyalbean-31b79",
  storageBucket: "loyalbean-31b79.firebasestorage.app",
  messagingSenderId: "109004586728",
  appId: "1:109004586728:web:eabc891226735f9426935d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage)
//   });
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);