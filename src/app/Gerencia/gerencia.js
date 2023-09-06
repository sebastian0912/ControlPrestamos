import { urlBack } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const empleados = localStorage.getItem("CantidadEmpleados");

const numeroTotal = document.querySelector('#numeroEmpleados');

let extrae = document.getElementById("extrae");
let extraeT = document.getElementById("extraeT");

const coordinadores = localStorage.getItem("CantidadCoordinadores");
const tiendas = localStorage.getItem("CantidadTiendas");


//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;
numeroTotal.innerHTML = empleados;
numeroCoordinadores.innerHTML = coordinadores;
numeroTiendas.innerHTML = tiendas;

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
            excelData.push([docData.nombre, Number(docData.valorTotal), docData.numPersonasAtendidas]);
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

    // Crear un objeto para agrupar los datos por mes
    const historialPorMes = {};

    datosExtraidos.historial.forEach(doc => {
        if (doc.concepto.startsWith("Compra tienda")) {
            // Obtener el mes de la fecha en formato 'YYYY-MM'
            const mes = doc.fechaEfectuado.slice(0, 7);

            if (!historialPorMes[mes]) {
                historialPorMes[mes] = [];
            }

            historialPorMes[mes].push(doc);
        }
    });

    // Crear un archivo Excel con hojas internas para cada mes
    const wb = XLSX.utils.book_new();

    for (const mes in historialPorMes) {
        const historialMes = historialPorMes[mes];
        const excelData = [['Cedula', 'Concepto', 'Lugar', 'Cuotas', 'Fecha Efectuado', 'Nombre Quien Entregó', 'Valor']];

        historialMes.forEach(doc => {
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
        XLSX.utils.book_append_sheet(wb, ws, mes);
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
let coodinador = document.getElementById("coordinadores");
const nombresApellidos = [
    "LEYDI CAMACHO",
    "CLAUDIA BELTRAN",
    "MARIO MONTERO",
    "LUIS RUBIANO",
    "DIANA SIERRA",
    "ANGIE LEON",
    "JHONATAN PARRA",
    "DUMAR NUÑEZ",
    "DANIEL PEREZ",
    "SERGIO ROCHA",
    "DIEGO MENDIETA",
    "DIEGO FORERO",
    "ERIKA GALEANO",
    "DUMAR NUÑEZ",
    "ANDRES PEÑA",
    "DANIEL HERNANDEZ",
    "JULIETH REYES",
    "MAURY RAMIREZ",
    "ANGIE CASTILLO",
    "MARIA MERCHAN",
    "ANGELICA GOMEZ",
    "LUISA PEÑA",
    "SERGIO ROCHA",
    "ANGIE GUTIERREZ",
    "NOHORA CASTRO",
    "BRIGITH ACEVEDO",
    "ANGIE GARCIA",
    "FANNY ROBLES",
    "DUVAN FORERO",
    "LEIDI CAMARGO",
    "ANGIE ACOSTA",
    "SAREN BELLO",
    "PAOLA MACANA",
    "ANYI HERNANDEZ",
    "YESENIA PALACIOS",
    "LIGIA HUERTAS",
    "NIKOL SARMIENTO",
    "DIANA RUBIANO",
    "YURLEY REYES",
    "ANTONIO RUIZ",
    "ESTEFANIA REALPE"
];

coodinador.addEventListener('click', async () => {
    let arrayCodigos = [];
    const aux = await datosTCodigos();
    if (aux.message == "error") {
        aviso("No hay registros de actividades de los coordinadores", "warning");
        return;
    }
    console.log(aux);
    let datosFinales = [];
    nombresApellidos.forEach((nombre) => {
        aux.codigo.forEach((doc) => {
            if (doc.generadoPor == nombre) {
                datosFinales.push(doc);
            }
        }
        );

    });
    console.log(datosFinales);

    // Crear un objeto para almacenar los datos por mes
    const datosPorMes = {};

    datosFinales.forEach((doc) => {
        const fechaGenerado = new Date(doc.fechaGenerado);
        const mes = fechaGenerado.getMonth() + 1; // Meses comienzan en 0
    
        // Crear una hoja para el mes si aún no existe
        if (!datosPorMes[mes]) {
            datosPorMes[mes] = [['Concepto', 'Concepto Palabra Clave', 'Cedula Quien Pide', 'Codigo', 'Codigo Descontado', 'Cuotas', 'Ejecutado Por', 'Estado', 'Fecha Ejecutado', 'Fecha Generado', 'Generado Por', 'Hora Generado', 'Monto']];
        }
    
        const docData = doc;
        let estado = "";
        if (docData.estado == true) {
            estado = "Pendiente";
        } else if (docData.estado == false) {
            estado = "Ejecutado";
        }
        
        // Determinar el valor de "Concepto Palabra Clave"
        let conceptoPalabraClave = "";
        if (docData.Concepto.startsWith("Mercado")) {
            conceptoPalabraClave = "Mercado";
        } else if (docData.Concepto.startsWith("Autorizacion")) {
            conceptoPalabraClave = "Prestamo dinero";
        }
        
        datosPorMes[mes].push([
            docData.Concepto,
            conceptoPalabraClave, // Agregar la nueva columna
            docData.cedulaQuienPide,            
            docData.codigo,
            docData.codigoDescontado,
            Number(docData.cuotas),
            docData.ejecutadoPor,
            estado,
            docData.fechaEjecutado,
            docData.fechaGenerado,           
            docData.generadoPor,
            docData.horaGenerado,
            docData.monto,
        ]);
    });
    
    // Crear un archivo Excel con hojas separadas por mes
    const wb = XLSX.utils.book_new();
    for (const mes in datosPorMes) {
        if (datosPorMes.hasOwnProperty(mes)) {
            const ws = XLSX.utils.aoa_to_sheet(datosPorMes[mes]);
            XLSX.utils.book_append_sheet(wb, ws, `DetalleM_${mes}`);
        }
    }
    
    // Generar el archivo Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const element = document.createElement('a');
    element.href = url;
    element.download = 'DetalleCoodinadores.xlsx';
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    
});






