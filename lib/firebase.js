/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTEtQImADGmY2wQs6XhluF85O2qshB30E",
  authDomain: "about-mental-health.firebaseapp.com",
  projectId: "about-mental-health",
  storageBucket: "about-mental-health.appspot.com", // Make sure this is correct
  messagingSenderId: "458841103710",
  appId: "1:458841103710:web:8f516c374effe08eb943cf",
  measurementId: "G-7168MRMVWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { Timestamp };