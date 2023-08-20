
import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";


const boton = document.querySelector('#boton');
// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
let extraeT = document.getElementById("extraeT");


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

// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 1;
var bandera = true;

if (ahora.getDate() == 13 || ahora.getDate() == 27) {
    dia = 0;
    diasRestantes.innerHTML = "0";
    diasRestantes.style.color = "red";
    bandera = false;
}
else if (ahora.getDate() < 13) {
    dia = 13;
}
else if (ahora.getDate() < 27) {
    dia = 27;
}
else {
    dia = 13;
    mes++; // Cambia al próximo mes
}
if (bandera) {
    // Crea la fecha objetivo
    var fechaObjetivo = new Date(anio, mes, dia);
    // Calcula la diferencia en milisegundos
    var diferencia = fechaObjetivo - ahora;
    // Convierte la diferencia en días
    var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    diasRestantes.innerHTML = dias;
}


var fechaObjetivo2 = ['2023-04-10', '2023-04-24', '2023-05-08', '2023-05-23', '2023-06-07', '2023-06-23', '2023-07-05', '2023-07-26', '2023-08-09', '2023-08-23', '2023-09-06', '2023-09-25', '2023-10-06', '2023-10-23', '2023-11-08', '2023-11-22', '2023-11-05', '2023-12-21', '2024-01-05'];

function obtenerFecha() {
    // Convertimos la fecha actual a un formato que coincida con las fechas del arreglo
    var fechaActualFormato = ahora.toISOString().slice(0, 10);

    var fechaSeleccionada = null;

    for (var i = 0; i < fechaObjetivo2.length; i++) {
        // Comparamos las fechas ignorando la información de la hora y el huso horario
        if (fechaActualFormato <= fechaObjetivo2[i]) {
            fechaSeleccionada = fechaObjetivo2[i];
            return fechaSeleccionada;
        }
    }
}

var diferencia2 = new Date(obtenerFecha()) - ahora;
var dias2 = Math.ceil(diferencia2 / (1000 * 60 * 60 * 24));

if (dias2 == 0) {
    diasLiqui.style.color = "red";
} else {
    diasLiqui.style.color = "black";
}
diasLiqui.innerHTML = dias2;


formaPago.addEventListener('change', (e) => {
    const numerodepago = document.querySelector('#celular');

    if (e.target.value == "Daviplata") {
        numerodepago.placeholder = "Número de Daviplata";
    }
    else if (e.target.value == "Master") {
        numerodepago.placeholder = "Número de tarjeta Master";
    }
    else if (e.target.value == "Efectivo") {
        numerodepago.placeholder = "";
    }
    else {
        numerodepago.placeholder = "Número de cuenta";
    }
});

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

function verificarCedula(codigoP, cedulaEmpleado, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigoP) {
            if (doc.cedulaQuienPide == cedulaEmpleado) {
                encontrado = true;
            }
        }
    });
    return encontrado;
}

function verificarCodigo(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            encontrado = true;
        }
    });
    return encontrado;
}

function verificarCodigoEstado(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigo && doc.estado == true) {
            encontrado = true;
        }
    });
    return encontrado;
}

function verificaMonto(monto, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (parseInt(doc.monto) >= monto) {
            encontrado = true;
        }
    });
    return encontrado;
}

function obtenerCodigo(codigo, datos) {
    let cod;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            cod = doc;
        }
    });
    return cod;
}

