
import { datosbase, urlBack } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";


// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const empleados = localStorage.getItem("CantidadEmpleados");
const codigos = localStorage.getItem("CantidadSolicitudes");
const numCoordinadoresConestadoSolicitudesTrue = localStorage.getItem("CantidadCoordinadoresConEstadoSolicitudesTrue");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');

let extrae = document.getElementById("extrae");
let extraeT = document.getElementById("extraeT");

let input = document.getElementById('archivoInput');

let datosFinales = [];

const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');

var h1Elemento = document.querySelector('#cont');


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


// Base total de empleados
numeroTotal.innerHTML = empleados;


/* Obtener codigos de la base de datos */
// Numero de codigos activos de la base de datos del coodinador

numeroSolicitudesPendientes.innerHTML = codigos;


numeroCoordinadores.innerHTML = numCoordinadoresConestadoSolicitudesTrue;


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
        ['','','','','','','','ANTERIOR', '', 'PARA DESCONTAR', '', '', '','','','','','','', 'PARA HACER', '', '', '', '', '', '', '', ''],
        ['CÓDIGO', 'CÉDULA', 'NOMBRE', 'INGRESO', 'TEMPORAL', 'FINCA', 'SALARIO', 'SALDOS', 'FONDOS', 'MERCADOS', 'CUOTAS MERCADOS', 'PRESTAMO PARA DESCONTAR', 'CUOTAS PRESTAMOS PARA DESCONTAR', 'CASINO', 'ANCHETAS', 'CUOTAS ANCHETAS', 'FONDO', 'CARNET', 'SEGURO FUNERARIO', 'PRESTAMO PARA HACER', 'CUOTAS PRESTAMO PARA HACER', 'ANTICIPO LIQUIDACIÓN', 'CUENTAS'],
    ];
    
    console.log(datosExtraidos.datosbase);

    datosExtraidos.datosbase.forEach((doc) => {
        const docData = doc;
        excelData.push([
            docData.codigo,
            docData.numero_de_documento,
            docData.nombre,
            docData.ingreso,
            docData.temporal,
            docData.finca,
            docData.salario,
            docData.saldos,
            docData.fondos,
            docData.mercados,
            docData.cuotasMercados,
            docData.prestamoParaDescontar,
            docData.cuotasPrestamosParaDescontar,
            docData.casino,
            docData.valoranchetas,
            docData.cuotasAnchetas,
            docData.fondo,
            docData.carnet,
            docData.seguroFunerario,
            docData.prestamoParaHacer,
            docData.cuotasPrestamoParahacer,
            docData.anticipoLiquidacion,
            docData.cuentas
        ]);
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

extraeC.addEventListener('click', async () => {
    datosFinales = [];

    const aux = await datosTCodigos();
    console.log(aux.codigo);

    aux.codigo.forEach((doc) => {
        if (doc.estado == true) {
            datosFinales.push(doc);
        }
    });

    let excelData = [['Código', 'Cédula quien pidió', 'Nombre persona quien dio el código', 'Valor', 'Cuotas', 'Fecha']];
    
    datosFinales.forEach((doc) => {
        excelData.push([
            doc.codigo,
            doc.cedulaQuienPide,
            doc.generadoPor,
            doc.monto,
            doc.cuotas,
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
    
    if (datosExtraidos.message == "error" ) {
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

input.addEventListener('change', () => {
    let archivo = input.files[0];
    let reader = new FileReader();
    var h1Elemento = document.getElementById("cont");

    /* leer archivo .csv */
    reader.readAsText(archivo);

    reader.onload = () => {
        let info = reader.result;
        /* Separar por saltos de línea */
        let datos = info.split('\n');

        // Array para almacenar los datos finales
        let datosFinales = [];

        datos.forEach(dato => {
            // Separar por tabulaciones y remplazar espacios vacíos por "0"
            let fila = dato.split('\t').map(item => item.trim() === '' ? "0" : item.trim());
            datosFinales.push(fila);
        });

        // Mostrar elementos ocultos
        over.style.display = "block";
        loader.style.display = "block";
        h1Elemento.style.display = "block";

        // Eliminar las primeras 4 filas (si es necesario)
        console.log(datosFinales);
        datosFinales.splice(0, 4);

        // Guardar los datos finales
        guardarDatos(datosFinales);
    };
});

async function guardarDatos(datosFinales) {

    var body = localStorage.getItem('key');
    console.log(body);
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
            .then(response => {
                if (response.ok) {
                    aviso("Datos guardados correctamente", "success");
                    over.style.display = "none";
                    loader.style.display = "none";
                    h1Elemento.style.display = "none";
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                    return response.json();
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
        console.error('Error en la petición HTTP PUT');
        console.error(error);
    }


}

/* Obtener estado de las solicitudes */
var estado = localStorage.getItem("estadoQuincena");
if (estado == 'true') {
    document.getElementById("myonoffswitch").checked = false;
}
else {
    document.getElementById("myonoffswitch").checked = true;
}

/*Inabilitar permisos*/
document.getElementById("myonoffswitch").addEventListener("click", async function (event) {

    // editar en el local storage
    if (this.checked) {
        localStorage.setItem("estadoQuincena", "false");
        aviso('Has desbloqueado el acceso', 'success');
    }
    else {
        localStorage.setItem("estadoQuincena", "true");
        aviso('Has bloqueado el acceso', 'success');
    }

    var body = localStorage.getItem('key');
    console.log(body);
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);
    const urlcompleta = urlBack.url + '/usuarios/tesoreria/cambioEstado';
    var checked;
    console.log(this.checked);

    if (this.checked) {
        checked = "True";
    } else {
        checked = "False";
    }

    try {
        fetch(urlcompleta, {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json',
                //Authorization: jwtToken,

            },
            body:
                JSON.stringify({
                    estado: checked,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición GET');
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

});




