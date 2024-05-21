import { urlBack } from "../models/base.js";
import { aviso, avisoConfirmado } from "../Avisos/avisos.js";

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const estado = localStorage.getItem("estadoSolicitudes");

const uid = localStorage.getItem("idUsuario");

//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

await crearTienda(uid);
const correo = localStorage.getItem("correo_electronico");


if (correo == "tuafiliacion@tsservicios.co") {
    carol.style.display = "block"
    carol2.style.display = "block"
}

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
    diasLi.style.color = "red";
} else {
    diasLi.style.color = "black";
}
diasLi.innerHTML = dias2;


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

async function datos() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Datosbase/tesoreria';

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
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

/* Obtener codigos de la base de datos */
const aux = await datosTCodigos();
let arrayCodigos = [];

aux.codigo.forEach((c) => {
    if (c.ceduladelGenerador_id == uid) {
        arrayCodigos.push(c);
    }
});

// ordernar por fechaGenerado
arrayCodigos.sort((a, b) => {
    if (a.fechaGenerado < b.fechaGenerado) {
        return 1;
    }
    if (a.fechaGenerado > b.fechaGenerado) {
        return -1;
    }
    return 0;
}
);

// Mostar contenido en una tabla
arrayCodigos.forEach((c) => {
    tabla.innerHTML += `
    <tr>
        <td>${c.codigo}</td>
        <td>${c.monto}</td>
        <td>${c.cuotas}</td>
        <td>${c.estado}</td>
        <td>${c.Concepto}</td>
        <td>${c.cedulaQuienPide}</td>
    </tr>
    `
});

async function crearTienda(cedula) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Tienda/guardartienda';

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    nombre: usernameLocal,
                    codigo: cedula,
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

if (estado == 'true') {
    document.getElementById("myonoffswitch").checked = false;
}
else {
    document.getElementById("myonoffswitch").checked = true;
}

async function estadoSoli(checked) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/usuarios/coordinador/cambioSolicitudes';

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    estadoSolicitudes: checked,
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


