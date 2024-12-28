// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkrTxpeP01iyOh-mwfut8H-zUQN0PzX7k",
  authDomain: "trying-playground.firebaseapp.com",
  projectId: "trying-playground",
  storageBucket: "trying-playground.appspot.com",
  messagingSenderId: "784169281261",
  appId: "1:784169281261:web:89f59c112cd05540408ee4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);