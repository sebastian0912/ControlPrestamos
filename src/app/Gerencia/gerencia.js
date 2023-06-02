

import { doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";


// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroCoordinadores = document.querySelector('#numeroCoordinadores');
const numeroTiendas = document.querySelector('#numeroTiendas');
const numeroDias = document.querySelector('#diasRestantes');
let extraeT = document.getElementById("extraeT");


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

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    numeroDias.style.color = "red";
    numeroDias.innerHTML = dias;
}
else {
    numeroDias.innerHTML = dias;
}


/* obtener el numero de empleados y actulizar con onsnapshot*/

const querySnapshot = await getDocs(collection(db, "Base"));
numeroTotal.innerHTML = querySnapshot.size;


/*Obtener el numero de solicitudes sin realizar*/
let auxCoordinadores = 0;
const querySnapshot2 = await getDocs(collection(db, "Usuarios"));
querySnapshot2.forEach((doc) => {
    if (doc.data().perfil == "Coordinador") {
        auxCoordinadores++;
    }
});
numeroCoordinadores.innerHTML = auxCoordinadores;


/*Obtener el numero de solicitudes sin realizar*/
let auxTiendas = 0;
const querySnapshot3 = await getDocs(collection(db, "Usuarios"));
querySnapshot3.forEach((doc) => {
    if (doc.data().perfil == "Tienda") {
        auxTiendas++;
    }
});
numeroTiendas.innerHTML = auxTiendas;


const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;


extraeT.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Tienda"));
    
    let dataString = 'nombre\tMonto Total\t Numero de compras en la tienda\n';
    
    querySnapshot.forEach((doc) => {
        const docData = doc.data();        
        dataString += 
        docData.nombre + '\t' +
        docData.valorTotal + '\t' +
        docData.numPersonasAtendidas + '\n';        
    });

    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datosTienda.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});