

import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";


const boton = document.querySelector('#boton');
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
let miSelect = document.querySelector('#miSelect');
let miSelect2 = document.querySelector('#miSelect2');
// Mostrar en el html el numero de dias
const numeroDias = document.querySelector('#diasRestantes');
const diasRestantesLi = document.querySelector('#diasRestantesLi');

// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;


// Arreglo con las sedes y conceptos
let datos = ["FACA_PRINCIPAL", "FACA_CENTRO", "ROSAL", "CARTAGENITA", "MADRID", "FUNZA", "SOACHA", "FONTIBÓN", "SUBA", "TOCANCIPÁ", "BOSA", "BOGOTÁ"];
let datos2 = ["Mercado", "Kit escolar", "Kit aseo", "Anchetas", "Matrimonios", "Kit velitas", "Kit amor y amistad", "Kit Día de las Madres", "Juguetes", "Kit dulces", "Otro"];

// recorrer el arreglo y mostrarlo en el select
for (let i = 0; i < datos.length; i++) {
    let opcion = document.createElement("option");
    opcion.value = datos[i];
    opcion.text = datos[i];
    miSelect.appendChild(opcion);
}

// recorrer el arreglo y mostrarlo en el select
for (let i = 0; i < datos2.length; i++) {
    let opcion = document.createElement("option");
    opcion.value = datos2[i];
    opcion.text = datos2[i];
    miSelect2.appendChild(opcion);
}



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


let mostrarAviso = false;
miSelect2.addEventListener('change', async (e) => {
    const otro = document.querySelector('#otro2');

    if (e.target.value == "Otro") {
        mostrarAviso = true;
        otro.style.display = "inline-block";
    } else {
        mostrarAviso = false;
        otro.style.display = "none";
    }
});

boton.addEventListener('click', async (e) => {
    if (mostrarAviso) {
        const otro2 = document.querySelector('#otro2');
        if (otro2.value == "") {
            aviso("No se ha ingresado ningun valor", "error");
        }
    }
});

/*Convertir valor a separado por miles*/
const numemoroM = document.querySelector('#valorUnidad');
numemoroM.addEventListener('keyup', (e) => {
    var num = numemoroM.value.replace(/\,/g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/, '');
        numemoroM.value = num;
    } else {
        alert('Solo se permiten números');
    }
});


async function enviarLona(cod, destino, concepto, cantidad, valorUnidad, PersonaEnvia) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    // yyyy-mm-dd
    const fecha = anio + '-' + mes + '-' + dia;
    const urlcompleta = urlBack.url + '/Comercio/Comercializadora/realizarenvio';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: cod,
                    concepto: concepto,
                    destino: destino,
                    cantidadEnvio: cantidad,
                    valorUnidad: valorUnidad,
                    PersonaEnvia: PersonaEnvia,                    
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
    e.preventDefault();

    const cantidad = document.querySelector('#cantidad').value;
    const valorUnidad = document.querySelector('#valorUnidad').value;
    const nuevovalor = valorUnidad.replace(/\,/g, '');
    const otro2 = document.querySelector('#otro2').value;
    let miSelect = document.querySelector('#miSelect').value;
    let miSelect2 = document.querySelector('#miSelect2').value;

    if (otro2 != "") {
        miSelect2 = otro2;
    }

    // Verificar que los campos requeridos están llenos
    if (!miSelect || !miSelect2 || !cantidad || !valorUnidad) {
        aviso("Por favor, completa todos los campos requeridos.", "warning");
        return;
    }

    let uid = Math.floor(Math.random() * 10000000);;

    await enviarLona(uid, miSelect, miSelect2, cantidad, nuevovalor, usernameLocal);


    aviso("Se ha cargado la informacion exitosamente, el codigo es: " + uid, "success");
    // Limpiar los campos
    document.querySelector('#cantidad').value = "";
    document.querySelector('#valorUnidad').value = "";
    document.querySelector('#otro2').value = "";
    document.querySelector('#miSelect').value = "";
    document.querySelector('#miSelect2').value = "";
    
});



