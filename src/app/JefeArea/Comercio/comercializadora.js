
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroDias = document.querySelector('#diasRestantes');

//Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;


/*Calculo cuantos dias faltan*/
// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    dia = 0;
}
else if (ahora.getDate() < 13 || ahora.getDate() > 14) {
    dia = 13;
}
else if (ahora.getDate() < 28 || ahora.getDate() > 29) {
    dia = 28;
}

// Comprueba si el día ya ha pasado este mes
if (ahora.getDate() > dia) {
    // Si es así, cambia al próximo mes
    mes++;
}
// Crea la fecha objetivo
var fechaObjetivo = new Date(anio, mes, dia);
// Calcula la diferencia en milisegundos
var diferencia = fechaObjetivo - ahora;
// Convierte la diferencia en días
var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
numeroDias.innerHTML = dias;


// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const cantidad = document.querySelector('#Cantidad').value;
    //const valorUnidad = document.querySelector('#valorUnidad').value;
    const codigo = document.querySelector('#codigo').value;
    ///const otro = document.querySelector('#otro').value;

    const docRef = doc(db, "Comercio", codigo);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

    await updateDoc(doc(db, "Comercio", codigo), {
        cantidadRecibida: cantidad, 
        PersonaRecibe: username,
    });
    aviso("Se ha cargado la informacion exitosamente", "success");
});
