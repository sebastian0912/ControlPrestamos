import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');
// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');

const numeroDias = document.querySelector('#diasRestantes');


const mercado = document.querySelector('#mercado');
const prestamo = document.querySelector('#prestamo');
let extraeT = document.getElementById("extraeT");


/*Calculo cuantos dias faltan*/
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
    dia = 13 ;
}
else if (ahora.getDate() < 28 || ahora.getDate() > 29) {
    dia = 28 ;
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

/*Captura nombre y perfil*/

const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    const oculto = document.querySelector('#oculto');
    oculto.style.display = "block";
    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;
    const docRef = doc(db, "Historial", cedulaEmpleado);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data().historia;  
    data.forEach(async (p) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.cedula}</td>
                <td>${p.concepto}</td>            
                <td>${p.fechaEfectuado}</td>
                <td>${p.valor}</td>
                <td>${p.cuotas}</td>
                <td>${p.nombreQuienEntrego}</td>
            </tr>
            `
    }); 
});



