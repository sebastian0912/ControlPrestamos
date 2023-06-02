
import { doc, getDoc, getDocs, setDoc, updateDoc, collection } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
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
let extrae = document.getElementById("extrae");
let extraeT = document.getElementById("extraeT");

const ingresar = document.querySelector('#ingresar');
let input = document.getElementById('archivoInput');

let datosFinales = [];
const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');
var h1Elemento = document.querySelector('#cont');


extrae.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Base"));
    
    let dataString = '\t\t\t\t\t\t\tANTERIOR\t\tPARA DESCONTAR\t\t\t\t\t\t\t\t\t\tPARA HACER\t\t\t\nCÓDIGO\tCÉDULA\tNOMBRE\tINGRESO\tTEMPORAL\tFINCA\tSALARIO\tSALDOS\tFONDOS\tMERCADOS\tCUOTAS\tPRESTAMO\tCUOTAS\tCASINO\tANCHETAS\tCUOTAS\tFONDO\tCARNET\tSEGURO FUNERARIO\tPRESTAMO\tCUOTAS\tANTICIPO LIQ\tCUENTAS\n';
    
    querySnapshot.forEach((doc) => {
        const docData = doc.data();        
        dataString += 
        docData.codigo + '\t' +
        docData.cedula + '\t' +
        docData.nombre + '\t' +
        docData.ingreso + '\t' +
        docData.temporal + '\t' +
        docData.finca + '\t' +
        docData.salario + '\t' +
        docData.saldos + '\t' +
        docData.fondos + '\t' +
        docData.mercados + '\t' +
        docData.cuotasMercados + '\t' +
        docData.prestamoPaDescontar + '\t' +
        docData.cuotasPrestamos + '\t' +
        docData.casino + '\t' +
        docData.anchetas + '\t' +
        docData.cuotasAnchetas + '\t' +
        docData.fondo + '\t' +
        docData.carnet + '\t' +
        docData.seguroFunerario + '\t' +
        docData.prestamoPaHacer + '\t' +
        docData.cuotasPrestamoPahacer + '\t' +
        docData.anticipoLiquidacion + '\t' +
        docData.cuentas + '\n' ;        
    });

    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datos.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});


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


input.addEventListener('change', () => {
    let archivo = input.files[0];
    let reader = new FileReader();
    var h1Elemento = document.getElementById("cont");

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
        over.style.display = "none";
        loader.style.display = "none";
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
                h1Elemento.textContent = "Empleados cargados: " + indice;
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
document.getElementById("myonoffswitch").addEventListener("click", async function (event) {
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
/*si el dia es 13 o 14 o 28 o 29 colocar numeroDias.innerHtml en rojo*/

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    numeroDias.style.color = "red";
    numeroDias.innerHTML = dias;
}
else {
    numeroDias.innerHTML = dias;
}

/* obtener el numero de empleados y actulizar con onsnapshot*/

const querySnapshot = await getDocs(collection(db, "Base"));
numeroTotal.innerHTML = querySnapshot.size;


/*Obtener el numero de solicitudes sin realizar*/

const querySnapshot2 = await getDocs(collection(db, "Codigos"));
let auxSolicitudes = 0;
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

/*Captura nombre y perfil*/
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;






