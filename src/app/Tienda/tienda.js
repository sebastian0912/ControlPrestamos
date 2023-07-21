
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, onSnapshot, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";
import { codigo, historial, tienda } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";


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

/*Convertir valor a separado por miles*/
const numemoroM = document.querySelector('#valor');
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


if (usernameLocal == "Carmen") {
    lola.style.display = "inline-block";
}
else {
    lola.style.display = "none";
}


function verificarCedula(codigoP, cedulaEmpleado, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.codigo == codigoP) {
                if (p.cedulaQuienPide == cedulaEmpleado) {
                    encontrado = true;
                }
            }
        });
    });
    return encontrado;
}

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

function verificarCodigoEstado(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.codigo == codigo && p.estado == true) {
                encontrado = true;
            }
        });
    });
    return encontrado;
}

function verificaMonto(monto, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (parseInt(p.monto) >= monto) {
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

function verificaSiesUnPrestamo(codigo) {
    if (!codigo.startsWith("P")) {
        return true;
    }
    else {
        return false;
    }
}

function verificaCondiciones(datos, nuevovalor) {
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

    if (parseInt(datos.saldos) >= 175000) {
        aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        return false;
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
        if ((diasTrabajados > 8 && diasTrabajados < 15)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 150000)) {
                aviso('Ups no se pueden generar mercado, puede sacar maximo ' + (150000 - (sumaTotal)), 'error');
                return false;
            }
            else {
                return true;
            }

        }

        // Si ha trabajado entre 15 y 30 dias puede pedir prestamo de 250.000
        else if ((diasTrabajados > 15 && diasTrabajados < 30)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 250000)) {
                aviso('Ups no se pueden generar mercado, puede sacar maximo ' + (250000 - (sumaTotal)), 'error');
                return false;
            }
            else {
                return true;
            }
        }

        // Si ha trabajado mas de 30 dias puede pedir prestamo de 350.000
        else if ((diasTrabajados > 30)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 350000)) {
                aviso('Ups no se pueden generar mercado, puede sacar maximo ' + (350000 - (sumaTotal)), 'error');
                return false;
            }
            else {
                return true;
            }
        }
    }
}


boton.addEventListener('click', async (e) => {
    e.preventDefault();

    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;
    const codigoP = document.querySelector('#codigo').value;
    const valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');

    let encontrado = false;
    let concepto;

    if (codigoP == '') {
        aviso('El campo codigo no puede estar vacio', 'error');
    }
    else {
        const datos = await getDocs(collection(db, "Codigos"));
        const datosUsuario = await getDoc(doc(db, "Base", cedulaEmpleado));
        let todas = false;
        if (!verificarCodigo(codigoP, datos)) {
            aviso('El codigo no existe', 'error');
            return;
        }
        if (!verificarCodigoEstado(codigoP, datos)) {
            aviso('El codigo ya fue usado', 'error');
            return
        }
        if (!verificarCedula(codigoP, cedulaEmpleado, datos)) {
            aviso('El codigo no pertenece a este empleado', 'error');
            return;
        }
        if (!verificaMonto(parseInt(nuevovalor), datos)) {
            aviso('El monto del prestamo es mayor al permitido generado por el coodinador', 'error');
            return;
        }

        if (!verificaCondiciones(datosUsuario.data(), parseInt(nuevovalor))) {
            return;
        }


        else {
            const cod = obtenerCodigo(codigoP, datos);
            concepto = 'Compra tienda de ' + usernameLocal;
            encontrado = true;

            if (datosUsuario.data().cuotasMercados != "0" && datosUsuario.data().cuotasMercados != "" || parseInt(datosUsuario.data().cuotasMercados) > 0) {
                await updateDoc(doc(db, "Base", cedulaEmpleado), {
                    mercados: parseInt(datosUsuario.data().mercados) + parseInt(nuevovalor),
                });
            }
            else {
                await updateDoc(doc(db, "Base", cedulaEmpleado), {
                    mercados: parseInt(datosUsuario.data().mercados) + parseInt(nuevovalor),
                    cuotasMercados: parseInt(cuotas)
                });
            }

            // modificar la variable estado dentro del arreglo y subir cambios a firebase
            cod.estado = false;
            cod.fechaEjecutado = new Date().toLocaleDateString()
            cod.ejecutadoPor = usernameLocal;
            // generar codigo solo numeros aleatorios
            cod.codigoDescontado = 'MOH' + Math.floor(Math.random() * (999999 - 100000)) + 100000;


            await setDoc(doc(db, "Codigos", cod.uid), {
                prestamos: arrayUnion(cod)
            });

            // crear un nuevo registro en la coleccion historial
            const docEmpleado = doc(db, "Historial", cedulaEmpleado);
            const empleadoRef = await getDoc(docEmpleado);
            let data = historial;
            if (empleadoRef.exists()) {
                data.cedula = cedulaEmpleado;
                data.concepto = concepto;
                data.fechaEfectuado = new Date().toLocaleDateString()
                data.valor = nuevovalor;
                data.cuotas = cod.cuotas;
                data.nombreQuienEntrego = usernameLocal;
                data.timesStamp = new Date().getTime();
                await updateDoc(doc(db, "Historial", cedulaEmpleado), {
                    historia: arrayUnion(data)
                });
            }
            else {
                data.cedula = cedulaEmpleado;
                data.concepto = concepto;
                data.fechaEfectuado = new Date().toLocaleDateString()
                data.valor = nuevovalor;
                data.cuotas = cod.cuotas;
                data.nombreQuienEntrego = usernameLocal;
                data.timesStamp = new Date().getTime();
                await setDoc(docEmpleado, {
                    historia: [data]
                });
            }

            const docTienda = doc(db, "Tienda", idUsuario);
            // datos de la tienda
            const tiendaRef = await getDoc(docTienda);
            if (!tiendaRef.exists()) {
                await setDoc(docTienda, {
                    nombre: usernameLocal,
                    codigo: idUsuario,
                    valorTotal: parseInt(nuevovalor),
                    numPersonasAtendidas: 1,
                });
            } else {
                await updateDoc(doc(db, "Tienda", idUsuario), {
                    nombre: usernameLocal,
                    codigo: idUsuario,
                    valorTotal: parseInt(tiendaRef.data().valorTotal) + parseInt(nuevovalor),
                    numPersonasAtendidas: parseInt(tiendaRef.data().numPersonasAtendidas) + 1,
                });
            }
            aviso('Acaba de pedir un prestamo de ' + valor, 'success');
        }
    }
});