HistorialDe.addEventListener("click", async function () {
    console.log("Historial de entregas");
    let arrayaux, arrayHistorial = [];
    arrayaux = await THistorial();


    arrayaux.historial.forEach((h) => {
        if (h.nombreQuienEntrego == usernameLocal) {
            arrayHistorial.push(h);
        }
    });

    console.log(arrayHistorial);

    // Crear un objeto para agrupar los datos por fecha
    const historialPorFecha = {};

    arrayHistorial.forEach((h) => {
        const fecha = h.fechaEfectuado;

        // Si la fecha no está en el objeto, crear un nuevo objeto para esa fecha
        if (!historialPorFecha[fecha]) {
            historialPorFecha[fecha] = {
                registros: [],
                conceptos: {}, // Objeto para contar los conceptos y sus valores totales
            };
        }

        historialPorFecha[fecha].registros.push(h);

        // Contar conceptos y calcular valores totales
        if (!historialPorFecha[fecha].conceptos[h.concepto]) {
            historialPorFecha[fecha].conceptos[h.concepto] = {
                cantidad: 0,
                valorTotal: 0,
            };
        }

        historialPorFecha[fecha].conceptos[h.concepto].cantidad += 1;
        historialPorFecha[fecha].conceptos[h.concepto].valorTotal += parseFloat(h.valor);
    });

    // Crear un archivo Excel con hojas internas para cada fecha
    const wb = XLSX.utils.book_new();
    var nombres = [];
    const datosbase = await datos();

    for (const fecha in historialPorFecha) {
        const historialFecha = historialPorFecha[fecha].registros;

        const excelData = [['Cedula', 'Nombre', 'Codigo', 'Concepto', 'Cuotas', 'Fecha Efectuado', 'Generado Por', 'Hora Efectuado', 'Nombre Quien Entregó', 'Valor']];

        historialFecha.forEach((h) => {
            // Buscar el nombre correspondiente en datosbase
            const nombreEncontrado = datosbase.datosbase.find((persona) => persona.numero_de_documento === h.cedula);
            const nombre = nombreEncontrado ? nombreEncontrado.nombre : ''; // Nombre si se encuentra, cadena vacía si no

            excelData.push([
                h.cedula,
                nombre, // Agregar el nombre aquí
                h.codigo,
                h.concepto,
                Number(h.cuotas),
                h.fechaEfectuado,
                h.generadopor,
                h.horaEfectuado,
                h.nombreQuienEntrego,
                Number(h.valor),
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, fecha);
    }


    const TotalHistorial = [['Cedula', 'Nombre', 'Codigo', 'Concepto', 'Cuotas', 'Fecha Efectuado', 'Generado Por', 'Hora Efectuado', 'Nombre Quien Entregó', 'Valor']];

    arrayHistorial.forEach((h) => {
        const nombreEncontrado = datosbase.datosbase.find((persona) => persona.numero_de_documento === h.cedula);
        const nombre = nombreEncontrado ? nombreEncontrado.nombre : ''; // Nombre si se encuentra, cadena vacía si no
        TotalHistorial.push([
            h.cedula,
            nombre, // Agregar el nombre aquí
            h.codigo,
            h.concepto,
            Number(h.cuotas),
            h.fechaEfectuado,
            h.generadopor,
            h.horaEfectuado,
            h.nombreQuienEntrego,
            Number(h.valor),
        ]);
    })

    const ws = XLSX.utils.aoa_to_sheet(TotalHistorial);
    XLSX.utils.book_append_sheet(wb, ws, "Total");

    // Crear hoja de resumen detallado
    const resumenDetalladoData = [['Fecha', 'Concepto', 'Cantidad de Registros', 'Monto Total']];

    for (const fecha in historialPorFecha) {
        for (const concepto in historialPorFecha[fecha].conceptos) {
            const conceptoInfo = historialPorFecha[fecha].conceptos[concepto];
            resumenDetalladoData.push([
                fecha,
                concepto,
                Number(conceptoInfo.cantidad),
                Number(conceptoInfo.valorTotal)
            ]);
        }
    }

    const resumenDetalladoWs = XLSX.utils.aoa_to_sheet(resumenDetalladoData);
    XLSX.utils.book_append_sheet(wb, resumenDetalladoWs, 'Resumen Detallado');

    // Crear hoja de resumen general
    const resumenGeneralData = [['Fecha', 'Cantidad de Registros', 'Monto Total']];

    for (const fecha in historialPorFecha) {
        const totalRegistros = historialPorFecha[fecha].registros.length;
        const totalMonto = Object.values(historialPorFecha[fecha].conceptos).reduce((total, concepto) => total + concepto.valorTotal, 0);
        resumenGeneralData.push([fecha, Number(totalRegistros), Number(totalMonto)]);
    }

    const resumenGeneralWs = XLSX.utils.aoa_to_sheet(resumenGeneralData);
    XLSX.utils.book_append_sheet(wb, resumenGeneralWs, 'Resumen General');

    // Descargar el archivo Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'historialEntregas.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
});

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}



let contracion = document.getElementById("contratacion");

contracion.addEventListener('change', async () => {
    const file = input.files[0];
    const reader = new FileReader();

    let datosFinales = [];

    reader.onload = (event) => {
        const fileContent = event.target.result;
        const workbook = XLSX.read(new Uint8Array(fileContent), { type: 'array', cellDates: true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Obtiene el rango de la hoja
        const range = XLSX.utils.decode_range(sheet['!ref']);

        for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
            let rowData = [];
            for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                // Obtiene la celda en la posición actual
                const cellRef = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
                const cell = sheet[cellRef];

                // Formatea la fecha si la celda es una fecha
                let cellText = "";
                if (cell && cell.t === 'd') {
                    cellText = cell.v.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
                } else {
                    cellText = cell ? `${cell.w || cell.v}` : "";
                }

                // Agrega el texto de la celda al array de datos finales
                rowData.push(cellText);
            }
            datosFinales.push(rowData);
        }

        console.log('Datos cargados desde Excel:', datosFinales);

        over.style.display = "block";
        loader.style.display = "block";

        guardarDatos(datosFinales);
    };

    reader.readAsArrayBuffer(file);
});




async function exportarErroresAExcel2(errores) {
    // Mapear los datos de errores a un nuevo array con el mismo formato pero con el motivo constante
    const erroresConMotivo = errores.map(error => ({
        Registro: error.registro,
        Error: error.error,
        Motivo: 'El campo tiene un formato no permitido'
    }));

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Crear una hoja de cálculo a partir de los datos de errores con el motivo constante
    const worksheet = XLSX.utils.json_to_sheet(erroresConMotivo);

    // Definir el encabezado de la hoja de cálculo
    worksheet['A1'] = { v: 'Registro', t: 's' };
    worksheet['C1'] = { v: 'Error', t: 's' };
    worksheet['D1'] = { v: 'Motivo', t: 's' };

    // Agregar la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Errores');

    // Generar el archivo Excel
    XLSX.writeFile(workbook, 'ErroresSubidaMasivaBaseContratacion.xlsx');
}




async function guardarDatos(datosFinales) {

    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;


    const bodyData = {
        jwt: jwtKey,
        mensaje: "muchos",
        datos: datosFinales
    };

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/contratacion/subidadeusuariosarchivoexcel';
    try {
        fetch(urlcompleta, {
            method: 'POST',// para el resto de peticiónes HTTP le cambias a GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(bodyData),// Aquí va el body de tu petición tiene que ser asi en json para que el back lo pueda leer y procesar y hay algun problema me dices

        })
            .then(async response => {
                if (response.ok) {
                    const responseData = await response.json(); // Asegurándonos de esperar la promesa
                    await sleep(1000);
                    await exportarErroresAExcel2(responseData.errores);
                    console.log('Respuesta:', responseData);
                    document.getElementById('successSound').play();
                    over.style.display = "none";
                    loader.style.display = "none";
                    let aviso = await avisoConfirmado("Datos guardados correctamente", "success");
                    if (aviso) {
                        location.reload();
                    }
                    return responseData;
                } else {
                    document.getElementById('errorSound').play();
                    aviso("Error al guardar los datos", "error");
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
                // Aquí puedes manejar `responseData` si es necesario
                document.getElementById('successSound').play();
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('errorSound').play();
            });

    } catch (error) {
        console.error('Error en la petición HTTP PUT');
        console.error(error);
    }


}




/*Inabilitar permisos*/
document.getElementById("myonoffswitch").addEventListener("click", async function (event) {

    if (this.checked) {
        estadoSoli("False");
        localStorage.setItem("estadoSolicitudes", "false");
        aviso('Se ha notificado que no va a publicar mas codigos para hacer', 'success');


    } else {
        estadoSoli("True");
        localStorage.setItem("estadoSolicitudes", "true");
        aviso('Se ha notificado que va a publicar mas codigos para hacer', 'success');
    }
});


let input = document.getElementById('subidaMasiva');
input.addEventListener('change', async () => {

    const file = input.files[0];
    const reader = new FileReader();

    let datosFinales = [];

    reader.onload = (event) => {
        const fileContent = event.target.result;
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Comienza a leer desde la quinta fila
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i];

            // Asegurarse de que rowData[0] es una cadena antes de convertir a mayúsculas
            rowData[0] = String(rowData[0]).toUpperCase();
            rowData[1] = String(rowData[1]).toUpperCase();

            datosFinales.push(rowData);
        }

        console.log('Datos cargados desde Excel:', datosFinales);

        datosCarol(datosFinales);
    };

    reader.readAsBinaryString(file);
});

async function datosCarol(datos) {
    let errores = [];
    const datos3 = (await datosTCodigosT()).codigo;

    for (const doc of datos) {
        try {
            console.log('Procesando documento:', doc);
            let aux2 = await datosEmpleado(doc[0]);
            console.log('Datos del empleado obtenidos:', aux2);

            const cod = obtenerCodigo(doc[2], datos3);
            let codigoP = doc[2];

            if (aux2.datosbase == "No se encontró el registro para el ID proporcionado") {
                errores.push({ cedula: doc[0], razon: 'Empleado no existe' });
                console.log('Empleado no existe');
            }
            else if (!verificarCodigo(codigoP, datos3)) {
                errores.push({ cedula: doc[0], razon: 'Código no existe' });
                console.log('Codigo no existe');
            }
            else if (!verificarCodigoEstado(codigoP, datos3)) {
                errores.push({ cedula: doc[0], razon: 'Código ya fue usado' })
                console.log('Codigo ya fue usado');
            }
            else if (!verificarCedula(codigoP, doc[0], datos3)) {
                errores.push({ cedula: doc[0], razon: 'El codigo no pertenece a este empleado' })
                console.log('El codigo no pertenece a este empleado');
            }
            else if (verificaSiesUnPrestamo(codigoP)) {
                errores.push({ cedula: doc[0], razon: 'El codigo no es valido solo se admiten mercados' })
                console.log('El codigo no es valido solo se admiten mercados');
            }

            let concepto = 'Compra tienda de Señor Luis';

            // generar codigo solo numeros aleatorios
            let codigoAux = 'MOH' + Math.floor(Math.random() * 1000000);

            if (cod != undefined) {
                await CambiarEstado(codigoP, doc[1], codigoAux);
                await actualizar(codigoAux, codigoP, usernameLocal, doc[1], 2);
                await escribirHistorial(doc[0], doc[1], 2, concepto, codigoAux, cod.generadoPor);
                await sleep(2000); // Pausa de 2 segundos
                await ActualizarHistorial(codigoAux);
                await historialT(doc[1]);
                await actualizarDatosBase(concepto, doc[1], 2, doc[0]);
            }

            console.log('Llega');

            let confirmacion = await avisoConfirmado('Termino de subir el archivo', "success");

            await exportarErroresAExcel(errores);

            if (confirmacion) {
                // recargar la pagina
                location.reload();
            }
            console.log('Documento procesado:', doc);

        } catch (error) {
            console.error('Error procesando el documento:', doc, 'Error:', error);
            errores.push({ cedula: doc[0], razon: 'Error durante el procesamiento' });
        }
    }
}


async function exportarErroresAExcel(errores) {
    // Crear una hoja de cálculo a partir de un arreglo de objetos
    const worksheet = XLSX.utils.json_to_sheet(errores);

    // Crear un nuevo libro de trabajo y añadir la hoja de cálculo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errores");

    // Generar el archivo Excel y forzar la descarga en el navegador
    XLSX.writeFile(workbook, "ErroresSubidaMasiva.xlsx");
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/*---------------------------------------------------------*/

let input2 = document.getElementById('subidaMasiva2');
input2.addEventListener('change', async () => {

    const file = input2.files[0];
    const reader = new FileReader();

    let datosFinales = [];

    reader.onload = (event) => {
        const fileContent = event.target.result;
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Comienza a leer desde la quinta fila
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i];

            // Asegurarse de que rowData[0] es una cadena antes de convertir a mayúsculas
            rowData[0] = String(rowData[0]).toUpperCase();
            rowData[1] = String(rowData[1]).toUpperCase();

            datosFinales.push(rowData);
        }

        console.log('Datos cargados desde Excel:', datosFinales);

        datosCarol2(datosFinales);
    };

    reader.readAsBinaryString(file);
});


