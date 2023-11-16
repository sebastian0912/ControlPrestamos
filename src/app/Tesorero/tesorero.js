
import { urlBack } from "../models/base.js";
import { aviso, avisoConfirmacion, avisoConfirmacionAc, avisoConfirmacionAc2, } from "../Avisos/avisos.js";

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");

//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');

let extrae = document.getElementById("extrae");
let extraeT = document.getElementById("extraeT");

let input = document.getElementById('archivoInput');
let eliminar = document.getElementById('archivoEliminar');
let archivoActualizarSaldos = document.getElementById('archivoActualizarSaldos');

let datosFinales = [];

const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');


async function datosUsuarios() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/usuarios/usuarios';

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

function verificarCodigoEstado(datos) {
    let encontrado = 0;
    datos.forEach(doc => {
        if (doc.estado == true) {
            encontrado++;
        }
    });
    return encontrado;
}

function numCoordinadoresConestadoSolicitudesTrue(datos) {

    let auxCoordinadores = 0;
    datos.forEach((doc) => {
        if ((doc.rol == "COORDINADOR" || doc.rol == "JEFE-DE-AREA" || doc.rol == "TIENDA") && doc.estadoSolicitudes == true) {
            auxCoordinadores++;
        }
    });
    return auxCoordinadores;
}

async function datosEmpleado() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Datosbase/datosbase';

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

async function historialModificaciones(concepto, cod) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    // yyyy-mm-dd
    const fecha = anio + '-' + mes + '-' + dia;
    const urlcompleta = urlBack.url + '/HistorialModificaciones/Comercializadora/crearRegistro';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: cod,
                    concepto: concepto,
                    username: usernameLocal,
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

const aux = await datosTCodigos();
let aux2 = await datosEmpleado();
let datosU = await datosUsuarios();

if (aux2.datosbase == "error") {
    numeroTotal.innerHTML = "0";
} else {
    numeroTotal.innerHTML = aux2.datosbase.length;
}

if (aux == null) {
    numeroSolicitudesPendientes.innerHTML = 0;
} else {
    numeroSolicitudesPendientes.innerHTML = verificarCodigoEstado(aux.codigo);
}
numeroCoordinadores.innerHTML = numCoordinadoresConestadoSolicitudesTrue(datosU);


/* Obtener codigos de la base de datos */
const listado = await datosUsuarios();
let arrayCodigos = [];

listado.forEach((c) => {
    if ((c.rol == "COORDINADOR" || c.rol == "JEFE-DE-AREA" || c.rol == "TIENDA") && c.estadoSolicitudes == true && c.primer_nombre != null) {
        arrayCodigos.push(c);
    }
});


// Mostar contenido en una tabla
arrayCodigos.forEach((c) => {
    tabla.innerHTML += `
    <tr>
        <td>${c.primer_nombre}</td>
        <td>${c.primer_apellido}</td>
        <td>${c.correo_electronico}</td>
        <td>${c.rol}</td>
    </tr>
    `
});


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

