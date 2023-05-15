
import { doc, getDoc} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "./firebase.js";

// Capturar datos del local storage
const idUsuario = localStorage.getItem("idUsuario");

console.log(idUsuario);

const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);
// capturar username
const username = docSnap.data().username;

