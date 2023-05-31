

import { comercio } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs,onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";

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

const querySnapshot3 = await getDocs(collection(db, "Comercio"));

querySnapshot3.forEach( (cod) => {
    const unsub = onSnapshot(doc(db, "Comercio", cod.id), (doc) => {
        const p = doc.data();
        tabla.innerHTML += `
            <tr>
                <td>${p.concepto}</td>            
                <td>${p.destino}</td>
                <td>${p.cantidadEnvio}</td>
                <td>${p.cantidadRecibida}</td>
                <td>${p.valorUnidad}</td>
                <td>${p.cantidadTotalVendida}</td>
                <td>${p.PersonaEnvia}</td>
                <td>${p.PersonaRecibe}</td>
                <td>${p.fechaEnviada}</td>
                <td>${p.fechaRecibida}</td>
            </tr>
            `
    });
});

const querySnapshot4 = await getDocs(collection(db, "Comercio"));
let datos = [];
datos = querySnapshot4.docs.map(doc => doc.data());

let agrupado = datos.reduce((acumulador, item) => {
    // Creamos una llave única para cada grupo de 'concepto' y 'destino'
    let clave = `${item.concepto}-${item.destino}`;

    // Si este grupo no existe en el acumulador, lo inicializamos con los datos del item actual
    if (!acumulador[clave]) {
        acumulador[clave] = {
            ...item,
            cantidadEnvio: 0,       // Inicializamos la suma de las cantidades enviadas
            cantidadTotalVendida: 0 // Inicializamos la suma de las cantidades totales vendidas
        };
    }

    // Sumamos las cantidades enviadas y totales vendidas al grupo correspondiente
    acumulador[clave].cantidadEnvio += Number(item.cantidadEnvio);
    acumulador[clave].cantidadTotalVendida += Number(item.cantidadTotalVendida);

    return acumulador;
}, {});

// Convertimos el objeto acumulador a una matriz para su uso posterior
agrupado = Object.values(agrupado);

// Ahora puedes usar 'agrupado' para generar tu tabla:
agrupado.forEach((p) => {
    p.resultado = p.cantidadEnvio - p.cantidadTotalVendida; // Restamos las cantidades sumadas anteriormente
    tabla2.innerHTML += `
        <tr>
            <td>${p.concepto}</td>            
            <td>${p.destino}</td>
            <td>${p.cantidadEnvio}</td>
            <td>${p.cantidadRecibida}</td>
            <td>${p.valorUnidad}</td>
            <td>${p.resultado}</td>    <!-- Aquí mostramos el resultado de la resta -->
        </tr>
    `;
});

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

