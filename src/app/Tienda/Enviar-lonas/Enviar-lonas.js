

import { comercio } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

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
let datos = ["Sede","Faca Principal", "Faca Centro", "Rosal", "Cartagenita", "Madrid", "Funza", "Soacha", "Fontibón", "Suba", "Tocancipá", "Bosa"];
let datos2 = ["Concepto","Fruver", "Verdura", "Carne"];

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

if (ahora.getDate() == 15 || ahora.getDate() == 30) {
    dia = 0;
    numeroDias.style.color = "red";
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
        if (dias2 == 0){
            diasRestantesLi.style.color = "red";
        }
        diasRestantesLi.innerHTML = dias2;
        break;
    }
}


let mostrarAviso = false;
miSelect2.addEventListener('change', async (e) => {
    const querySnapshot = await getDocs(collection(db, "Conceptos"));
    const otro = document.querySelector('#otro2');

    if (e.target.value == "11") {
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

    let aux = comercio;
    let uid;
    uid = Math.floor(Math.random() * 10000000);

    aux.codigo = uid;
    aux.destino = miSelect;
    aux.concepto = miSelect2;
    aux.cantidadEnvio = cantidad;
    aux.PersonaEnvia = usernameLocal;
    aux.valorUnidad = nuevovalor;
    aux.fechaEnviada = new Date().toLocaleDateString();
    await setDoc(doc(db, "Comercio", uid.toString()), aux);
    aviso("Se ha cargado la informacion exitosamente, el codigo es: " + uid, "success");
});



