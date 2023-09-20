
import { urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";


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
            // Obtener el mes y el día de la fecha en formato 'YYYY-MM-DD'
            const fechaParts = doc.fechaEfectuado.split('-');
            const mes = fechaParts[1];
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
                    Number(doc.cuotas),
                    doc.fechaEfectuado,
                    doc.nombreQuienEntrego,
                    Number(doc.valor)
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
});

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
    "ESTEFANIA REALPE",
    "CARLOS ROJAS",
    "KAREN RAMIREZ",
    "ANGELA MARIA ALDANA",
    "SEBASTIAN RODRIGUEZ",
    "ERIKA GUERRERO",
    "CAMILA GARCIA",
    "ANDREA DIAZ",
    "VALENTINA GUILLEN",
    "KAREN RIQUETT",
    "ANGELICA GOMEZ",
    "CAROL PALACIOS",
    "LEIDY VANESA QUIÑONES"
];

coodinador.addEventListener('click', async () => {
    let arrayCodigos = [];
    const aux = await datosTCodigos();
    if (aux.message == "error") {
        aviso("No hay registros de actividades de los coordinadores", "warning");
        return;
    }
    let datosFinales = [];
    nombresApellidos.forEach((nombre) => {
        aux.codigo.forEach((doc) => {
            if (doc.generadoPor == nombre) {
                datosFinales.push(doc);
            }
        });
    });

    if (datosFinales.length == 0) {
        aviso("No hay registros de actividades de los coordinadores", "warning");
        return;
    }

    // Crear un objeto para almacenar los datos por quincena de forma dinámica
    const datosPorQuincena = {};

    datosFinales.forEach((doc) => {
        const fechaGenerado = new Date(doc.fechaGenerado);
        const dia = fechaGenerado.getDate(); // Obtener el día del mes
        const mes = fechaGenerado.getMonth() + 1; // Obtener el mes

        // Determinar la quincena según el día del mes
        const quincena = dia >= 13 ? `Quincena_${mes}_1` : `Quincena_${mes}_2`;

        if (!datosPorQuincena[quincena]) {
            datosPorQuincena[quincena] = [['Concepto', 'Concepto Palabra Clave', 'Cedula Quien Pide', 'Codigo', 'Codigo Descontado', 'Cuotas', 'Ejecutado Por', 'Estado', 'Fecha Ejecutado', 'Fecha Generado', 'Generado Por', 'Hora Generado', 'Monto']];
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

        datosPorQuincena[quincena].push([
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
            Number(docData.monto),
        ]);
    });

    // Crear una hoja de resumen
    const resumenSheet = [['Generado Por', 'Total Pendiente', 'Total Ejecutado', 'Rol']];

    // Crear un objeto para almacenar el recuento de registros por Generado Por y Rol
    const countByGeneradoPorYRol = {};

    datosFinales.forEach((doc) => {
        const generadoPor = doc.generadoPor;
        const estado = doc.estado ? 'Pendiente' : 'Ejecutado';

        // Determinar el rol de la persona
        const rol = nombresApellidos.indexOf(generadoPor) >= 40 ? 'JEFE DE AREA' : 'COORDINADOR';

        // Inicializar el contador para el Generado Por y Rol si aún no existe
        if (!countByGeneradoPorYRol[generadoPor]) {
            countByGeneradoPorYRol[generadoPor] = { 'COORDINADOR': { 'Pendiente': 0, 'Ejecutado': 0 }, 'JEFE DE AREA': { 'Pendiente': 0, 'Ejecutado': 0 } };
        }

        // Incrementar el contador correspondiente para el rol y el estado
        countByGeneradoPorYRol[generadoPor][rol][estado] += 1;

        // Llenar la hoja de resumen con los valores de recuento, el rol y el estado
    });

    // Calcular el resumen acumulado
    for (const generadoPor in countByGeneradoPorYRol) {
        const rol = nombresApellidos.indexOf(generadoPor) >= 40 ? 'JEFE DE AREA' : 'COORDINADOR';

        let totalPendiente = 0;
        let totalEjecutado = 0;

        for (const estado in countByGeneradoPorYRol[generadoPor][rol]) {
            if (estado === 'Pendiente') {
                totalPendiente += countByGeneradoPorYRol[generadoPor][rol][estado];
            } else {
                totalEjecutado += countByGeneradoPorYRol[generadoPor][rol][estado];
            }
        }

        resumenSheet.push([generadoPor, totalPendiente, totalEjecutado, rol]);
    }

    // Crear un archivo Excel con hojas separadas por quincena y la hoja de resumen
    const wb = XLSX.utils.book_new();

    // Agregar la hoja de resumen al libro Excel
    const resumenWs = XLSX.utils.aoa_to_sheet(resumenSheet);
    XLSX.utils.book_append_sheet(wb, resumenWs, 'Resumen');

    for (const quincena in datosPorQuincena) {
        if (datosPorQuincena.hasOwnProperty(quincena)) {
            const ws = XLSX.utils.aoa_to_sheet(datosPorQuincena[quincena]);
            XLSX.utils.book_append_sheet(wb, ws, quincena);
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

async function escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, tipo, codigo, generadoPor) {
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
                    cedula: cedulaEmpleado,
                    nombreQuienEntrego: '',
                    generadopor: generadoPor,
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

function esCodigoValido(fechaGeneradoStr) {
    const hoy = new Date(); // Obtiene la fecha actual
    const fechaGenerado = new Date(fechaGeneradoStr);
    const diaGenerado = fechaGenerado.getDate();
    const diaLimite = diaGenerado <= 13 ? 27 : 13;

    if (diaGenerado <= diaLimite || diaGenerado === 13) {
        // El código es válido
        return true;
    } else {
        // El código no es válido
        return false;
    }
}

let isFunctionExecuting = false; // Variable para rastrear si la función está en ejecución


boton.addEventListener('click', async (e) => {

    e.preventDefault();

    if (isFunctionExecuting) {
        // Puedes mostrar un mensaje o simplemente regresar sin hacer nada
        aviso('Se esta ejecutando la funcion', 'warning');
        return;
    }

    isFunctionExecuting = true; // Marcar la función como en ejecución

    // capturar los datos del formulario
    let cedulaEmpleado = document.querySelector('#cedula').value;
    let codigoP = document.querySelector('#codigo').value;
    let valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');
    let cuotas = document.querySelector('#cuotas').value;

    let concepto2;

    if (codigoP == '') {
        isFunctionExecuting = false;
        aviso('El campo codigo no puede estar vacio', 'error');
    }

    // valor no sea 
    if (valor == '') {
        isFunctionExecuting = false;
        aviso('El campo codigo no puede estar vacio', 'error');
    }

    if (cuotas == "") {
        isFunctionExecuting = false;
        aviso('Ups no se pueden generar mercado, las cuotas no pueden estar vacias', 'error');
        return;
    }

    const aux = await datosTCodigos();
    console.log(aux.codigo);
    let aux2 = await datosEmpleado(cedulaEmpleado);
    console.log(aux2.datosbase[0]);
    let usuario = aux2.datosbase[0];
    console.log(usuario);

    const cod = obtenerCodigo(codigoP, aux.codigo);

    /*if (!esCodigoValido(cod.fechaGenerado)) {
        aviso('El codigo ya expiro', 'error');
        return;
    }*/

    if (!verificarCodigo(codigoP, aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El código no existe', 'error');
        return;
    }
    if (!verificarCodigoEstado(codigoP, aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El código ya fue usado', 'error');
        return;
    }
    if (!verificarCedula(codigoP, cedulaEmpleado, aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El código no pertenece a este empleado', 'error');
        return;
    }
    if (!verificaMonto(parseInt(nuevovalor), aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El monto del prestamo es mayor al permitido generado con el código ', 'error');
        return;
    }
    if (!verificaSiesUnPrestamo(codigoP)) {
        isFunctionExecuting = false;
        aviso('El código no es valido solo se admiten prestamos', 'error');
        return;
    }


    else {
        let concepto = null;
        concepto2 = 'Dinero_Autorizacion';
        concepto = 'Libranza_Prestamo_Dinero';

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
        await actualizarDatosBase(concepto2, nuevovalor, cuotas, cedulaEmpleado);
        await CambiarEstado(cod.codigo, nuevovalor, codigo);
        await escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, concepto, codigo, cod.generadoPor)
        await sleep(2000); // Pausa de 2 segundos
        await ActualizarHistorial(codigo);
        await sleep(4000); // Pausa de 2 segundos
        document.getElementById('successSound').play();

        isFunctionExecuting = false;

        let confirmacion = await avisoConfirmado('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + codigo, 'success');

        if (confirmacion) {
            // recargar la pagina
            location.reload();
        }
    }

});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}









