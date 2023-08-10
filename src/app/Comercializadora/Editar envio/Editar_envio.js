

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
let datos = ["Faca Principal", "Faca Centro", "Rosal", "Cartagenita", "Madrid", "Funza", "Soacha", "Fontibón", "Suba", "Tocancipá", "Bosa"];
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

async function editarEnvio(destino, concepto, cantidad, valorUnidad, cod) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    // yyyy-mm-dd
    const fecha = anio + '-' + mes + '-' + dia;
    const urlcompleta = urlBack.url + '/Comercio/Comercializadora/editarEnvio/' + cod;
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


async function historialModificaciones(concepto, cod) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    // yyyy-mm-dd
    const fecha = anio + '-' + mes + '-' + dia;
    const urlcompleta = urlBack.url + '/HistorialModificaciones/Comercializadora/crearRegistro';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: cod,
                    concepto: concepto,
                    username: usernameLocal,
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


let mostrarAviso = false;
miSelect2.addEventListener('change', async (e) => {
    const otro = document.querySelector('#otro2');

    if (e.target.value == "11") {
        mostrarAviso = true;
        otro.style.display = "inline-block";
    } else {
        mostrarAviso = false;
        otro.style.display = "none";
    }
});

boton2.addEventListener('click', async (e) => {
    if (mostrarAviso) {
        const otro2 = document.querySelector('#otro2');
        if (otro2.value == "") {
            aviso("No se ha ingresado ningun valor", "error");
        }
    }
});



// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    const codigo = document.querySelector('#Codigo').value;
    const cantidad = document.querySelector('#cantidad');
    const valorUnidad = document.querySelector('#valorUnidad');
    const otro2 = document.querySelector('#otro2').value;
    let miSelect = document.querySelector('#miSelect');
    let miSelect2 = document.querySelector('#miSelect2');

    const datosCodigo = await obtenerDatosComercio(codigo);
    console.log(datosCodigo);
    if (datosCodigo != null) {
        console.log(datosCodigo);
        if (datosCodigo.cantidadRecibida == "") {
            const codigo2 = document.querySelector('#Codigo');

            boton.style.display = "none";
            codigo2.style.display = "none";
            cantidad.style.display = "inline-block";
            valorUnidad.style.display = "inline-block";
            miSelect.style.display = "inline-block";
            miSelect2.style.display = "inline-block";
            boton2.style.display = "inline-block";
            if (otro2 != "") {
                miSelect2 = otro2;
            }
            cantidad.placeholder = datosCodigo.cantidadEnvio;
            valorUnidad.placeholder = datosCodigo.valorUnidad;
            miSelect.value = datosCodigo.destino;
            miSelect2.value = datosCodigo.concepto;

            boton2.addEventListener('click', async (e) => {
                e.preventDefault();
                const cantidadValor = cantidad.value || cantidad.placeholder;
                const valorUnidadValor = valorUnidad.value || valorUnidad.placeholder;

                console.log(cantidadValor);
                console.log(valorUnidadValor);
                console.log(miSelect.value);
                console.log(miSelect2.value);

                const nuevovalor = valorUnidadValor.replace(/\,/g, '');
                await editarEnvio(miSelect.value, miSelect2.value, cantidadValor, nuevovalor, codigo);
                aviso("Se ha actualizado correctamente", "success");
            });



            await historialModificaciones("Editar envio", codigo);
/*
            // crear un nuevo registro en la coleccion historial
            const docHistorial = doc(db, "HistorialModificaciones", codigo);
            const HistorialRef = await getDoc(docHistorial);
            let aux = historialModificaciones;
            if (HistorialRef.exists()) {
                aux.codigo = datosCodigo.data().codigo;
                aux.concepto = "Editar envio";
                let fecha = new Date();
                var fechaHoraString = fecha.getFullYear() + '-' + fecha.getMonth() + 1 + '-' + fecha.getDay() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getMinutes();
                aux.fechaEfectuado = fechaHoraString;
                aux.username = usernameLocal;
                await updateDoc(doc(db, "HistorialModificaciones", codigo), {
                    historia: arrayUnion(aux)
                });
            }
            else {
                aux.codigo = datosCodigo.data().codigo;
                aux.concepto = "Editar envio";
                let fecha = new Date();
                var fechaHoraString = fecha.getFullYear() + '-' + fecha.getMonth() + 1 + '-' + fecha.getDay() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getMinutes();
                aux.fechaEfectuado = fechaHoraString;
                aux.username = usernameLocal;
                await setDoc(docHistorial, {
                    historia: [aux]
                });
            }*/

        }
        else {
            aviso("El envio ya fue recibido", "error");
        }
    }










});



