
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";
import { codigo } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";

const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
// capturar el id del usuario logeado del input

const boton = document.querySelector('#boton');

const valor = document.querySelector('#valor');
const cuotas = document.querySelector('#cuotas');

// darle click al boton para que se ejecute la funcion

boton.addEventListener('click', async (e) => {
    e.preventDefault();
    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;   
    const docRef = doc(db, "Base", cedulaEmpleado);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

    if (datos.saldos == " - ") {
        datos.saldos = 0;
    }

    if (datos.fondos == " - ") {
        datos.fondos = 0;
    }

    if (datos.mercados == " - ") {
        datos.mercados = 0;
    }

    if (datos.prestamoPaDescontar == " - ") {
        datos.prestamoPaDescontar = 0;
    }

    if (datos.casino == " - ") {
        datos.casino = 0;
    }

    if (datos.anchetas == " - ") {
        datos.anchetas = 0;
    }

    if (datos.fondo == " - ") {
        datos.fondo = 0;
    }

    if (datos.carnet == " - ") {
        datos.carnet = 0;
    }

    if (datos.seguroFunerario == " - ") {
        datos.seguroFunerario = 0;
    }

    if (datos.prestamoPaHacer == " - ") {
        datos.prestamoPaHacer = 0;
    }

    if (datos.anticipoLiquidacion == " - ") {
        datos.anticipoLiquidacion = 0;
    }

    if (datos.cuentas == " - ") {
        datos.cuentas = 0;
    }

    if (datos.cuotasAnticipoLiquidacion == " - ") {
        datos.cuotasAnticipoLiquidacion = 0;
    }

    if (datos.cuotasCasino == " - ") {
        datos.cuotasCasino = 0;
    }

    if (datos.cuotasPrestamos == " - ") {
        datos.cuotasPrestamos = 0;
    }

    if (datos.cuotasfondo == " - ") {
        datos.cuotasfondo = 0;
    }

    const sumaTotal =
        datos.saldos +
        datos.fondos +
        datos.mercados +
        datos.prestamoPaDescontar +
        datos.casino +
        datos.anchetas +
        datos.fondo +
        datos.carnet +
        datos.seguroFunerario +
        datos.prestamoPaHacer +
        datos.anticipoLiquidacion +
        datos.cuentas;

    if (sumaTotal > 350000){
        aviso('Ups no se pueden generar prestamos has pasado tu tope', 'error');
    }

    else if (sumaTotal <= 150000){        
        // generar un codigo aleatorio para el prestamo
        let data = codigo;
        data.codigo = Math.floor(Math.random() * 1000000000);
        data.uid = idUsuario;
        await setDoc(doc(db, "Codigos", idUsuario), data);    
        aviso('Puede pedir un prestamo de maximo de 200.000 su codigo es: ' + data.codigo , 'success');   
        /*valor.style.display = 'block';
        cuotas.style.display = 'block';*/
    }



});


const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);
// capturar username
const username = docSnap.data().username;

titulo.innerHTML = " ¡ BIENVENIDO " + username + " ! ";

