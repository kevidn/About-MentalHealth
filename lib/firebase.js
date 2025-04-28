/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTEtQImADGmY2wQs6XhluF85O2qshB30E",
  authDomain: "about-mental-health.firebaseapp.com",
  projectId: "about-mental-health",
  storageBucket: "about-mental-health.firebasestorage.app",
  messagingSenderId: "458841103710",
  appId: "1:458841103710:web:8f516c374effe08eb943cf",
  measurementId: "G-7168MRMVWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);