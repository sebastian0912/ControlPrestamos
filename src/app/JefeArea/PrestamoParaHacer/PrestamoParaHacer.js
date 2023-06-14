

import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const idUsuario = localStorage.getItem("idUsuario");

// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
//Muestra en la parte superior el nombre y el perfil
username.innerHTML = usernameLocal;
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
        if (dias2 == 0){
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
        numemoroM.value = numemoroM.value.replace(/[^\d\,]*/g, '');
    }
});

async function escribirCodigo(data, cedulaEmpleado, nuevovalor, valor, cuotas) {
    const docCoordinador = doc(db, "Codigos", idUsuario);
    const coordninador = await getDoc(docCoordinador);
    

    if (coordninador.exists()) {
        // generar un codigo aleatorio para el prestamo        
        data.codigo = 'PH' + Math.floor(Math.random() * 1000000);      
        data.monto = nuevovalor;
        data.uid = idUsuario;
        data.cuotas = cuotas;
        data.cedulaQuienPide = cedulaEmpleado;
        data.fechaGenerado = new Date().toLocaleDateString()
        data.generadoPor = usernameLocal;
        // Actualizar en la base de datos
        await updateDoc(doc(db, "Codigos", idUsuario), {
            prestamos: arrayUnion(data)
        });
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
    }
    else {
        data.codigo = Math.floor(Math.random() * 1000000);
        data.codigo = 'PH' + data.codigo;
        data.uid = idUsuario;
        data.monto = nuevovalor;
        data.cuotas = cuotas;
        data.cedulaQuienPide = cedulaEmpleado;
        data.fechaGenerado = new Date().toLocaleDateString()
        data.generadoPor = usernameLocal;

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
    const cuotas = document.querySelector('#cuotas').value;

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

    if (parseInt(datos.saldos) >= 175000) {
        aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
    }
    else if (parseInt(datos.fondos) > 0) {
        aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
    }
    else {
        // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado            
        let mesActual = fechaActual.getMonth() + 1;
        let anioActual = fechaActual.getFullYear();
        if ((anioActual == anio) && ((mesActual - mes) >= 2)) {
            if (sumaTotal >= 350001 || (sumaTotal + parseInt(nuevovalor)) >= 350001) {
                aviso('Ups no se pueden generar prestamos porque superas los 350.000 permitidos', 'error');
            }
            else if (parseInt(nuevovalor) >= 200001) {
                aviso('Ups no se pueden generar el prestamo que superas los 200.000', 'error');
            }
            else {
                let data = codigo;
                escribirCodigo(data, cedulaEmpleado, nuevovalor, valor, cuotas);
            }
        }
        else if ((anioActual > anio)) {
            if (sumaTotal >= 350000 || (sumaTotal + parseInt(nuevovalor)) >= 350000) {
                aviso('Ups no se pueden generar prestamos porque superas los 350.000 permitidos', 'error');
            }
            else if (parseInt(nuevovalor) >= 200001) {
                aviso('Ups no se pueden generar el prestamo que superas los 200.000', 'error');
            }
            else {
                let data = codigo;
                escribirCodigo(data, cedulaEmpleado, nuevovalor, valor, cuotas);
            }
        }
    }

});
