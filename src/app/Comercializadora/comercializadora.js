

import { urlBack } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";


const boton = document.querySelector('#boton');

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const iddatos = localStorage.getItem("idUsuario");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;


// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 1;
var bandera = true;

if (ahora.getDate() == 13 || ahora.getDate() == 27) {
    dia = 0;
    diasRestantes.innerHTML = "0";
    diasRestantes.style.color = "red";
    bandera = false;
}
else if (ahora.getDate() < 13) {
    dia = 13;
}
else if (ahora.getDate() < 27) {
    dia = 27;
}
else {
    dia = 13;
    mes++; // Cambia al próximo mes
}
if (bandera) {
    // Crea la fecha objetivo
    var fechaObjetivo = new Date(anio, mes, dia);
    // Calcula la diferencia en milisegundos
    var diferencia = fechaObjetivo - ahora;
    // Convierte la diferencia en días
    var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    diasRestantes.innerHTML = dias;
}

var fechaObjetivo2 = ['2023-04-10', '2023-04-24', '2023-05-08', '2023-05-23', '2023-06-07', '2023-06-23', '2023-07-05', '2023-07-26', '2023-08-09', '2023-08-23', '2023-09-06', '2023-09-25', '2023-10-06', '2023-10-23', '2023-11-08', '2023-11-22', '2023-11-05', '2023-12-21', '2024-01-05'];

function obtenerFecha() {
    // Convertimos la fecha actual a un formato que coincida con las fechas del arreglo
    var fechaActualFormato = ahora.toISOString().slice(0, 10);

    var fechaSeleccionada = null;

    for (var i = 0; i < fechaObjetivo2.length; i++) {
        // Comparamos las fechas ignorando la información de la hora y el huso horario
        if (fechaActualFormato <= fechaObjetivo2[i]) {
            fechaSeleccionada = fechaObjetivo2[i];
            return fechaSeleccionada;
        }
    }
}

var diferencia2 = new Date(obtenerFecha()) - ahora;
var dias2 = Math.ceil(diferencia2 / (1000 * 60 * 60 * 24));

if (dias2 == 0) {
    console.log(dias2)
    diasLi.style.color = "red";
} else {
    diasLi.style.color = "black";
}
diasLi.innerHTML = dias2;


async function datosTComercio() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Comercio/comercio';

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

let datosComercializadoraGeneral = [];
datosComercializadoraGeneral = await datosTComercio();
let miArray = datosComercializadoraGeneral.comercio;
console.log(miArray);

// ordernar por fecha 
miArray.sort(function (a, b) {
    if (a.fechaEnviada > b.fechaEnviada) {
        return -1;
    }
    if (a.fechaEnviada < b.fechaEnviada) {
        return 1;
    }
    return 0;
});

miArray.forEach((p) => {
    if (p.fechaRecibida == null) {
        p.fechaRecibida = "";
    }
    if (p.PersonaEnvia == usernameLocal) {
        if (p.cantidadRecibida != p.cantidadTotalVendida || p.cantidadEnvio != p.cantidadRecibida) {
            tabla.innerHTML += `
        <tr>
            <td>${p.codigo}</td>
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
    `}
    }
});

let datos = [];
datos = miArray

let agrupado = miArray.reduce((acumulador, item) => {
    // Creamos una llave única para cada grupo de 'concepto', 'destino', y 'valorUnidad'
    let clave = `${item.concepto}-${item.destino}-${item.valorUnidad}`;

    // Si este grupo no existe en el acumulador, lo inicializamos con los datos del item actual
    if (!acumulador[clave]) {
        acumulador[clave] = {
            ...item,
            cantidadEnvio: 0,       // Inicializamos la suma de las cantidades enviadas
            cantidadTotalVendida: 0, // Inicializamos la suma de las cantidades totales vendidas
            cantidadRecibida: 0     // Inicializamos la suma de las cantidades recibidas
        };
    }

    // Sumamos las cantidades enviadas, totales vendidas y recibidas al grupo correspondiente
    acumulador[clave].cantidadEnvio += Number(item.cantidadEnvio);
    acumulador[clave].cantidadTotalVendida += Number(item.cantidadTotalVendida);
    acumulador[clave].cantidadRecibida += Number(item.cantidadRecibida);

    return acumulador;
}, {});



// Convertimos el objeto acumulador a una matriz para su uso posterior
agrupado = Object.values(agrupado);

// ordenar por lugar 
agrupado.sort(function (a, b) {
    if (a.destino > b.destino) {
        return 1;
    }
    if (a.destino < b.destino) {
        return -1;
    }
    return 0;
});

// Ahora puedes usar 'agrupado' para generar tu tabla:
agrupado.forEach((p) => {
    let aux
    if (p.cantidadTotalVendida == 0) {
        aux = 0;
    }
    else {
        aux = p.cantidadTotalVendida;
    }
    p.resultado = Math.abs(p.cantidadEnvio - aux); // Restamos las cantidades sumadas anteriormente
    let cantidad =   Math.abs(parseInt(p.cantidadEnvio) - parseInt(p.cantidadRecibida))

    console.log(p.destino)
    console.log(p.concepto)
    console.log(p.cantidadEnvio)
    console.log(aux)
    console.log("------------------")
    tabla2.innerHTML += `
        <tr>
            <td>${p.concepto}</td>            
            <td>${p.destino}</td>
            <td>${p.cantidadEnvio}</td>
            <td>${p.cantidadRecibida}</td>
            <td>${cantidad}</td>
            <td>${p.valorUnidad}</td>
            <td>${p.resultado}</td>    <!-- Aquí mostramos el resultado de la resta -->
        </tr>
    `;


});