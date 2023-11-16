import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");

if (usernameLocal == "YENY SOTELO" || "HEIDY TORRES") {
    mercado.style.display = "inline-block"
}
else {
    mercado.style.display = "none"
}

//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
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

boton.addEventListener('click', async () => {

    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    const datosbase = await datos();
    if (fechaInicio == "") {
        aviso("Debe seleccionar las fechas", "warning");
        return;
    }

    // si la fecha de fin es mayor a la fecha actual
    if (fechaFin > new Date().toISOString().slice(0, 10)) {
        aviso("La fecha fin no puede ser mayor a la fecha actual", "warning");
        return;
    }

    // si la fecha final esta vacia
    if (fechaFin == "") {
        // realizar el reporte solo con la fecha de inicio

        const aux = await THistorial();

        // guardar todos los regitro donde tengan la frase "Compra tienda de Ferias" y la palabra SUBA

        let datosFinales = [];
        aux.historial.forEach((doc) => {
            if (doc.concepto.includes("SUBA")) {
                datosFinales.push(doc);
            }
        });

        if (datosFinales.length == 0) {
            aviso("No hay registros de ferias de Suba", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }


        // guardar los registro que tenga la fecha de inicio, la fecha de inicio esta en foto de string yyyy-mm-dd
        let datosFinalesFecha = [];
        datosFinales.forEach((doc) => {
            if (doc.fechaEfectuado = fechaInicio) {
                datosFinalesFecha.push(doc);
            }
        });


        if (datosFinalesFecha.length == 0) {
            aviso("No hay registros de ferias de Suba para esa fecha", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }

        // Mapeo de palabras clave a columnas
        const palabrasClaveColumnas = {
            "Pollo Suba": "Pollo Suba",
            "Pollo Luz": "Pollo Luz",
            "Dary Embutidos Luz Dary": "Embutidos Luz Dary",
            "Emb carmen": "Emb carmen",
            "Fruver": "Fruver",
            "Fruver Carmen": "Fruver Carmen",
            "Embutidos": "Embutidos",
            "Carne": "Carne",
            "Babuchas": "Babuchas"
        };

        // Crear el encabezado del Excel
        const encabezadoExcel = ["Fecha", "Cedula", "Nombre", "Finca", "Mercado", ...Object.values(palabrasClaveColumnas)];

        // Crear un objeto que almacene los resultados por cada cedula
        const resultadosPorCedula = {};

        // Procesar los datos
        datosFinalesFecha.forEach((docData) => {
            const cedula = docData.cedula.toUpperCase(); // Convertir a mayúsculas

            const nombreEncontrado = datosbase.datosbase.find((persona) => persona.numero_de_documento.toUpperCase() === cedula);
            const nombre = nombreEncontrado ? nombreEncontrado.nombre : '';
            const finca = nombreEncontrado ? nombreEncontrado.finca : '';
            console.log(nombreEncontrado);

            // Verificar si la cedula ya existe en los resultados
            if (!resultadosPorCedula[cedula]) {
                // Inicializar un nuevo objeto para la cedula
                resultadosPorCedula[cedula] = {
                    Fecha: docData.fechaEfectuado,
                    Cedula: docData.cedula,
                    Nombre: nombre, // Agregar el nombre aquí                    ,
                    Finca: finca,  // Asigna el valor correspondiente si está disponible en tus datos
                    Mercado: docData.valor,  // Asigna el valor correspondiente si está disponible en tus datos
                };

                // Inicializar las columnas de palabras clave
                Object.keys(palabrasClaveColumnas).forEach((palabraClave) => {
                    resultadosPorCedula[cedula][palabrasClaveColumnas[palabraClave]] = "";
                });
            }

            // Verificar si el concepto contiene alguna palabra clave
            Object.keys(palabrasClaveColumnas).forEach((palabraClave) => {
                if (docData.concepto.includes(palabraClave)) {
                    // Asignar el valor correspondiente a la columna
                    resultadosPorCedula[cedula][palabrasClaveColumnas[palabraClave]] = docData.valor;
                }
            });
        });

        // Convertir los resultados a un arreglo
        const resultadosArray = Object.values(resultadosPorCedula);

        // Crear un libro de Excel y agregar una hoja de datos
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(resultadosArray, { header: encabezadoExcel });
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');

        // Guardar el libro como un archivo Excel con el nombre "resultados" y la fecha inicial
        XLSX.writeFile(wb, `resultados-${fechaInicio}.xlsx`);

    }

    else {
        // realizar el reporte solo con la fecha de inicio

        const aux = await THistorial();

        // guardar todos los regitro donde tengan la frase "Compra tienda de Ferias" y la palabra SUBA

        let datosFinales = [];
        aux.historial.forEach((doc) => {
            if (doc.concepto.includes("SUBA")) {
                datosFinales.push(doc);
            }
        });

        if (datosFinales.length == 0) {
            aviso("No hay registros de ferias de Suba", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }


        // guardar los registro que tenga la fecha de inicio, la fecha de inicio esta en foto de string yyyy-mm-dd
        let datosFinalesFecha = [];
        // Convertir las fechas a objetos Date
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        console.log(fechaInicioObj);
        console.log(fechaFinObj);

        datosFinales.forEach((doc) => {
            const fechaEfectuadoObj = new Date(doc.fechaEfectuado);

            // Verificar si la fecha está en el rango
            if (fechaEfectuadoObj >= fechaInicioObj && fechaEfectuadoObj <= fechaFinObj) {
                datosFinalesFecha.push(doc);
            }
        });



        if (datosFinalesFecha.length == 0) {
            aviso("No hay registros de ferias de Suba para esa fecha", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }

        // Mapeo de palabras clave a columnas
        const palabrasClaveColumnas = {
            "Pollo Suba": "Pollo Suba",
            "Pollo Luz": "Pollo Luz",
            "Dary Embutidos Luz Dary": "Embutidos Luz Dary",
            "Emb carmen": "Emb carmen",
            "Fruver": "Fruver",
            "Fruver Carmen": "Fruver Carmen",
            "Embutidos": "Embutidos",
            "Carne": "Carne",
            "Babuchas": "Babuchas"
        };

        // Crear el encabezado del Excel
        const encabezadoExcel = ["Fecha", "Cedula", "Nombre", "Finca", "Mercado", ...Object.values(palabrasClaveColumnas)];

        // Crear un objeto que almacene los resultados por cada cedula
        const resultadosPorCedula = {};

        // Procesar los datos
        datosFinalesFecha.forEach((docData) => {
            const cedula = docData.cedula.toLowerCase(); // Convertir a minúsculas

            const nombreEncontrado = datosbase.datosbase.find((persona) => persona.numero_de_documento.toLowerCase() === cedula);
            const nombre = nombreEncontrado ? nombreEncontrado.nombre : '';
            const finca = nombreEncontrado ? nombreEncontrado.finca : '';


            // Verificar si la cedula ya existe en los resultados
            if (!resultadosPorCedula[cedula]) {
                // Inicializar un nuevo objeto para la cedula
                resultadosPorCedula[cedula] = {
                    Fecha: docData.fechaEfectuado,
                    Cedula: docData.cedula,
                    Nombre: nombre, // Agregar el nombre aquí                    ,
                    Finca: finca,  // Asigna el valor correspondiente si está disponible en tus datos
                    Mercado: docData.valor,  // Asigna el valor correspondiente si está disponible en tus datos
                };

                // Inicializar las columnas de palabras clave
                Object.keys(palabrasClaveColumnas).forEach((palabraClave) => {
                    resultadosPorCedula[cedula][palabrasClaveColumnas[palabraClave]] = "";
                });
            }

            // Verificar si el concepto contiene alguna palabra clave
            Object.keys(palabrasClaveColumnas).forEach((palabraClave) => {
                if (docData.concepto.includes(palabraClave)) {
                    // Asignar el valor correspondiente a la columna
                    resultadosPorCedula[cedula][palabrasClaveColumnas[palabraClave]] = docData.valor;
                }
            });
        });

        // Convertir los resultados a un arreglo
        const resultadosArray = Object.values(resultadosPorCedula);

        // Crear un libro de Excel y agregar una hoja de datos
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(resultadosArray, { header: encabezadoExcel });
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');

        // Guardar el libro como un archivo Excel
        XLSX.writeFile(wb, 'resultados.xlsx');
    }


});

// Función para formatear la cédula según tus requisitos
function formatCedula(cedula) {
    // Verificar si la cédula ya tiene un prefijo alfanumérico
    if (isNaN(cedula.charAt(0))) {
        return cedula;
    } else {
        // Agregar un prefijo alfanumérico si no lo tiene
        return 'X' + cedula;
    }
}