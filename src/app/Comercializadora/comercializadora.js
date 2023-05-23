
import { comercio } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";

const boton = document.querySelector('#boton');
const idUsuario = localStorage.getItem("idUsuario");


// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const nombre = document.querySelector('#nombre').value;
    const cantidad = document.querySelector('#cantidad').value;

    e.preventDefault();
    // capturar los datos del formulario 
    let aux = comercio;
    let uid = Math.floor(Math.random() * 1000000);
    aux.destino = nombre;
    aux.cantidadEnvio = cantidad;
    aux.uidPersonaEnvia = idUsuario;
    await setDoc(doc(db, "Comercio", uid.toString()), aux);
    aviso("Se ha cargado la informacion exitosamente", "success");
});