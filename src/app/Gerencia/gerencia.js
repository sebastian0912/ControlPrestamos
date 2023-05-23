
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";


const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
// capturar el id del usuario logeado del input



const codigo = document.querySelector('#codigo');
const permiso = document.querySelector('#permiso');


codigo.addEventListener('click', async (e) => {
    e.preventDefault();
    // darle click al boton para dirigir a la pagina de mercado
    window.location.href = "codigo/codigo.html";
});


permiso.addEventListener('click', async (e) => {
    e.preventDefault();
    // darle click al boton para dirigir a la pagina de mercado
    window.location.href = "editar/editar.html";
});

const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);
// capturar username
const username = docSnap.data().username;

titulo.innerHTML = " ¡ BIENVENIDO " + username + " ! ";

