
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
    const cedulaEmpleado = document.querySelector('#cedula').value;
    const docRef = doc(db, "Base", cedulaEmpleado);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

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

    // datos.ingreso tiene el formato dd-mm-aa usar split para separarlos
    const fechaIngreso = datos.ingreso;
    let dia = fechaIngreso.split('-')[0];
    let mes = fechaIngreso.split('-')[1];
    let anio = fechaIngreso.split('-')[2];

    // el año esta en formato xxaa y se debe convertir a 20aa
    let anioConvertido = '20' + anio;
    anio = anioConvertido;

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

    //console.log(datos.fondos);


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

    //console.log(datos.fondos);
    if (sumaTotal >= 350000) {
        aviso('Ups no se pueden generar prestamos porque superas los 350.000 permitidos', 'error');
    }
    else {
        if (datos.fondos > 0) {
            aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
        }
        else {
            // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado
            const fechaActual = new Date();
            let diaActual = fechaActual.getDate();
            let mesActual = fechaActual.getMonth() + 1;
            let anioActual = fechaActual.getFullYear();

            // si trabajo mas de 2 meses en adelante puede pedir prestamo

            if (anioActual == anio) {
                if (datos.saldos >= 100000 && ((mesActual - mes) <= 2)) {
                    aviso('¡Ups no puede tener el prestamo porque no tiene mas de 2 meses!', 'error');
                }
                else {
                    if ((Math.abs(sumaTotal + parseInt(valor.value))) > 350000) {
                        aviso('¡Ups no puede tener el prestamo digite un monto menor, su monto maximo a solicitar es: ! ' + Math.abs((sumaTotal - 350000)), 'error');
                    }
                    else {
                        if (mesActual - mes >= 2) {
                            const docCoordinador = doc(db, "Codigos", idUsuario);
                            const coordninador = await getDoc(docCoordinador);
                            let data = codigo;
                            if (coordninador.exists()) {
                                // generar un codigo aleatorio para el prestamo
                                data.codigo = Math.floor(Math.random() * 1000000);
                                data.uid = idUsuario;
                                data.monto = valor;
                                data.cuotas = cuotas;
                                console.log(datos.cedula);

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
                                data.uid = idUsuario;
                                data.monto = valor;
                                data.cuotas = cuotas;
                                await setDoc(docCoordinador, {
                                    prestamos: [data]
                                });
                                //await setDoc(doc(db, "Codigos", idUsuario), data);
                                aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
                            }
                        }
                        else {
                            aviso('¡Ups no puede tener el prestamo porque no tiene mas de 2 meses!', 'error');
                        }
                    }
                }
            }
            else {
                let data = codigo;
                data.codigo = Math.floor(Math.random() * 1000000);
                data.uid = idUsuario;
                data.monto = valor;
                data.cuotas = cuotas;
                //await setDoc(doc(db, "Codigos", idUsuario), data);
                await updateDoc(doc(db, "Codigos", idUsuario), {
                    prestamos: arrayUnion(data)
                });
                aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
            }
        }


    }

});