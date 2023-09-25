import { urlBack } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";

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

/* Obtener codigos de la base de datos */
const aux = await datosTCodigos();
let arrayCodigos = [];

aux.codigo.forEach((c) => {
    if (c.ceduladelGenerador_id == uid) {
        arrayCodigos.push(c);
    }
});

console.log(arrayCodigos);

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

    for (const fecha in historialPorFecha) {
        const historialFecha = historialPorFecha[fecha].registros;

        const excelData = [['Cedula', 'Codigo', 'Concepto', 'Cuotas', 'Fecha Efectuado', 'Generado Por', 'Hora Efectuado', 'Nombre Quien Entregó', 'Valor']];

        historialFecha.forEach((h) => {
            excelData.push([
                h.cedula,
                h.codigo,
                h.concepto,
                Number(h.cuotas),
                h.fechaEfectuado,
                h.generadopor,
                h.horaEfectuado,
                h.nombreQuienEntrego,
                Number(h.valor)
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, fecha);
    }

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