

import { comercio, historialModificaciones } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";
import axios from 'axios';
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



/*Calculo cuantos dias faltan*/
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



// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    const codigo = document.querySelector('#Codigo').value;



    const cantidad = document.querySelector('#cantidad');
    const valorUnidad = document.querySelector('#valorUnidad');
    //
    const otro2 = document.querySelector('#otro2').value;
    let miSelect = document.querySelector('#miSelect');
    let miSelect2 = document.querySelector('#miSelect2');









    const datosCodigo = await getDoc(doc(db, "Comercio", codigo));
    if (datosCodigo.exists()) {
        if (datosCodigo.data().cantidadRecibida == "") {
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
            cantidad.placeholder = datosCodigo.data().cantidadEnvio;
            valorUnidad.placeholder = datosCodigo.data().valorUnidad;
            miSelect.value = datosCodigo.data().destino;
            miSelect2.value = datosCodigo.data().concepto;

            boton2.addEventListener('click', async (e) => {
                const nuevovalor = valorUnidad.value.replace(/\,/g, '');
                await updateDoc(doc(db, "Comercio", codigo), {
                    cantidadEnvio: cantidad.value,
                    valorUnidad: nuevovalor,
                    destino: miSelect.value,
                    concepto: miSelect2.value,
                });// se hace peticion post con el id del comercioComercio.objects.filter(codigo=id)

                aviso("Se ha actualizado correctamente", "success");
            });





            /*// crear un nuevo registro en la coleccion historial
            const docHistorial = doc(db, "HistorialModificaciones", codigo);
            const HistorialRef = await getDoc(docHistorial);
            let aux = historialModificaciones;
            if (HistorialRef.exists()) {
                aux.codigo = datosCodigo.data().codigo;
                aux.concepto = "Editar envio";
                let fecha = new Date();
                var fechaHoraString = fecha.getFullYear() + '-' + fecha.getMonth()+1 + '-' + fecha.getDay() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getMinutes();
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
                var fechaHoraString = fecha.getFullYear() + '-' + fecha.getMonth()+1 + '-' + fecha.getDay() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getMinutes();
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