extrae.addEventListener('click', async () => {

    const datosExtraidos = await datos();

    let excelData = [
        ['', '', '', '', '', '', '', 'ANTERIOR', '', 'PARA DESCONTAR', '', '', '', '', '', '', '', '', '', 'PARA HACER', '', '', '', '', '', '', '', ''],
        ['CÓDIGO', 'CÉDULA', 'NOMBRE', 'INGRESO', 'TEMPORAL', 'FINCA', 'SALARIO', 'SALDOS', 'FONDOS', 'MERCADOS', 'CUOTAS MERCADOS', 'PRESTAMO PARA DESCONTAR', 'CUOTAS PRESTAMOS PARA DESCONTAR', 'CASINO', 'ANCHETAS', 'CUOTAS ANCHETAS', 'FONDO', 'CARNET', 'SEGURO FUNERARIO', 'PRESTAMO PARA HACER', 'CUOTAS PRESTAMO PARA HACER', 'ANTICIPO LIQUIDACIÓN', 'CUENTAS'],
    ];

    datosExtraidos.datosbase.forEach((doc) => {
        const docData = doc;
        let fechaIngreso;
        // Transformar la fecha de "ingreso" al formato "mm/dd/yyyy"
        if (docData.ingreso.includes('-')) {
            // Formato "d-m-yy"
            fechaIngreso = docData.ingreso.split('-');
            if (fechaIngreso[2].length === 2) {
                fechaIngreso[2] = '20' + fechaIngreso[2];
            }
        } else {
            // Formato "d/mm/yyyy"
            fechaIngreso = docData.ingreso.split('/');
        }

        fechaIngreso = fechaIngreso.join('/');

        excelData.push([
            docData.codigo, // Convertir a número
            docData.numero_de_documento, // Convertir a número
            docData.nombre,
            fechaIngreso,
            docData.temporal,
            docData.finca,
            docData.salario, // Convertir a número
            Number(docData.saldos), // Convertir a número
            Number(docData.fondos), // Convertir a número
            Number(docData.mercados), // Convertir a número
            Number(docData.cuotasMercados), // Convertir a número
            Number(docData.prestamoParaDescontar), // Convertir a número
            Number(docData.cuotasPrestamosParaDescontar), // Convertir a número
            Number(docData.casino), // Convertir a número
            Number(docData.valoranchetas), // Convertir a número
            Number(docData.cuotasAnchetas), // Convertir a número
            Number(docData.fondo), // Convertir a número
            Number(docData.carnet), // Asumiendo que es texto
            Number(docData.seguroFunerario), // Convertir a número
            Number(docData.prestamoParaHacer), // Convertir a número
            Number(docData.cuotasPrestamoParahacer), // Convertir a número
            Number(docData.anticipoLiquidacion), // Convertir a número
            Number(docData.cuentas) // Convertir a número
        ]);
        fechaIngreso = '';
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'datos.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);

    // generar numero aleatorio con la inicial T
    let numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    let codigo = "T" + numero;

    await historialModificaciones("Extraer documento base", codigo);
});

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

extraeC.addEventListener('click', async () => {
    datosFinales = [];

    const aux = await datosTCodigos();

    aux.codigo.forEach((doc) => {
        if (doc.codigo.startsWith('OR')) {
            datosFinales.push(doc);
        }
    });

    if (datosFinales.length == 0) {
        aviso("No hay datos para exportar", "warning");
        return;
    }

    let excelData = [['Código', 'Cédula quien pidió', 'Nombre persona quien dio el código', 'Valor', 'Cuotas', 'Fecha']];

    datosFinales.forEach((doc) => {
        excelData.push([
            doc.codigo,
            doc.cedulaQuienPide,
            doc.generadoPor,
            Number(doc.monto),
            Number(doc.cuotas),
            doc.fechaGenerado
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Codigos');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'datosCodigos.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    // borrar la colección de códigos
});

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


    let excelData = [['Nombre De la Tienda', 'Monto Total', 'Numero de compras en la tienda']];

    if (datosExtraidos.message == "error") {
        aviso("No se han comprado productos en las tiendas", "warning");
        return;
    } else {
        datosExtraidos.tienda.forEach((doc) => {
            const docData = doc;
            excelData.push([docData.nombre, Number(docData.valorTotal), Number(docData.numPersonasAtendidas)]);
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
    // generar numero aleatorio con la inicial T
    let numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    let codigo = "T" + numero;

    await historialModificaciones("Extraer total tiendas", codigo);
});

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

valoresEnCero.addEventListener('click', async () => {
    const resultado = await avisoConfirmacionAc2();
    if (resultado) {
        var body = localStorage.getItem('key');
        const obj = JSON.parse(body);
        const jwtToken = obj.jwt;

        const urlcompleta = urlBack.url + '/Datosbase/reiniciarValores';

        try {
            // Mostrar elementos ocultos
            over.style.display = "block";
            loader.style.display = "block";

            fetch(urlcompleta, {
                method: 'POST',
                body: JSON.stringify({
                    jwt: jwtToken
                })
            })
                .then(response => {
                    if (response.ok) {
                        document.getElementById('successSound').play();
                        return response.json();
                    } else {
                        throw new Error('Error en la petición POST');
                    }
                })
                .then(responseData => {

                    document.getElementById('successSound').play();
                    // Ocultar elementos después de completar la operación
                    over.style.display = "none";
                    loader.style.display = "none";
                })
                .catch(error => {
                    console.error('Error:', error);

                    document.getElementById('errorSound').play();
                    // También ocultar elementos en caso de error
                    over.style.display = "none";
                    loader.style.display = "none";
                });

        } catch (error) {
            console.error('Error en la petición HTTP POST');
            console.error(error);
            document.getElementById('errorSound').play();
            // Ocultar elementos en caso de error
            over.style.display = "none";
            loader.style.display = "none";
        }
        // generar numero aleatorio con la inicial T
        let numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        let codigo = "T" + numero;

        await historialModificaciones("Colocar valores en 0", codigo);
    }
    else {
        aviso("No se han actualizado los campos", "success");
    }
});

async function datosEliminar(cedulas) {
    const datosExtraidos = await datos();
    let datosFinales = [];
    cedulas.forEach((cedula) => {
        const docEncontrado = datosExtraidos.datosbase.find((doc) => doc.numero_de_documento == cedula);
        if (docEncontrado) {
            datosFinales.push(docEncontrado);
        } else {
            // Si no se encuentra la cédula, muestra un aviso.
            aviso(`El empleado con cédula ${cedula} no se puede eliminar porque no se encuentra`, "warning");
        }
    });
    return datosFinales;
}

function extraerDatosEliminar(datos) {

    let excelData = [
        ['', '', '', '', '', '', '', 'ANTERIOR', '', 'PARA DESCONTAR', '', '', '', '', '', '', '', '', '', 'PARA HACER', '', '', '', '', '', '', '', ''],
        ['CÓDIGO', 'CÉDULA', 'NOMBRE', 'INGRESO', 'TEMPORAL', 'FINCA', 'SALARIO', 'SALDOS', 'FONDOS', 'MERCADOS', 'CUOTAS MERCADOS', 'PRESTAMO PARA DESCONTAR', 'CUOTAS PRESTAMOS PARA DESCONTAR', 'CASINO', 'ANCHETAS', 'CUOTAS ANCHETAS', 'FONDO', 'CARNET', 'SEGURO FUNERARIO', 'PRESTAMO PARA HACER', 'CUOTAS PRESTAMO PARA HACER', 'ANTICIPO LIQUIDACIÓN', 'CUENTAS'],
    ];

    datos.forEach((doc) => {
        const docData = doc;
        let fechaIngreso;
        // Transformar la fecha de "ingreso" al formato "mm/dd/yyyy"
        if (docData.ingreso.includes('-')) {
            // Formato "d-m-yy"
            fechaIngreso = docData.ingreso.split('-');
            if (fechaIngreso[2].length === 2) {
                fechaIngreso[2] = '20' + fechaIngreso[2];
            }
        } else {
            // Formato "d/mm/yyyy"
            fechaIngreso = docData.ingreso.split('/');
        }

        fechaIngreso = fechaIngreso.join('/');

        excelData.push([
            docData.codigo, // Convertir a número
            docData.numero_de_documento, // Convertir a número
            docData.nombre,
            fechaIngreso,
            docData.temporal,
            docData.finca,
            docData.salario, // Convertir a número
            Number(docData.saldos), // Convertir a número
            Number(docData.fondos), // Convertir a número
            Number(docData.mercados), // Convertir a número
            Number(docData.cuotasMercados), // Convertir a número
            Number(docData.prestamoParaDescontar), // Convertir a número
            Number(docData.cuotasPrestamosParaDescontar), // Convertir a número
            Number(docData.casino), // Convertir a número
            Number(docData.valoranchetas), // Convertir a número
            Number(docData.cuotasAnchetas), // Convertir a número
            Number(docData.fondo), // Convertir a número
            Number(docData.carnet), // Asumiendo que es texto
            Number(docData.seguroFunerario), // Convertir a número
            Number(docData.prestamoParaHacer), // Convertir a número
            Number(docData.cuotasPrestamoParahacer), // Convertir a número
            Number(docData.anticipoLiquidacion), // Convertir a número
            Number(docData.cuentas) // Convertir a número
        ]);
        fechaIngreso = '';
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    let fecha = new Date().toLocaleString();
    fecha = fecha.replace(/\//g, "-");

    XLSX.utils.book_append_sheet(wb, ws, 'Eliminados');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'DatosEliminadosEl_' + fecha + '.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
}

let datosAux = [];

function verificaInfo(datos) {
    // verificar que no tenga saldos pendientes
    const sumaTotal =
        parseInt(datos.mercados) +
        parseInt(datos.prestamoParaDescontar) +
        parseInt(datos.casino) +
        parseInt(datos.valoranchetas) +
        parseInt(datos.fondo) +
        parseInt(datos.carnet) +
        parseInt(datos.seguroFunerario) +
        parseInt(datos.anticipoLiquidacion) +
        parseInt(datos.cuentas);

    if (sumaTotal > 0) {
        aviso("El empleado con cédula " + datos.numero_de_documento + " tiene saldos pendientes no se puede eliminar", "warning");
    }
    else {
        datosAux.push(datos);
        EliminarEm(datos.numero_de_documento);
    }
}

eliminar.addEventListener('change', async () => {
    const archivo = eliminar.files[0];
    const reader = new FileReader();

    let datosFinales = [];

    reader.onload = async (event) => {
        const fileContent = event.target.result;
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        for (let i = 0; i < rows.length; i++) {
            const rowData = rows[i];
            const cedula = rowData[0].toString().replace(/\./g, ''); // Eliminar puntos

            if (cedula && cedula !== "CEDULA") {
                datosFinales.push(cedula);
            }
        }

        // Mostrar elementos ocultos
        over.style.display = "block";
        loader.style.display = "block";

        console.log('Datos a eliminar:', datosFinales);
        
        const datos = await datosEliminar(datosFinales);

        for (let i = 0; i < datos.length; i++) {
            verificaInfo(datos[i]);
        }

        extraerDatosEliminar(datosAux);

        // Ocultar elementos al finalizar
        over.style.display = "none";
        loader.style.display = "none";

        // Generar número aleatorio con la inicial 'T'
        const numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        const codigo = "T" + numero;

        await historialModificaciones("Eliminar liquidados", codigo);
    };

    reader.readAsBinaryString(archivo);
});


async function EliminarEm(cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    const urlcompleta = urlBack.url + '/Datosbase/eliminardatos/' + cedulaEmpleado;
    try {
        fetch(urlcompleta, {
            method: 'DELETE',
            headers: {
                'Authorization': jwtToken
            },
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
                if (responseData.message == "error") {
                    aviso("No se ha podido eliminar el empleado con cédula: " + cedulaEmpleado, "warning");
                }
                return
            })
            .catch(error => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}


archivoActualizarSaldos.addEventListener('change', async () => {
    const resultado = await avisoConfirmacionAc();

    if (resultado) {
        const archivo = archivoActualizarSaldos.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            const fileContent = event.target.result;
            const workbook = XLSX.read(fileContent, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Array para almacenar los datos finales
            const datosFinales = [];

            // Iterar a través de las filas del archivo Excel
            for (let i = 0; i < rows.length; i++) {
                const rowData = rows[i];

                // Verificar si la fila tiene al menos dos columnas (CEDULA y SALDO)
                if (rowData.length >= 2) {
                    const cedula = rowData[0].toString().trim();
                    const saldo = parseFloat(rowData[1].toString().trim()); // Convertir a número si es necesario

                    // Verificar si la cédula y el saldo son válidos antes de agregarlos al arreglo
                    if (cedula !== "" && !isNaN(saldo)) {
                        datosFinales.push({ cedula, saldo });
                    }
                }
            }

            // Mostrar elementos ocultos
            over.style.display = "block";
            loader.style.display = "block";

            // Divide los datos en lotes de 200
            for (let i = 0; i < datosFinales.length; i += 200) {
                const lote = datosFinales.slice(i, i + 200);
                await procesarLote(lote);
            }

            // Ocultar elementos al finalizar
            over.style.display = "none";
            loader.style.display = "none";

            // sonido de exito
            document.getElementById('successSound').play();

            // Generar número aleatorio con la inicial 'T'
            const numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
            const codigo = "T" + numero;

            await historialModificaciones("Actualizar saldos", codigo);
        };

        reader.readAsBinaryString(archivo);
    } else {
        // El usuario canceló la actualización de saldos o cerró el diálogo
        aviso("No se ha actualizado ningún saldo de algún empleado", "success");
    }
});

async function procesarLote(lote) {
    // Aquí debes implementar la lógica para procesar cada elemento del lote
    // En este ejemplo, simplemente se llama a la función ActualizarEm para cada elemento
    for (const elemento of lote) {
        await ActualizarEm(elemento.cedula, elemento.saldo);
    }
}


async function ActualizarEm(cedulaEmpleado, valor) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    const urlcompleta = urlBack.url + '/Datosbase/actualizarSaldos/' + cedulaEmpleado;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body: JSON.stringify({
                saldos: valor,
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
                if (responseData.message == "error") {
                    aviso("No se ha podido actualizar el empleado con cédula: " + cedulaEmpleado, "warning");
                }
                return
            })
            .catch(error => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}





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
        for (let i = 4; i < rows.length; i++) {
            const rowData = rows[i];

            // Convierte el número serial de fecha en una cadena de texto en formato "dd/mm/yyyy"
            const fechaSerial = rowData[3];
            const fechaCadena = excelSerialToJSDate(fechaSerial);

            // Reemplaza el valor numérico con la cadena de texto formateada
            rowData[3] = fechaCadena;

            datosFinales.push(rowData);
        }

        console.log('Datos cargados desde Excel:', datosFinales);

        // Llama a la función para procesar los datos (guardarDatos) si es necesario
        loader.style.display = "block";
        over.style.display = "block";
        guardarDatos(datosFinales);

    };

    reader.readAsBinaryString(file);

    // Función para convertir el número serial de fecha de Excel en una cadena de texto en formato "dd/mm/yyyy"
    function excelSerialToJSDate(serial) {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400; // 86400 seconds in a day
        const dateInfo = new Date(utcValue * 1000);

        const day = dateInfo.getUTCDate();
        const month = dateInfo.getUTCMonth() + 1; // JS months are 0-based
        const year = dateInfo.getUTCFullYear() % 100; // Obtener los últimos dos dígitos del año

        return `${day}-${month}-${year.toString().padStart(2, '0')}`;
    }
    // generar numero aleatorio con la inicial T
    let numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    let codigo = "T" + numero;

    await historialModificaciones("Insertar nuevos empleados", codigo);

});


async function guardarDatos(datosFinales) {
    console.log('Datos a guardar:', datosFinales);
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

    const urlcompleta = urlBack.url + '/Datosbase/datosbase';
    try {
        fetch(urlcompleta, {
            method: 'POST',// para el resto de peticiónes HTTP le cambias a GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(bodyData),// Aquí va el body de tu petición tiene que ser asi en json para que el back lo pueda leer y procesar y hay algun problema me dices

        })
            .then(async response => {
                if (response.ok) {
                    document.getElementById('successSound').play();
                    
                    over.style.display = "none";
                    loader.style.display = "none";
                    let aviso = await avisoConfirmado("Datos guardados correctamente", "success");                    
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal                    
                    if (aviso){
                        location.reload();
                    }
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                    return response.json();
                } else {
                    document.getElementById('errorSound').play();
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
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

extraeHistorialT.addEventListener('click', async () => {
    const datosExtraidos = await THistorial();
    if (datosExtraidos.historial.length == 0) {
        aviso("No hay registros de compras realizadas en las tiendas", "warning");
        return;
    }

    // Crear un objeto para agrupar los datos por mes
    const historialPorMes = {};

    datosExtraidos.historial.forEach(doc => {
        if (doc.concepto.startsWith("Compra tienda")) {
            // Obtener el mes y el día de la fecha en formato 'YYYY-MM-DD'
            const fechaParts = doc.fechaEfectuado.split('-');
            let mes = fechaParts[1];
            let dia = fechaParts[2];

            if (!historialPorMes[mes]) {
                historialPorMes[mes] = { '13-27': [], '28-12': [] };
            }

            // Si el día está en el rango del 28 al 31, asignar el siguiente mes
            if (dia >= 28) {
                const siguienteMes = (parseInt(mes) + 1).toString().padStart(2, '0');
                historialPorMes[siguienteMes] = historialPorMes[siguienteMes] || { '13-27': [], '28-12': [] };
                dia = dia <= 12 ? `0${dia}` : dia;
                mes = siguienteMes;
            }

            const grupo = dia >= 13 && dia <= 27 ? '13-27' : '28-12';

            // Utilizar una expresión regular para encontrar "de" o "en" seguido del lugar
            const lugarMatch = doc.concepto.match(/(?:de|en)\s+(.+)/i);

            if (lugarMatch) {
                const lugar = lugarMatch[1]; // El segundo grupo capturado es el lugar
                doc.lugar = lugar; // Asignar el valor al campo "lugar"
            }

            historialPorMes[mes][grupo].push(doc);
        }
    });


    // Crear un archivo Excel con hojas internas para cada mes
    const wb = XLSX.utils.book_new();



    for (const mes in historialPorMes) {
        const historialMes = historialPorMes[mes];

        for (const rango in historialMes) {
            const excelData = [['Cedula', 'Concepto', 'Lugar', 'Cuotas', 'Fecha Efectuado', 'Nombre Quien Entregó', 'Valor']];

            historialMes[rango].forEach(doc => {
                excelData.push([
                    doc.cedula,
                    doc.concepto,
                    doc.lugar,
                    doc.cuotas,
                    doc.fechaEfectuado,
                    doc.nombreQuienEntrego,
                    doc.valor
                ]);
            });

            const ws = XLSX.utils.aoa_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, `${mes} (${rango})`);
        }
    }

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

    // generar numero aleatorio con la inicial T
    let numero = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    let codigo = "T" + numero;

    await historialModificaciones("Extraer historial detallado", codigo);
});