async function datosCarol2(datos) {
    let errores = [];

    console.log(datos);

    for (const doc of datos) {
        console.log('Procesando documento:', doc);

        try {
            let aux2 = await datosEmpleado(doc[0]);
            console.log('Datos del empleado obtenidos:', aux2);

            if (aux2.datosbase == "No se encontró el registro para el ID proporcionado") {
                errores.push({ Cedula: doc[0], Razon: 'Empleado no existe' });
            } else {
                let concepto = 'Compra tienda Ferias';
                let codigoAux = 'MOH' + Math.floor(Math.random() * 1000000);

                await escribirHistorial(doc[0], doc[1], 2, concepto, codigoAux, "CAROL PALACIOS");
                await sleep(2000);
                await ActualizarHistorial(codigoAux);
                await historialT(doc[1]);
                await actualizarDatosBase(concepto, doc[1], 2, doc[0]);
            }
        } catch (error) {
            console.error('Error procesando el documento:', doc, 'Error:', error);
            errores.push({ cedula: doc[0], razon: 'Error durante el procesamiento' });
        }
    }

    await exportarErroresAExcel(errores);
    let confirmacion = await avisoConfirmado('Termino de subir el archivo', "success");

    if (confirmacion) {
        location.reload();
    }
}






async function datosTCodigosT() {
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

function obtenerCodigo(codigo, datos) {
    let cod = undefined;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            cod = doc;
        }
    });
    return cod;
}

function verificaSiesUnPrestamo(codigo) {
    if (!codigo.startsWith("P")) {
        return false;
    }
    else {
        return true;
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

    const urlcompleta = urlBack.url + '/Datosbase/tienda/actualizarMercados/' + cedulaEmpleado;

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    concepto: concepto,
                    mercados: valor,
                    cuotasMercados: cuotas,
                    ejecutadoPor: username,
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

async function escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, tipo, codigo, generadopor) {
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
                    codigo: codigo,
                    nombreQuienEntrego: '',
                    generadopor: generadopor,
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

async function historialT(valor) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Tienda/actualizarTienda';

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    nombre: usernameLocal,
                    valorTotal: valor,
                    numPersonasAtendidas: 1,
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

async function ActualizarHistorial(codigo) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);
    const urlcompleta = urlBack.url + '/Historial/actualizarXcodigo/' + codigo;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: codigo,
                    nombreQuienEntrego: usernameLocal,
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
