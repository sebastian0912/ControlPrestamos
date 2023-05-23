
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');
const idUsuario = localStorage.getItem("idUsuario");
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
    /*
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
        }*/

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

    if (datos.fondos > 0) {
        aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
    }
    else {
        // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado
        const fechaActual = new Date();
        let diaActual = fechaActual.getDate();
        let mesActual = fechaActual.getMonth() + 1;
        let anioActual = fechaActual.getFullYear();

        if (datos.mercados > 0 ||
            datos.prestamoPaDescontar > 0 ||
            datos.casino > 0 ||
            datos.anchetas > 0 ||
            datos.fondo > 0 ||
            datos.carnet > 0 ||
            datos.seguroFunerario > 0 ||
            datos.saldos > 0) {
            aviso('¡Ups no se puede realizar un mercado porque tiene saldos a descontar!', 'error');
        }
        else {

            if (anioActual == anio) {
                if (parseInt(datos.saldos) >= 100000 && ((mesActual - mes) <= 2)) {
                    aviso('¡Ups no puede tener el prestamo porque no tiene mas de 2 meses!', 'error');
                }
                else {
                    if ((mesActual == mes) && (diaActual - dia <= 15)) {
                        const docRef = doc(db, "Codigos", idUsuario);
                        const coordninador = await getDoc(docRef);
                        let data = codigo;
                        if (coordninador.exists()) {
                            // generar un codigo aleatorio para el prestamo                        
                            data.codigo = Math.floor(Math.random() * 1000000);
                            data.uid = idUsuario;
                            codigo.cuotas = 2;
                            codigo.monto = 60000;
                            //await setDoc(doc(db, "Codigos", idUsuario), data);
                            await updateDoc(doc(db, "Codigos", idUsuario), {
                                prestamos: arrayUnion(data)
                            });
                            aviso('Puede pedir un prestamo de maximo de 60.000 su codigo es: ' + data.codigo, 'success');                        /*valor.style.display = 'block';
                            cuotas.style.display = 'block';*/
                        }
                        else {
                            data.codigo = Math.floor(Math.random() * 1000000);
                            data.uid = idUsuario;
                            codigo.cuotas = 2;
                            codigo.monto = 60000;
                            await setDoc(docRef, {
                                prestamos: [data]
                            });
                            //await setDoc(doc(db, "Codigos", idUsuario), data);
                            aviso('Puede pedir un prestamo de maximo de 60.000 su codigo es: ' + data.codigo, 'success');
                        }
                    }
                    else if (mesActual == mes && ((diaActual - dia) >= 15 && (diaActual - dia) <= 30)) {
                        const docRef = doc(db, "Codigos", idUsuario);
                        const coordninador = await getDoc(docRef);
                        let data = codigo;
                        if (coordninador.exists()) {
                            // generar un codigo aleatorio para el prestamo                        
                            data.codigo = Math.floor(Math.random() * 1000000);
                            data.uid = idUsuario;
                            codigo.cuotas = 2;
                            codigo.monto = 135000;
                            //await setDoc(doc(db, "Codigos", idUsuario), data);
                            await updateDoc(doc(db, "Codigos", idUsuario), {
                                prestamos: arrayUnion(data)
                            });
                            aviso('Puede pedir un prestamo de maximo de 135.000 su codigo es: ' + data.codigo, 'success');                        /*valor.style.display = 'block';
                            cuotas.style.display = 'block';*/
                        }
                        else {
                            data.codigo = Math.floor(Math.random() * 1000000);
                            data.uid = idUsuario;
                            codigo.cuotas = 2;
                            codigo.monto = 135000;
                            await setDoc(docRef, {
                                prestamos: [data]
                            });
                            //await setDoc(doc(db, "Codigos", idUsuario), data);
                            aviso('Puede pedir un prestamo de maximo de 135.000 su codigo es: ' + data.codigo, 'success');
                        }
                    }
                    else if ((mesActual - mes >= 1) || ((mesActual > mes) && (diaActual - dia > 0))) {
                        const docRef = doc(db, "Codigos", idUsuario);
                        const coordninador = await getDoc(docRef);
                        let data = codigo;                        
                        if (coordninador.exists()) {
                            // generar un codigo aleatorio para el prestamo                        
                            data.codigo = Math.floor(Math.random() * 1000000);
                            data.uid = idUsuario;
                            codigo.cuotas = 2;
                            codigo.monto = 200000;

                            //await setDoc(doc(db, "Codigos", idUsuario), data);
                            await updateDoc(doc(db, "Codigos", idUsuario), {
                                prestamos: arrayUnion(data)
                            });
                            aviso('Puede pedir un prestamo de maximo de 200.000 su codigo es: ' + data.codigo, 'success');                        /*valor.style.display = 'block';
                            cuotas.style.display = 'block';*/
                        }
                        else {
                            data.codigo = Math.floor(Math.random() * 1000000);
                            data.uid = idUsuario;
                            codigo.cuotas = 2;
                            codigo.monto = 200000;

                            await setDoc(docRef, {
                                prestamos: [data]
                            });
                            //await setDoc(doc(db, "Codigos", idUsuario), data);
                            aviso('Puede pedir un prestamo de maximo de 200.000 su codigo es: ' + data.codigo, 'success');
                        }
                    }
                }
            }
            else {
                let data = codigo;
                data.codigo = Math.floor(Math.random() * 1000000);
                data.uid = idUsuario;
                codigo.cuotas = 2;
                codigo.monto = 200000;
                //await setDoc(doc(db, "Codigos", idUsuario), data);
                await updateDoc(doc(db, "Codigos", idUsuario), {
                    prestamos: arrayUnion(data)
                });
                aviso('Puede pedir un prestamo de maximo de 200.000 su codigo es: ' + data.codigo, 'success');
            }
        }
        // si trabajo mas de 2 meses en adelante puede pedir prestamo
    }
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
});