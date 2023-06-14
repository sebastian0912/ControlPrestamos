

import { comercio } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";
import { doc, getDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";

const boton = document.querySelector('#boton');

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const datosComercializadoraGeneral = localStorage.getItem("datosComercializadoraGeneral");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

/*Calculo cuantos dias faltan*/
// Obtén la fecha actual

var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 15 || ahora.getDate() == 30) {
    dia = 0;
    diasRestantes.style.color = "red";
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
    if (fechaObjetivo3.getFullYear() ==
        ahora.getFullYear() && fechaObjetivo3.getMonth() ==
        ahora.getMonth()
        && fechaObjetivo3.getDate() >= ahora.getDate()) {
        var diferencia2 = fechaObjetivo3 - ahora;
        var dias2 = Math.ceil(diferencia2 / (1000 * 60 * 60 * 24));
        if (dias2 == 0) {
            diasRestantesLi.style.color = "red";
        }
        diasRestantesLi.innerHTML = dias2;
        break;
    }
}

const miArray = JSON.parse(datosComercializadoraGeneral);

miArray.forEach((p) => {
    if (p.PersonaEnvia == usernameLocal) {
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
    }
});

let datos = [];
datos = miArray

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
    p.resultado = Math.abs(p.cantidadEnvio - p.cantidadTotalVendida); // Restamos las cantidades sumadas anteriormente
    if (p.PersonaEnvia == usernameLocal) {
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
    }
});