
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');
const idUsuario = localStorage.getItem("idUsuario");


// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const valor = document.querySelector('#valor').value;
    const cuotas = document.querySelector('#cuotas').value;

    e.preventDefault();
    // capturar los datos del formulario
    
    
    
    /*if (datos.saldos == " - ") {
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
    }*/

    const docGerencia = doc(db, "Codigos", idUsuario);
    const gerencia = await getDoc(docGerencia);
    let data = codigo;
    if (gerencia.exists()) {
        // generar un codigo aleatorio para el prestamo
        data.codigo = Math.floor(Math.random() * 1000000);
        data.uid = idUsuario;
        data.monto = valor;
        data.cuotas = cuotas;
        data.perfil = "Gerencia";


        await updateDoc(doc(db, "Codigos", idUsuario), {
            prestamos: arrayUnion(data)
        });

        // actualizar los datos del empleado en el firebase
        /*await updateDoc(doc(db, "Base", datos.cedula), {                                   
            cuotasPrestamos: parseInt(cuotas),
            prestamoPaDescontar: parseInt(valor)
        });*/

        datos.cuotasPrestamos = parseInt(cuotas);
        datos.prestamoPaDescontar = parseInt(valor);
        console.log(datos);
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
    }
    else {
        data.codigo = Math.floor(Math.random() * 1000000);
        data.codigo = 'G'+ data.codigo;
        data.uid = idUsuario;
        data.monto = valor;
        data.cuotas = cuotas;
        data.perfil = "Gerencia";

        await setDoc(docGerencia, {
            prestamos: [data]
        });
        //await setDoc(doc(db, "Codigos", idUsuario), data);
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
    }

}
);

