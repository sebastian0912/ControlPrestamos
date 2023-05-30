
import { doc, getDoc, getDocs, setDoc, updateDoc, collection , onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";


// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');
const numeroDias = document.querySelector('#diasRestantes');


const mercado = document.querySelector('#mercado');
const prestamo = document.querySelector('#prestamo');


// Mostar contenido en una tabla
const tabla = document.querySelector('#tabla');
/*
const unsub = onSnapshot(doc(db, "Codigos", idUsuario), (doc) => {    
    const prestamos = doc.data().prestamos;
    tabla.innerHTML = '';
    prestamos.forEach((p) => {
        tabla.innerHTML += `
        <tr>
            <td>${p.codigo}</td>            
            <td>${p.monto}</td>
            <td>${p.cuotas}</td>
            <td>${p.estado}</td>
            <td>${p.lugar}</td>
            <td>${p.cedulaQuienPide}</td>
        </tr>
        `
    }
    );
});*/


/*Calculo cuantos dias faltan*/
// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    dia = 0;
}
else if (ahora.getDate() < 13 || ahora.getDate() > 14) {
    dia = 13;
}
else if (ahora.getDate() < 28 || ahora.getDate() > 29) {
    dia = 28;
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

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    numeroDias.style.color = "red";
    numeroDias.innerHTML = dias;
}
else {
    numeroDias.innerHTML = dias;
}


/* obtener el numero de empleados y actulizar con onsnapshot*/
/*
const querySnapshot = await getDocs(collection(db, "Base"));
numeroTotal.innerHTML = querySnapshot.size;*/


/*Obtener el numero de solicitudes sin realizar
let auxSolicitudes = 0;
const docRef = doc(db, "Codigos", idUsuario);
const docSnap = await getDoc(docRef);
// recorrer arreglo llamado prestamos para buscar el codigo
const prestamos = docSnap.data().prestamos;
prestamos.forEach(async (p) => {
    console.log('entro al for');
    if (p.estado == true) {
        auxSolicitudes++;
    }
});
numeroSolicitudesPendientes.innerHTML = auxSolicitudes;*/

/*Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;*/

