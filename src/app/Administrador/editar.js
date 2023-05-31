
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, onSnapshot, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";
import { codigo, historial } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";


const boton = document.querySelector('#boton');
// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroDias = document.querySelector('#diasRestantes');


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
/*si el dia es 13 o 14 o 28 o 29 colocar numeroDias.innerHtml en rojo*/

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    numeroDias.style.color = "red";
    numeroDias.innerHTML = dias;
}
else {
    numeroDias.innerHTML = dias;
}

//Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;

const miSelect = document.getElementById('miSelect');

const querySnapshot = await getDocs(collection(db, "Usuarios"));

// crear un arreglo de tipo aux
let datos = [];

querySnapshot.forEach((doc) => {
    let aux = {
        codigo: '',
        nombre: '',
    };
    //console.log(doc.id);
    aux.codigo = doc.id;
    aux.nombre = doc.data().username;
    datos.push(aux);
});

// imprimir el arreglo
//console.log(datos);


datos.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.nombre;
    option.value = opcion.codigo;
    miSelect.appendChild(option);
});

// al darle click a cualquier opcion del select imprima el valor
miSelect.addEventListener('change', async (e) => {
    //console.log(e.target.value);
    const boton = document.querySelector('#boton');

    const docRef = doc(db, "Usuarios", e.target.value);
    const docSnap = await getDoc(docRef);   
    
    let codigo = e.target.value;
    
    boton.style.display = "inline-block";    
    
    boton.addEventListener('click', async (e) => {
        await deleteDoc(doc(db, "Usuarios", codigo));

        aviso("Se ha eliminado el usuario correctamente");
    }
    
    );

}
);

