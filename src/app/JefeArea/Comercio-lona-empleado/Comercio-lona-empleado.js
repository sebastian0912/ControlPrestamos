
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
const sede = localStorage.getItem("sede");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

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
diasRestantes.innerHTML = dias;


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


// Mostar contenido en una tabla
const tabla = document.querySelector('#tabla');

const querySnapshot = await getDocs(collection(db, "Comercio"));

let datosComercializadoraGeneral = querySnapshot.docs.map(doc => doc.data());

datosComercializadoraGeneral.forEach((p) => {
    if (p.sede == sede) {
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
    }
});


function verificarCodigo(codigo, datos) {
    let encontrado = false;

    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;

        prestamos.forEach(p => {
            if (p.codigo == codigo) {
                encontrado = true;
            }
        });
    });
    return encontrado;
}

function obtenerCodigo(codigo, datos) {
    let cod;
    datos.forEach(doc => {
        const codigos = doc.data().prestamos;
        codigos.forEach(c => {
            if (c.codigo == codigo) {
                cod = c;
            }
        });
    });
    return cod;
}

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const cantidad = document.querySelector('#Cantidad').value;
    const cedula = document.querySelector('#cedula').value;
    const codigo = document.querySelector('#codigo').value;
    const codigoA = document.querySelector('#codigoA').value;
    const CodigosMercado = await getDocs(collection(db, "Codigos"));

    if (verificarCodigo(codigoA, CodigosMercado) == false) {
        const docRef = doc(db, "Comercio", codigo);
        const docSnap = await getDoc(docRef);
        const datos = docSnap.data();
        await updateDoc(doc(db, "Comercio", codigo), {
            cantidadTotalVendida: parseInt(datos.cantidadTotalVendida) + parseInt(cantidad),
        });

        const doocRef = doc(db, "Base", cedula);
        const doocSnap = await getDoc(doocRef);
        const datos2 = doocSnap.data();
        await updateDoc(doc(db, "Base", cedula), {
            mercados: parseInt(datos2.mercados),
            cuotasMercados: 2
        });
        aviso("Se ha cargado la informacion exitosamente", "success");
    }
    else {
        const cod = obtenerCodigo(codigoA, CodigosMercado);
        cod.estado = false;
        cod.fechaEjecutado = new Date().toLocaleDateString()
        cod.ejecutadoPor = usernameLocal;
        // generar codigo solo numeros aleatorios
        cod.codigoDescontado = 'MOH' + Math.floor(Math.random() * (999999 - 100000)) + 100000;
        await setDoc(doc(db, "Codigos", cod.uid), {
            prestamos: arrayUnion(cod)
        });
    }

});
