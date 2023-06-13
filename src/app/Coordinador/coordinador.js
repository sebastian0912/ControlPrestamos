
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";


// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;


const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');


const idUsuario = localStorage.getItem("idUsuario");

/*Calculo cuantos dias faltan*/
// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 15 || ahora.getDate() == 30) {
    dia = 0;
    numeroDias.style.color = "red";
}
else if (ahora.getDate() < 15) {
    dia = 15;
}
else if (ahora.getDate() < 30) {
    dia = 30;
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
diasRestantes.innerHTML = dias;


// Mostrar en el html el numero de dias Restantes de liquidacion
var fechaObjetivo2 = ['2023-04-10', '2023-04-24', '2023-05-08', '2023-05-23', '2023-06-07', '2023-06-23', '2023-07-05', '2023-07-26', '2023-08-09', '2023-08-23', '2023-09-06', '2023-09-25', '2023-10-06', '2023-10-23', '2023-11-08', '2023-11-22', '2023-11-05', '2023-12-21', '2024-01-05']
// Recorre el arreglo y muestra los dias restantes deacuerdo a la fecha
for (let i = 0; i < fechaObjetivo2.length; i++) {
    // separar por año, mes y dia
    var fechaObjetivo3 = new Date(fechaObjetivo2[i]);
    if (fechaObjetivo3.getFullYear() == ahora.getFullYear() &&
        fechaObjetivo3.getMonth() == ahora.getMonth() &&
        fechaObjetivo3.getDate() >= ahora.getDate()) {

        var diferencia2 = fechaObjetivo3 - ahora;
        var dias2 = Math.ceil(diferencia2 / (1000 * 60 * 60 * 24));
        if (dias2 == 0) {
            diasLi.style.color = "red";
        }
        diasLi.innerHTML = dias2;
        break;
    }
}

/* obtener el numero de empleados y actulizar con getDocs*/
const querySnapshot = await getDocs(collection(db, "Base"));
const Base = querySnapshot.docs.map((doc) => doc.data());
/* Obtener codigos de la base de datos */
const docRef = doc(db, "Codigos", idUsuario);
const docSnap = await getDoc(docRef);
let codigos;
if (!docSnap.data() == undefined) {
    codigos = docSnap.data().prestamos;
}
else {
    codigos = [];
}
// Base total de empleados
numeroTotal.innerHTML = Base.length;

// Numero de codigos activos de la base de datos del coodinador
let auxSolicitudes = 0;
if (codigos.length == 0) {
    numeroSolicitudesPendientes.innerHTML = 0;
}
else {
    /*Obtener el numero de solicitudes sin realizar*/
    for (let i = 0; i < codigos.length; i++) {
        if (codigos[i].estado == true) {
            auxSolicitudes++;
        }
    }
}
numeroSolicitudesPendientes.innerHTML = auxSolicitudes;

// Mostar contenido en una tabla
codigos.forEach((c) => {
    tabla.innerHTML += `
    <tr>
        <td>${c.codigo}</td>
        <td>${c.monto}</td>
        <td>${c.cuotas}</td>
        <td>${c.estado}</td>
        <td>${c.Concepto}</td>
        <td>${c.cedulaQuienPide}</td>
    </tr>
    `
});




