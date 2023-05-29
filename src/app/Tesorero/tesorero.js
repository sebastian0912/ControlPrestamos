
import { doc, getDoc, getDocs, setDoc, updateDoc , collection } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";
import { datosbase } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";

const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');
const numeroDias = document.querySelector('#diasRestantes');


const ingresar = document.querySelector('#ingresar');
let input = document.getElementById('archivoInput');

let datosFinales = [];
const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');
var h1Elemento = document.querySelector('#cont');


input.addEventListener('change', () => {
    let archivo = input.files[0];
    let reader = new FileReader();
    //var h1Elemento = document.getElementById("cont");

    /* leer archivo .csv */
    reader.readAsText(archivo);
    reader.onload = () => {
        let info = reader.result;
        /*separado split por tabulaciones*/
        let datos = info.split('\n');

        datos.forEach(dato => {
            datosFinales.push(dato.split('\t'));
        });
        over.style.display = "block";
        loader.style.display = "block";
        h1Elemento.style.display = "block";
        guardarDatos(datosFinales);

        //aviso("Datos guardados correctamente", "success");

    }
});

async function guardarDatos(datosFinales) {
    //console.log("entro a la funcion");
    //console.log(datosFinales.length);
    console.log(datosFinales.length - 1);
    for (let i = 4; i < datosFinales.length - 1; i++) {
        let datos = datosFinales[i]; // Dividir la cadena por las tabulaciones
        console.log(i - 3);
        datosbase.codigo = datos[0];
        datosbase.cedula = datos[1];
        datosbase.nombre = datos[2];
        datosbase.ingreso = datos[3];
        datosbase.temporal = datos[4];
        datosbase.finca = datos[5];
        datosbase.salario = datos[6];
        datosbase.saldos = datos[7];
        datosbase.fondos = datos[8];
        datosbase.mercados = datos[9];
        datosbase.cuotasMercados = datos[10];
        datosbase.prestamoPaDescontar = datos[11];
        datosbase.cuotasPrestamos = datos[12];
        datosbase.casino = datos[13];
        datosbase.anchetas = datos[14];
        datosbase.cuotasAnchetas = datos[15];
        datosbase.fondo = datos[16];
        datosbase.carnet = datos[17];
        datosbase.seguroFunerario = datos[18];
        datosbase.prestamoPaHacer = datos[19];
        datosbase.cuotasPrestamoPahacer = datos[20];
        datosbase.anticipoLiquidacion = datos[21];
        datosbase.cuentas = datos[22];
        (function (indice) {
            setTimeout(function () {
                h1Elemento.textContent = "Empleados cargados: " + indice - 3;
            }, indice * 1);
        })(i);
        const aux = await setDoc(doc(db, "Base", datosbase.cedula), datosbase);
    }
    aviso("Datos guardados correctamente", "success");
    over.style.display = "none";
    loader.style.display = "none";
    h1Elemento.style.display = "none";

}

/*Inabilitar permisos*/
document.getElementById("myonoffswitch").addEventListener("click", async function(event) {
    const querySnapshot2 = await getDocs(collection(db, "Usuarios"));

    if (this.checked) {
        querySnapshot2.forEach(async (cod) => {
            const docRef = doc(db, "Usuarios", cod.id);
            const docSnap = await getDoc(docRef);  
            if (docSnap.data().perfil == 'JefeArea' || docSnap.data().perfil == 'Coordinador' || docSnap.data().perfil == 'Tienda') {
                await updateDoc(doc(db, "Usuarios", cod.id), {
                    estadoQuincena: true
                });
                aviso('Se ha habilitado el acceso a la modificaciones de jefes de area, tiendas y coordinadores', 'success');
            }            
        });
    } else {
        querySnapshot2.forEach(async (cod) => {
            const docRef = doc(db, "Usuarios", cod.id);
            const docSnap = await getDoc(docRef);  
            if (docSnap.data().perfil == 'JefeArea' || docSnap.data().perfil == 'Coordinador' || docSnap.data().perfil == 'Tienda') {
                await updateDoc(doc(db, "Usuarios", cod.id), {
                    estadoQuincena: false
                });
                aviso('Se ha deshabilitado el acceso a la modificaciones de jefes de area, tiendas y coordinadores', 'success');
            }            
        });
    }
});


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


/*Obtener el numero de solicitudes sin realizar*/
/*
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
});*/

/*
numeroSolicitudesPendientes.innerHTML = auxSolicitudes;

/*Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;*/






