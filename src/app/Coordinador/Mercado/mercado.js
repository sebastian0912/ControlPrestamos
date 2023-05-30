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
const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');
const numeroDias = document.querySelector('#diasRestantes');


const mercado = document.querySelector('#mercado');
const prestamo = document.querySelector('#prestamo');

/*Calculo cuantos dias faltan*/
const dias = new Date().getDate();
if (dias == 13 || dias == 14 || dias == 28 || dias == 29) {
    numeroDias.innerHTML = "0";
}
else if (dias < 13 || dias > 14) {
    numeroDias.innerHTML = 14 - dias;
}

const numemoroM = document.querySelector('#valor');
numemoroM.addEventListener('keyup', (e) => {
    var num = numemoroM.value.replace(/\,/g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/, '');
        numemoroM.value = num;
    } else {
        alert('Solo se permiten números');
        numemoroM.value = numemoroM.value.replace(/[^\d\,]*/g, '');
    }
});

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
});

numeroSolicitudesPendientes.innerHTML = auxSolicitudes;*/

/*Captura nombre y perfil*/
/* 
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;
*/

async function escribirCodigo(data, cedulaEmpleado, nuevovalor, valor) {
    const docCoordinador = doc(db, "Codigos", idUsuario);
    const coordninador = await getDoc(docCoordinador);

    if (coordninador.exists()) {
        // generar un codigo aleatorio para el prestamo
        data.codigo = Math.floor(Math.random() * 1000000);
        data.codigo = 'M' + data.codigo;
        data.uid = idUsuario;
        data.monto = nuevovalor;
        data.cuotas = 2;
        data.cedulaQuienPide = cedulaEmpleado;
        // Actualizar en la base de datos
        await updateDoc(doc(db, "Codigos", idUsuario), {
            prestamos: arrayUnion(data)
        });
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
    }
    else {
        data.codigo = Math.floor(Math.random() * 1000000);
        data.codigo = 'M' + data.codigo;
        data.uid = idUsuario;
        data.monto = nuevovalor;
        data.cuotas = 2;
        data.cedulaQuienPide = cedulaEmpleado;
        await setDoc(docCoordinador, {
            prestamos: [data]
        });
        //await setDoc(doc(db, "Codigos", idUsuario), data);
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
    }
}


// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');

    e.preventDefault();
    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;
    const docRef = doc(db, "Base", cedulaEmpleado);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

    // datos.ingreso tiene el formato dd-mm-aa usar split para separarlos
    const fechaIngreso = datos.ingreso;
    let dia = fechaIngreso.split('-')[0];
    let mes = fechaIngreso.split('-')[1];
    let anio = fechaIngreso.split('-')[2];

    // el año esta en formato xxaa y se debe convertir a 20aa
    let anioConvertido = '20' + anio;
    anio = anioConvertido;

    const sumaTotal =
        parseInt(datos.saldos) +
        parseInt(datos.fondos) +
        parseInt(datos.mercados) +
        parseInt(datos.prestamoPaDescontar) +
        parseInt(datos.casino) +
        parseInt(datos.anchetas) +
        parseInt(datos.fondo) +
        parseInt(datos.carnet) +
        parseInt(datos.seguroFunerario) +
        parseInt(datos.prestamoPaHacer) +
        parseInt(datos.anticipoLiquidacion) +
        parseInt(datos.cuentas);

    const fechaActual = new Date();

    if (fechaActual.getDate() == 13 || fechaActual.getDate() == 14 || fechaActual.getDate() == 28 /*|| fechaActual.getDate() == 29*/) {
        aviso('¡ Ups no se pueden generar prestamos porque son el 13, 14, 28, 29 son dias bloqueados !', 'error');
    }
    else {
        if (datos.saldos >= 175000) {
            aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        }
        else {
            // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado   
            let diaActual = fechaActual.getDate();
            let mesActual = fechaActual.getMonth() + 1;
            let anioActual = fechaActual.getFullYear();
            let fechaInicio = new Date(anio, mes, dia); // Asume que 'anio', 'mes', 'dia' representan la fecha de inicio del trabajador
            let fechaActualCompara = new Date(anioActual, mesActual, diaActual); // Asume que 'anioActual', 'mesActual', 'diaActual' representan la fecha actual
            let diferencia = Math.abs(fechaActualCompara - fechaInicio); // Diferencia en milisegundos
            let diasTrabajados = Math.ceil(diferencia / (1000 * 60 * 60 * 24)); // Conversión de milisegundos a días

            // Si ha trabajado entre 8 y 15 dias puede pedir prestamo de 150.000
            if ((diasTrabajados > 8 && diasTrabajados < 15) && nuevovalor <= 150000) {
                if ((sumaTotal + parseInt(nuevovalor) <= 150000) || parseInt(nuevovalor) <= 150000) {
                    let data = codigo;
                    escribirCodigo(data, cedulaEmpleado, nuevovalor, valor);
                }
                else {
                    aviso('Ups no se pueden generar prestamos porque superas los 150000 de saldo permitido', 'error');
                }
            }

            // Si ha trabajado entre 15 y 30 dias puede pedir prestamo de 250.000
            else if ((diasTrabajados > 15 && diasTrabajados < 30) && nuevovalor <= 250000) {
                if ((sumaTotal + parseInt(nuevovalor) <= 250000) || parseInt(nuevovalor) <= 250000) {
                    if ((sumaTotal + parseInt(nuevovalor) <= 150000) || parseInt(nuevovalor) <= 150000) {
                        let data = codigo;
                        escribirCodigo(data, cedulaEmpleado, nuevovalor, valor);
                    }
                }
                else {
                    aviso('Ups no se pueden generar prestamos porque superas los 250000 de saldo permitido', 'error');
                }
            }

            // Si ha trabajado mas de 30 dias puede pedir prestamo de 350.000
            else if ((diasTrabajados > 30) && nuevovalor <= 350000) {
                if ((sumaTotal + parseInt(nuevovalor) <= 350000) || parseInt(nuevovalor) <= 350000) {
                    if ((sumaTotal + parseInt(nuevovalor) <= 350000) || parseInt(nuevovalor) <= 350000) {
                        let data = codigo;
                        escribirCodigo(data, cedulaEmpleado, nuevovalor, valor);
                    }
                }
                else {
                    aviso('Ups no se pueden generar prestamos porque superas los 350000 de saldo permitido', 'error');
                }
            }
        }
    }
}
);

/*   
    const nombre = document.querySelector('#nombre');
    const cedula = document.querySelector('#cedulaM');
    const mercado = document.querySelector('#mercado');
    const prestamo = document.querySelector('#prestamo');
    const casino = document.querySelector('#casino');
    const ancheta = document.querySelector('#ancheta');
    const fondo = document.querySelector('#fondo');
    const carnet = document.querySelector('#carnet');
    const seguro = document.querySelector('#seguro');
    const saldos = document.querySelector('#saldos');


    nombre.innerHTML = datos.nombre;
    cedula.innerHTML = datos.cedula;
    saldos.innerHTML = datos.saldos;
    mercado.innerHTML = datos.mercados;
    prestamo.innerHTML = datos.prestamoPaDescontar;
    casino.innerHTML = datos.casino;
    ancheta.innerHTML = datos.anchetas;
    fondo.innerHTML = datos.fondo;
    carnet.innerHTML = datos.carnet;
    seguro.innerHTML = datos.seguroFunerario;

*/