

import { comercio } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const datosComercializadoraGeneral = localStorage.getItem("datosComercializadoraGeneral");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

/*Calculo cuantos dias faltan*/
// Obtén la fecha actual

var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 27) {
    dia = 0;
    diasRestantes.style.color = "red";
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
diasRestantes.innerHTML = dias;


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

const datosHistorial = await getDocs(collection(db, "HistorialModificaciones"));
let datos
datosHistorial.forEach((doc) => {
    const datos = doc.data().historia;
    datos.forEach((doc2) => {
    tabla.innerHTML += `
        <tr>
            <td>${doc2.codigo}</td>
            <td>${doc2.concepto}</td>
            <td>${doc2.fechaEfectuado}</td>
            <td>${doc2.username}</td>
        </tr>
    `
    })
})


extraeT.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Tienda"));
    
    let dataString = 'nombre\tMonto Total\t Numero de compras en la tienda\n';
    
    querySnapshot.forEach((doc) => {
        const docData = doc.data();        
        dataString += 
        docData.nombre + '\t' +
        docData.valorTotal + '\t' +
        docData.numPersonasAtendidas + '\n';        
    });

    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datosTienda.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});

extrae.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Historial"));    
    let historial = [];
    querySnapshot.forEach(doc => {
        const cod = doc.data();
        const historia = cod.historia;

        historia.forEach(p => {
            if (p.concepto.startsWith("Compra")) {
                historial.push(p);
            }
        });
    });

    let dataString = 'Cedula\tconcepto\tcuotas\fechaEfectuado\tnombreQuienEntrego\tvalor\n';
    historial.forEach((doc) => {
        dataString +=
            doc.cedula + '\t' +
            doc.concepto + '\t' +
            doc.cuotas + '\t' +
            doc.fechaEfectuado + '\t' +
            doc.nombreQuienEntrego + '\t' +
            doc.valor + '\n';
    }
    );
    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datosHistorialDetallado.txt');
    
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});