function verificaSiesUnPrestamo(codigo) {
    if (!codigo.startsWith("M")) {
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
        parseInt(datos.prestamoParaDescontar) +
        parseInt(datos.casino) +
        parseInt(datos.valoranchetas) +
        parseInt(datos.fondo) +
        parseInt(datos.carnet) +
        parseInt(datos.seguroFunerario) +
        parseInt(datos.prestamoParaHacer) +
        parseInt(datos.anticipoLiquidacion) +
        parseInt(datos.cuentas);

    const fechaActual = new Date();

    if (parseInt(datos.saldos) >= 175001) {
        aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        return false;
    }
    else if (parseInt(datos.fondos) > 0) {
        aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
        return false;
    }
    else {
        // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado            
        let mesActual = fechaActual.getMonth() + 1;
        let anioActual = fechaActual.getFullYear();
        if ((anioActual == anio) && ((mesActual - mes) >= 2)) {
            if (parseInt(nuevovalor) >= 200000) {
                aviso('Ups no se pueden generar el prestamo que superas los 200.000', 'error');
                return false;
            }
            else if ((sumaTotal + parseInt(nuevovalor)) >= 350000) {
                aviso('Ups no se pueden generar prestamos, puede sacar maximo ' + (350000 - (sumaTotal)), 'error');
                return false;
            }
            else {
                return true;
            }
        }
        else if ((anioActual > anio)) {
            if (parseInt(nuevovalor) >= 200000) {
                aviso('Ups no se pueden generar el prestamo que superas los 200.000', 'error');
                return false;
            }
            else if ((sumaTotal + parseInt(nuevovalor)) >= 350000) {
                aviso('Ups no se pueden generar prestamos, puede sacar maximo ' + (350000 - (sumaTotal)), 'error');
                return false;
            }
            else {
                return true;
            }
        }
    }
}

function verificaSelect(select) {
    let encontrado = false;
    if (select.value == '0') {
        aviso('Debe seleccionar una forma de pago', 'error');
        return false;
    }
    else {
        encontrado = true;
        return encontrado;
    }
}

async function datosTCodigos() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Codigo/codigos';

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

async function datosEmpleado(cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Datosbase/tesoreria/' + cedulaEmpleado;

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

async function actualizar(codigo, cod, username, monto2, cuotas) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Codigo/jefedearea/actualizarCodigo/' + cod;

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigoDescontado: codigo,
                    ejecutadoPor: username,
                    nuevomonto: monto2,
                    cuotas: cuotas,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }
}

