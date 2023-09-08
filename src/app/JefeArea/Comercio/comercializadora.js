
import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";


const boton = document.querySelector('#boton');

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const sede = localStorage.getItem("sede");

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


// Mostar contenido en una tabla
const tabla = document.querySelector("#tabla");

let datosComercializadoraGeneral = [];
datosComercializadoraGeneral = await datosTComercio();
let datosArreglo = datosComercializadoraGeneral.comercio;



console.log(datosArreglo);
let aux = [];
console.log(sede);

datosArreglo.forEach((p) => {
    if (p.destino == sede && p.cantidadRecibida == 0) {
        aux.push(p);
    }
});

console.log(aux);

if (aux.length == 0) {
    aviso("No hay envios por recibir", "warning")
    
    tabla.innerHTML += `
        <tr>
            <td colspan="9">No envios por recibir</td>
        </tr>
    `
}

aux.forEach((p) => {
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
        </tr>
    `
});



async function actualizar(cod, cantidadRecibida, PersonaRecibe, comentariosLlegada) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Comercio/jefedearea/recibirenvio/' + cod;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    cantidadRecibida: cantidadRecibida,
                    PersonaRecibe: PersonaRecibe,
                    comentariosRecibido: comentariosLlegada,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }
}




async function obtenerDatosComercio(codigo) {
    let datosComercializadoraGeneral = [];
    datosComercializadoraGeneral = await datosTComercio();
    let miArray = datosComercializadoraGeneral.comercio;
    console.log(miArray);
    let objeto = null;

    miArray.forEach((p) => {
        if (p.codigo == codigo) {
            console.log(p);
            return objeto = p;
        }
    });
    return objeto;
}

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const cantidad = document.querySelector('#Cantidad').value;
    //const valorUnidad = document.querySelector('#valorUnidad').value;
    const codigo = document.querySelector('#codigo').value;
    const comentariosLlegada = document.querySelector('#comentariosLlegada').value;
    ///const otro = document.querySelector('#otro').value;
    const datosCodigo = await obtenerDatosComercio(codigo);

    if (codigo == "") {
        aviso("Por favor ingrese el código generado por la comercializadora", "error");
        return;
    }
    if (cantidad == "") {
        aviso("Por favor ingrese la cantidad recibida", "error");
        return;
    }

    /* necesito enviar un correo a un @gmail con la informacion de la cantidad recibida, 
    el codigo, el nombre de la persona que recibe, el nombre de la persona que envia, sede, fecha enviado, fecha recibido y la cantidad enviada */

   

    actualizar(codigo, cantidad, usernameLocal, comentariosLlegada);
    aviso("Se ha cargado la informacion exitosamente", "success");
});
