// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHvh-gq4WDxhzVeCNP2F8QCSGnwwFEE60",
  authDomain: "tu-alianza.firebaseapp.com",
  projectId: "tu-alianza",
  storageBucket: "tu-alianza.appspot.com",
  messagingSenderId: "219112231329",
  appId: "1:219112231329:web:6b13a458b731b403a0fbe0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