async function actualizarDatosBase(concepto, valor, cuotas, cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Datosbase/jefedearea/actualizarprestamodescontar/' + cedulaEmpleado;
    if (concepto == 'Dinero_Autorizacion') {
        try {
            fetch(urlcompleta, {
                method: 'POST',
                body:
                    JSON.stringify({
                        concepto: concepto,
                        prestamoParaDescontar: valor,
                        cuotasPrestamosParaDescontar: cuotas,
                        jwt: jwtToken
                    })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                        //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                    } else {
                        throw new Error('Error en la petición POST');
                    }
                })
                .then(responseData => {
                    console.log('Respuesta:', responseData);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error en la petición HTTP POST');
            console.error(error);
        }
    }
    else if (concepto == 'Seguro_Funerario_Autorizacion') {

        try {
            fetch(urlcompleta, {
                method: 'POST',
                body:
                    JSON.stringify({
                        concepto: concepto,
                        seguroFunerario: valor,
                        jwt: jwtToken
                    })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                        //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                    } else {
                        throw new Error('Error en la petición POST');
                    }
                })
                .then(responseData => {
                    console.log('Respuesta:', responseData);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error en la petición HTTP POST');
            console.error(error);
        }
    }
    else if (concepto == 'Otro_Autorizacion') {
        console.log('con2' + concepto);
        // quitar espacios en blanco a concepto
        concepto = concepto.replace(/\s/g, '');
        try {
            fetch(urlcompleta, {
                method: 'POST',
                body:
                    JSON.stringify({
                        concepto: concepto,
                        anticipoLiquidacion: valor,
                        cuentas: cuotas,
                        jwt: jwtToken
                    })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                        //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                    } else {
                        throw new Error('Error en la petición POST');
                    }
                })
                .then(responseData => {
                    console.log('Respuesta:', responseData);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error en la petición HTTP POST');
            console.error(error);
        }
    }
}

async function datosT() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Tienda/traerTienda';

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

async function THistorial() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Historial/historial';

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

extraeT.addEventListener('click', async () => {
    const datosExtraidos = await datosT();

    console.log(datosExtraidos);

    let excelData = [['Nombre De la Tienda', 'Monto Total', 'Numero de compras en la tienda']];

    if (datosExtraidos.message == "error") {
        aviso("No se han comprado productos en las tiendas", "warning");
        return;
    } else {
        datosExtraidos.tienda.forEach((doc) => {
            const docData = doc;
            excelData.push([docData.nombre, docData.valorTotal, docData.numPersonasAtendidas]);
        });

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos Tienda');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const element = document.createElement('a');
        element.href = url;
        element.download = 'datosTienda.xlsx';
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    }
});

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

extraeHistorialT.addEventListener('click', async () => {
    console.log("entro");
    const datosExtraidos = await THistorial();
    if (datosExtraidos.historial.length == 0) {
        aviso("No hay registros de compras realizadas en las tiendas", "warning");
        return;
    }
    let historial = [];
    datosExtraidos.historial.forEach(doc => {
        if (doc.concepto.startsWith("Compra tienda")) {
            historial.push(doc);
        }
    });



    let excelData = [['Cedula', 'Concepto', 'Cuotas', 'Fecha Efectuado', 'Nombre Quien Entregó', 'Valor']];

    historial.forEach((doc) => {
        excelData.push([
            doc.cedula,
            doc.concepto,
            doc.cuotas,
            doc.fechaEfectuado,
            doc.nombreQuienEntrego,
            doc.valor
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial Detallado');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'datosHistorialDetallado.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
});


async function escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, tipo) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);
    var dia = new Date().getDate();
    var mes = new Date().getMonth() + 1;
    var anio = new Date().getFullYear();
    // yyyy-mm-dd
    const fecha = anio + '-' + mes + '-' + dia;
    const urlcompleta = urlBack.url + '/Historial/jefedearea/crearHistorialPrestamo/' + cedulaEmpleado;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    cedula: cedulaEmpleado,
                    nombreQuienEntrego: usernameLocal,
                    valor: nuevovalor,
                    cuotas: cuotas,
                    fechaEfectuado: fecha,
                    concepto: tipo,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}

async function CambiarEstado(cod, valor, codigo) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Codigo/jefedearea/cambiarEstadoCodigo/' + cod;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    estado: false,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
                aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + codigo, 'success');
                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}

boton.addEventListener('click', async (e) => {

    e.preventDefault();
    // capturar los datos del formulario
    let cedulaEmpleado = document.querySelector('#cedula').value;
    let codigoP = document.querySelector('#codigo').value;
    let valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');
    let cuotas = document.querySelector('#cuotas').value;
    let celular = document.querySelector('#celular').value;

    let encontrado = false;
    let concepto2;

    if (codigoP == '') {
        aviso('El campo codigo no puede estar vacio', 'error');
    }

    const aux = await datosTCodigos();
    console.log(aux.codigo);
    let aux2 = await datosEmpleado(cedulaEmpleado);
    console.log(aux2.datosbase[0]);
    let usuario = aux2.datosbase[0];
    console.log(usuario);


    if (!verificarCodigo(codigoP, aux.codigo)) {
        aviso('El código no existe', 'error');
        return;
    }
    if (!verificarCodigoEstado(codigoP, aux.codigo)) {
        aviso('El código ya fue usado', 'error');
        return;
    }
    if (!verificarCedula(codigoP, cedulaEmpleado, aux.codigo)) {
        aviso('El código no pertenece a este empleado', 'error');
        return;
    }
    if (!verificaMonto(parseInt(nuevovalor), aux.codigo)) {
        aviso('El monto del prestamo es mayor al permitido generado con el código ', 'error');
        return;
    }
    if (!verificaSiesUnPrestamo(codigoP)) {
        aviso('El código no es valido solo se admiten prestamos', 'error');
        return;
    }
    if (!verificaCondiciones(usuario, parseInt(nuevovalor))) {
        return;
    }
    if (!verificaSelect(tipo)) {
        return;
    }


    else {
        const cod = obtenerCodigo(codigoP, aux.codigo);
        let concepto = null;
        concepto2 = 'Dinero_Autorizacion';
        concepto = 'Libranza_Prestamo_Dinero';
        encontrado = true;

        let codigo = 'OH' + Math.floor(Math.random() * 1000000);;

        if (cod.codigo.startsWith("SF")) {
            concepto2 = 'Seguro_Funerario_Autorizacion';
            concepto = 'Libranza_Seguro_Funerario';

        }
        else if (cod.codigo.startsWith("OT")) {
            concepto2 = 'Otro_Autorizacion';
            concepto = 'Libranza_Otro_concepto';
        }

        await actualizar(codigo, cod.codigo, usernameLocal, nuevovalor, cuotas);

        console.log("primero" + concepto2);
        await actualizarDatosBase(concepto2, nuevovalor, cuotas, cedulaEmpleado);
        // modificar en la tabla codigos el estado del codigo a false para que no pueda ser usado nuevamente
        await CambiarEstado(cod.codigo, nuevovalor, codigo);

        await escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, concepto)

        aviso('Acaba de pedir un prestamo de ' + valor, 'success');

        let empresa = null;
        let NIT = null;
        let direcccion = null;

        if (usuario.temporal.startsWith("Apoyo") || usuario.temporal.startsWith("APOYO")) {
            empresa = "APOYO LABORAL TS SAS";
            NIT = "NIT 900814587"
            direcccion = "CRA 2 N 8-156 FACATATIVA"
        }

        else if (usuario.temporal.startsWith("Tu") || usuario.temporal.startsWith("TU")) {
            empresa = "TU ALIANZA SAS";
            NIT = "NIT 900864596"
            direcccion = "Calle 7 N 4-49 MADRID"
        }

        else if (usuario.temporal.startsWith("Comercializadora") || usuario.temporal.startsWith("COMERCIALIZADORA")) {
            empresa = "COMERCIALIZADORA TS";
            NIT = "NIT 901602948"
            direcccion = "CRA 1 N 17-37 BRAZILIA"
        }

        var docPdf = new jsPDF();

        docPdf.addFont('Helvetica-Bold', 'Helvetica', 'bold');


        docPdf.setFontSize(9);
        docPdf.text('______________________________________________________________________________________________________________', 10, 10);
        docPdf.setFontSize(24);
        docPdf.setFont('Helvetica', 'bold');
        docPdf.text(empresa, 15, 22);
        docPdf.setFont('Helvetica', 'normal');
        docPdf.setFontSize(9);
        docPdf.text('AUTORIZACIóN DE LIBRANZA', 132, 15);
        docPdf.text(NIT, 145, 20);
        docPdf.text(direcccion, 135, 25);
        docPdf.text('______________________________________________________________________________________________________________', 10, 27);
        docPdf.text('______________________________________________________________________________________________________________', 10, 29);


        docPdf.text('Fecha de Solicitud: ' + new Date().toLocaleDateString(), 10, 40);
        // salto de linea
        docPdf.setFont('Helvetica', 'bold');

        docPdf.text('ASUNTO: CREDITO (PRESTAMO)', 10, 50);
        docPdf.setFont('Helvetica', 'normal');


        docPdf.text('Yo, ' + usuario.nombre + ' mayor de edad,  identificado con la cedula de ciudadania No. '
            + usuario.numero_de_documento + ' autorizo', 10, 55);
        docPdf.text('expresa e irrevocablemente para que del sueldo, salario, prestaciones sociales o de cualquier suma de la sea acreedor; me sean', 10, 60);
        docPdf.text('descontados la cantidad de ' + valor + ' " ' + NumeroALetras(nuevovalor) + ' " ' + 'por concepto de' + ' PRESTAMO, en ' + cuotas + ' cuota(s), ', 10, 65);
        docPdf.text('quincenal del credito del que soy deudor ante Tu alianza S.A.S. , aun en el evento de encontrarme disfrutando de mis licencias ', 10, 70);
        docPdf.text('o incapacidades. ', 10, 75);

        docPdf.text('Fecha de ingreso: ' + usuario.ingreso, 10, 85);
        docPdf.text('Centro de Costo: ' + usuario.finca, 130, 85);
        docPdf.text('Forma de pago: ' + formaPago.value, 10, 90);
        docPdf.text('Telefono: ' + celular, 130, 90);
        docPdf.setFont('Helvetica', 'bold');
        docPdf.text('Cordialmente ', 10, 100);
        docPdf.setFont('Helvetica', 'normal');
        docPdf.text('Firma de Autorización ', 10, 110);
        docPdf.text('C.C. ' + usuario.numero_de_documento, 10, 115);

        // realizar un cuadro para colocar la huella dactilar
        docPdf.rect(130, 97, 25, 30);
        docPdf.text('Código de descuento nómina: ' + codigo, 10, 120);
        docPdf.setFont('Helvetica', 'bold');
        docPdf.setFontSize(6);
        docPdf.text('Huella Indice Derecho', 130, 95);

        docPdf.save('AutorizacionPrestamo' + '_' + usuario.nombre + "_" + codigo + '.pdf');

    }


    document.querySelector('#codigo').value = "";
    document.querySelector('#cedula').value = "";
    document.querySelector('#valor').value = "";
    document.querySelector('#cuotas').value = "";
    document.querySelector('#celular').value = "";
});



/*************************************************************/
// NumeroALetras
// The MIT License (MIT)
// 
// Copyright (c) 2015 Luis Alfredo Chee 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// @author Rodolfo Carmona
// @contributor Jean (jpbadoino@gmail.com)
/*************************************************************/
function Unidades(num) {

    switch (num) {
        case 1: return "UN";
        case 2: return "DOS";
        case 3: return "TRES";
        case 4: return "CUATRO";
        case 5: return "CINCO";
        case 6: return "SEIS";
        case 7: return "SIETE";
        case 8: return "OCHO";
        case 9: return "NUEVE";
    }

    return "";
}//Unidades()

function Decenas(num) {

    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
        case 1:
            switch (unidad) {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch (unidad) {
                case 0: return "VEINTE";
                default: return "VEINTI" + Unidades(unidad);
            }
        case 3: return DecenasY("TREINTA", unidad);
        case 4: return DecenasY("CUARENTA", unidad);
        case 5: return DecenasY("CINCUENTA", unidad);
        case 6: return DecenasY("SESENTA", unidad);
        case 7: return DecenasY("SETENTA", unidad);
        case 8: return DecenasY("OCHENTA", unidad);
        case 9: return DecenasY("NOVENTA", unidad);
        case 0: return Unidades(unidad);
    }
}//Unidades()

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + " Y " + Unidades(numUnidades)

    return strSin;
}//DecenasY()

function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + Decenas(decenas);
        case 3: return "TRESCIENTOS " + Decenas(decenas);
        case 4: return "CUATROCIENTOS " + Decenas(decenas);
        case 5: return "QUINIENTOS " + Decenas(decenas);
        case 6: return "SEISCIENTOS " + Decenas(decenas);
        case 7: return "SETECIENTOS " + Decenas(decenas);
        case 8: return "OCHOCIENTOS " + Decenas(decenas);
        case 9: return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
}//Centenas()

function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
}//Seccion()

function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = Seccion(num, divisor, "MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
}//Miles()

function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "")
        return strMiles;

    return strMillones + " " + strMiles;
}//Millones()

function NumeroALetras(num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: 'Pesos',//"PESOS", 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular: 'Peso', //"PESO", 'Dólar', 'Bolivar', 'etc'

        letrasMonedaCentavoPlural: "CENTAVOS",
        letrasMonedaCentavoSingular: "CENTAVO"
    };

    if (data.centavos > 0) {
        data.letrasCentavos = "CON " + (function () {
            if (data.centavos == 1)
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
            else
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
        })();
    };

    if (data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}

// fin








