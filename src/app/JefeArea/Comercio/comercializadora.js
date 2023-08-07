
import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";


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
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 27) {
    dia = 0;
    numeroDias.style.color = "red";
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

// Crea la fecha objetivo
var fechaObjetivo = new Date(anio, mes, dia);
// Calcula la diferencia en milisegundos
var diferencia = fechaObjetivo - ahora;
// Convierte la diferencia en días
var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
diasRestantes.innerHTML = dias;


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

async function actualizar(cod, cantidadRecibida, PersonaRecibe) {
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

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const cantidad = document.querySelector('#Cantidad').value;
    //const valorUnidad = document.querySelector('#valorUnidad').value;
    const codigo = document.querySelector('#codigo').value;
    ///const otro = document.querySelector('#otro').value;
    
    if (codigo == "") {
        aviso("Por favor ingrese el codigo generado por la comercializadora", "error");
        return;
    }
    if (cantidad == "") {
        aviso("Por favor ingrese la cantidad recibida", "error");
        return;
    }
    
    actualizar(codigo, cantidad, usernameLocal);
    aviso("Se ha cargado la informacion exitosamente", "success");
});
