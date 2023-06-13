// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// usuario tu alianza
/*
const firebaseConfig = {
  apiKey: "AIzaSyBHvh-gq4WDxhzVeCNP2F8QCSGnwwFEE60",
  authDomain: "tu-alianza.firebaseapp.com",
  projectId: "tu-alianza",
  storageBucket: "tu-alianza.appspot.com",
  messagingSenderId: "219112231329",
  appId: "1:219112231329:web:6b13a458b731b403a0fbe0"
};*/

/*personal uno
const firebaseConfig = {
  apiKey: "AIzaSyC0ZsvL_YfVlRpQT_WmtLpA6jgF7HNf3y4",
  authDomain: "tu-alianza-f442c.firebaseapp.com",
  projectId: "tu-alianza-f442c",
  storageBucket: "tu-alianza-f442c.appspot.com",
  messagingSenderId: "804649224739",
  appId: "1:804649224739:web:2d2d38b9290e2bf6057f96"
};*/

/*personal 2
const firebaseConfig = {
  apiKey: "AIzaSyCt4pD1Y1_EfscIMgYNwWMT1UswMt7wdzc",
  authDomain: "tu-alianza-9ced7.firebaseapp.com",
  projectId: "tu-alianza-9ced7",
  storageBucket: "tu-alianza-9ced7.appspot.com",
  messagingSenderId: "542709938155",
  appId: "1:542709938155:web:99cd72068aa00c8d364bae"
};*/

/*personal 3*/
const firebaseConfig = {
  apiKey: "AIzaSyCWW0coeS1cYcLFfoZ1DLBNrTbkTnSGoYw",
  authDomain: "tu-alianza-42d48.firebaseapp.com",
  projectId: "tu-alianza-42d48",
  storageBucket: "tu-alianza-42d48.appspot.com",
  messagingSenderId: "963436341676",
  appId: "1:963436341676:web:090d2e1bbf874e97783209"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

