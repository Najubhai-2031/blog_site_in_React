// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArhigeFifeZTuyIPCnETz15IJeA2W1cUc",
  authDomain: "narin-blog.firebaseapp.com",
  projectId: "narin-blog",
  storageBucket: "narin-blog.appspot.com",
  messagingSenderId: "791208575302",
  appId: "1:791208575302:web:ec334ab078c92d2a706547",
  measurementId: "G-CYDBNDTWLR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, firebaseConfig };
