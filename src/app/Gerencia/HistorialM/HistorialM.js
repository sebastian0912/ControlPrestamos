

import { comercio, urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";

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


var body = localStorage.getItem('key');
const obj = JSON.parse(body);
const jwtKey = obj.jwt;
var datos;
const headers = {
    'Authorization': jwtKey
};

const urlcompleta = urlBack.url + '/HistorialModificaciones/Comercializadora/verModificaciones';

try {
    const response = await fetch(urlcompleta, {
        method: 'GET',
        headers: headers,
    });

    if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        datos = responseData;
    } else {
        throw new Error('Error en la petición GET');
    }
} catch (error) {
    console.error('Error en la petición HTTP GET');
    console.error(error);
    throw error; // Propaga el error para que se pueda manejar fuera de la función
}

console.log(datos);
datos.historialModificaciones.forEach((doc) => {
    const datos = doc;
    tabla.innerHTML += `
        <tr>
            <td>${doc.codigo}</td>
            <td>${doc.concepto}</td>
            <td>${doc.fechaEfectuado}</td>
            <td>${doc.username}</td>
        </tr>
    `;
})