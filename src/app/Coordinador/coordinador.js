
import { doc, getDoc, getDocs, setDoc, updateDoc , collection } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
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

/*Calculo cuantos dias faltan*/
const dias = new Date().getDate();
if (dias == 13 || dias == 14 || dias == 28 || dias == 29) {
    numeroDias.innerHTML = "0" ;
}
else if (dias < 13 || dias > 14) {
    numeroDias.innerHTML = 14 - dias;
}

/* obtener el numero de empleados y actulizar con onsnapshot*/
/*
const querySnapshot = await getDocs(collection(db, "Base"));
numeroTotal.innerHTML = querySnapshot.size;*/


/*Obtener el numero de solicitudes sin realizar
const querySnapshot2 = await getDocs(collection(db, "Codigos"));
const auxSolicitudes = 0;
querySnapshot2.forEach(async (cod) => {
    const docRef = doc(db, "Codigos", cod.id);
    const docSnap = await getDoc(docRef);
    // recorrer arreglo llamado prestamos para buscar el codigo
    const prestamos = docSnap.data().prestamos;

    prestamos.forEach(async (p) => {
        if (p.estado == true) {
            auxSolicitudes++;
        }
    });
});

numeroSolicitudesPendientes.innerHTML = auxSolicitudes;

/*Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;*/

