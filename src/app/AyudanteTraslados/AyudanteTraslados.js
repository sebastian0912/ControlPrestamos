import { urlBack } from "../models/base.js";
import { aviso, avisoConfirmacionAc, avisoConfirmado } from "../Avisos/avisos.js";

// Capturar elementos HTML importantes
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const diasRestantes = document.querySelector('#diasRestantes');  // Asegúrate de tener este elemento en tu HTML
const diasLi = document.querySelector('#diasLi');  // Asegúrate de tener este elemento en tu HTML
const tabla = document.querySelector('#tabla');  // Asegúrate de que este ID esté en tu tabla HTML

// Captura de datos desde localStorage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const estado = localStorage.getItem("estadoSolicitudes");
const uid = localStorage.getItem("idUsuario");
const correo = localStorage.getItem("correo_electronico");

// Mostrar en la interfaz el nombre y perfil del usuario
titulo.textContent = usernameLocal;
perfil.textContent = perfilLocal;

const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');

// Obtén la fecha actual y maneja los días restantes
const ahora = new Date();
const diaActual = ahora.getDate();
let dia = 1;
let bandera = true;

if (diaActual === 13 || diaActual === 27) {
    dia = 0;
    diasRestantes.textContent = "0";
    diasRestantes.style.color = "red";
    bandera = false;
} else if (diaActual < 13) {
    dia = 13;
} else if (diaActual < 27) {
    dia = 27;
} else {
    dia = 13;
    ahora.setMonth(ahora.getMonth() + 1);  // Cambia al próximo mes
}

if (bandera) {
    const fechaObjetivo = new Date(ahora.getFullYear(), ahora.getMonth(), dia);
    const diferencia = fechaObjetivo - ahora;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    diasRestantes.textContent = dias;
}

// Funciones para obtener datos de traslados y correos
async function datosTraslados() {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = { 'Authorization': jwtKey };
    const urlCompleta = urlBack.url + '/traslados/traer_todo_base_general';

    try {
        const response = await fetch(urlCompleta, { method: 'GET', headers: headers });
        if (!response.ok) throw new Error('Error en la petición GET');
        return await response.json();
    } catch (error) {
        console.error('Error en la petición HTTP GET', error);
        throw error;
    }
}

async function datosCorreos(usernameLocal) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };
    const urlCompleta = urlBack.url + '/traslados/traer_todo_correos_raul?responsable=' + encodeURIComponent(usernameLocal);

    try {
        const response = await fetch(urlCompleta, { method: 'GET', headers: headers });
        if (!response.ok) throw new Error('Error en la petición GET');
        return await response.json();
    } catch (error) {
        console.error('Error en la petición HTTP GET', error);
        throw error;
    }
}


