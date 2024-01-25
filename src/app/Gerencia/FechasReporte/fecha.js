import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");

const correo = localStorage.getItem("correo_electronico");
if (correo == "a.sotelotualianza@gmail.com" || correo == "contaduria.rtc@gmail.com") {
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

let coodinador = document.getElementById("boton");

async function ordenaryfiltrar(dato) {
    // ordenar por rol 
    dato.sort(function (a, b) {
        if (a.rol > b.rol) {
            return 1;
        }
        if (a.rol < b.rol) {
            return -1;
        }
        return 0;
    });

    // Quitar ADMIN, BOT, COMERCIALIZADORA, GERENCIA

    dato = dato.filter((doc) => {
        return doc.rol !== "ADMIN" 
        && doc.rol !== "BOT" 
        && doc.rol !== "COMERCIALIZADORA" 
        && doc.rol !== "GERENCIA" 
        && doc.rol !== "CONTRATACIONSELECCIONGENERAL" 
        && doc.rol !== "RECEPCION"
        && doc.rol !== "SIN-ASIGNAR"
        && doc.rol !== "TESORERIA"
        && doc.rol !== "TIENDA";
    });

    // pegar primer nombre y primer apellido, colocar tambien el rol en un nuevo array para enviar
    let datosFinales = [];
    let nombreCompleto = "";
    dato.forEach((doc) => {
        nombreCompleto = doc.primer_nombre + " " + doc.primer_apellido;
        datosFinales.push({
            "nombre": nombreCompleto,
            "rol": doc.rol
        });
    });    

    return datosFinales;
}

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

coodinador.addEventListener('click', async () => {

    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let usuarios = await datosUsuarios();


    let rolesAsignados = await ordenaryfiltrar(usuarios);
    console.log(usuarios);

    let nombresApellidos = [];
    rolesAsignados.forEach((doc) => {
        nombresApellidos.push(doc.nombre);
    });

    if (fechaInicio == "") {
        aviso("Debe seleccionar las fechas", "warning");
        return;
    }

    // si la fecha de fin es mayor a la fecha actual
    if (fechaFin > new Date().toISOString().slice(0, 10)) {
        aviso("La fecha fin no puede ser mayor a la fecha actual", "warning");
        return;
    }

    if (fechaFin == "") {
        const aux = await datosTCodigos();

        if (aux.message == "error") {
            aviso("No hay registros de actividades de los coordinadores", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }
        let datosFinales = [];

        nombresApellidos.forEach((nombre) => {
            aux.historial.forEach((doc) => {
                if (doc.generadopor == nombre) {
                    datosFinales.push(doc);
                }
            });
        });

        if (datosFinales.length == 0) {
            aviso("No hay registros de actividades de los coordinadores", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }

        // sacar los datos de los coordinadores donde la fecha de inicio sea igual a fechaEfectuado
        let datosFinalesFecha = [];
        datosFinales.forEach((doc) => {
            const fechaGenerado = new Date(doc.fechaEfectuado);
            const fechaInicioDate = new Date(fechaInicio);
            if (fechaGenerado.getTime() == fechaInicioDate.getTime()) {
                datosFinalesFecha.push(doc);
            }
        });

        if (datosFinalesFecha.length == 0) {
            aviso("No hay registros de actividades de los coordinadores para esa fecha", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }

        // crear objeto donde se guardaran los datos de cada coordinador por separado teniendo en cuenta la fecha de inicio
        const datosAgrupados = {};


        datosFinalesFecha.forEach((item) => {
            const key = item.generadopor;

            if (!datosAgrupados[key]) {
                datosAgrupados[key] = [];
            }

            datosAgrupados[key].push(item);
        });

        // agrupar por generadoPor sumar los montos
        let datosFinalesFechaGeneradoPor = [];
        let datosFinalesFechaGeneradoPorSuma = [];

        datosFinalesFecha.forEach((doc) => {
            const generadoPor = doc.generadopor;
            if (datosFinalesFechaGeneradoPor.includes(generadoPor)) {
                // no hacer nada
            } else {
                datosFinalesFechaGeneradoPor.push(generadoPor);
            }
        });



        let sumaAutorizado = 0;
        let sumaEjecutado = 0;

        datosFinalesFechaGeneradoPor.forEach((doc) => {
            sumaAutorizado = 0;
            sumaEjecutado = 0;

            datosFinalesFecha.forEach((doc2) => {
                if (doc == doc2.generadopor) {
                    if (doc2.nombreQuienEntrego !== null) {
                        sumaEjecutado += parseInt(doc2.valor);
                    }
                    else {
                        sumaAutorizado += parseInt(doc2.valor);
                    }

                }
            });

            datosFinalesFechaGeneradoPorSuma.push({
                "generadoPor": doc,
                "valorAutorizado": sumaAutorizado,
                "valorEjecutado": sumaEjecutado
            });
        });

        let datosFinalesFechaGeneradoPorSumaRol = [];
        let nombresProcesados = new Set();

        datosFinalesFechaGeneradoPorSuma.forEach((doc) => {
            const nombre = doc.generadoPor;
            rolesAsignados.forEach((doc2) => {
                if (doc2.nombre == nombre && !nombresProcesados.has(nombre)) {
                    datosFinalesFechaGeneradoPorSumaRol.push({
                        "Generado Por": doc.generadoPor,
                        "Rol": doc2.rol,
                        "valor Ejecutado": doc.valorEjecutado
                    });
                    nombresProcesados.add(nombre); // Marcar el nombre como procesado
                }
            });
        });

        // Crear un libro Excel
        const wb = XLSX.utils.book_new();

        const datosParaHoja = [
            ["Generado Por", "Rol", "Total Vendido o Autorizado"]
        ];

        datosFinalesFechaGeneradoPorSumaRol.forEach((doc) => {
            datosParaHoja.push([
                doc["Generado Por"],
                doc.Rol,
                Number(doc["valor Ejecutado"]),
            ]);
        });

        // Ahora puedes usar `aoa_to_sheet` con `datosParaHoja`
        const ws = XLSX.utils.aoa_to_sheet(datosParaHoja);

        // Luego, agrega la hoja al libro Excel
        XLSX.utils.book_append_sheet(wb, ws, 'Resumen');

        // Crear hojas internas para cada coordinador agrupado
        for (const nombreCoordinador in datosAgrupados) {
            if (datosAgrupados.hasOwnProperty(nombreCoordinador)) {
                const datosCoordinador = datosAgrupados[nombreCoordinador];

                datosCoordinador.forEach((dato) => {
                    // Convertir cedula a string para garantizar que charAt funcione
                    const cedulaString = String(dato.cedula);

                    // Si la cédula comienza con un número, convertir a número, de lo contrario, dejar como texto
                    if (!isNaN(cedulaString.charAt(0))) {
                        dato.cedula = Number(cedulaString);
                    } else {
                        dato.cedula = cedulaString; // Dejar como texto
                    }
                    dato.valor = Number(dato.valor);
                });



                const ws = XLSX.utils.json_to_sheet(datosCoordinador);

                // Agregar hoja al libro de trabajo
                XLSX.utils.book_append_sheet(wb, ws, nombreCoordinador);
            }
        }



        // Generar el archivo Excel
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const element = document.createElement('a');
        element.href = url;
        element.download = 'DetalleCoordinadores.xlsx';
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    }

    // si la fecha final esta vacia
    else {
        const aux = await datosTCodigos();

        if (aux.message == "error") {
            aviso("No hay registros de actividades de los coordinadores", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }
        let datosFinales = [];

        nombresApellidos.forEach((nombre) => {
            aux.historial.forEach((doc) => {
                if (doc.generadopor == nombre) {
                    datosFinales.push(doc);
                }
            });
        });

        if (datosFinales.length == 0) {
            aviso("No hay registros de actividades de los coordinadores", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }

        // sacar los datos de los coordinadores donde la fecha de inicio sea igual a fechaEfectuado
        let datosFinalesFecha = [];
        datosFinales.forEach((doc) => {
            const fechaGenerado = new Date(doc.fechaEfectuado);
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);
            if (fechaGenerado >= fechaInicioDate && fechaGenerado <= fechaFinDate) {
                datosFinalesFecha.push(doc);
            }
        });

        if (datosFinalesFecha.length == 0) {
            aviso("No hay registros de actividades de los coordinadores para esa fecha", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }

        // crear objeto donde se guardaran los datos de cada coordinador por separado teniendo en cuenta la fecha de inicio
        const datosAgrupados = {};


        datosFinalesFecha.forEach((item) => {
            const key = item.generadopor;

            if (!datosAgrupados[key]) {
                datosAgrupados[key] = [];
            }

            datosAgrupados[key].push(item);
        });

        console.log(datosAgrupados);


        // agrupar por generadoPor sumar los montos
        let datosFinalesFechaGeneradoPor = [];
        let datosFinalesFechaGeneradoPorSuma = [];

        datosFinalesFecha.forEach((doc) => {
            const generadoPor = doc.generadopor;
            if (datosFinalesFechaGeneradoPor.includes(generadoPor)) {
                // no hacer nada
            } else {
                datosFinalesFechaGeneradoPor.push(generadoPor);
            }
        });



        let sumaAutorizado = 0;
        let sumaEjecutado = 0;

        datosFinalesFechaGeneradoPor.forEach((doc) => {
            sumaAutorizado = 0;
            sumaEjecutado = 0;

            datosFinalesFecha.forEach((doc2) => {
                if (doc == doc2.generadopor) {
                    if (doc2.nombreQuienEntrego !== null) {
                        sumaEjecutado += parseInt(doc2.valor);
                    }
                    else {
                        sumaAutorizado += parseInt(doc2.valor);
                    }

                }
            });

            datosFinalesFechaGeneradoPorSuma.push({
                "generadoPor": doc,
                "valorAutorizado": sumaAutorizado,
                "valorEjecutado": sumaEjecutado
            });
        });

        console.log(datosFinalesFechaGeneradoPorSuma)

        let datosFinalesFechaGeneradoPorSumaRol = [];
        let nombresProcesados = new Set();

        datosFinalesFechaGeneradoPorSuma.forEach((doc) => {
            const nombre = doc.generadoPor;
            rolesAsignados.forEach((doc2) => {
                if (doc2.nombre == nombre && !nombresProcesados.has(nombre)) {
                    datosFinalesFechaGeneradoPorSumaRol.push({
                        "Generado Por": doc.generadoPor,
                        "Rol": doc2.rol,
                        "valor Ejecutado": doc.valorEjecutado
                    });
                    nombresProcesados.add(nombre); // Marcar el nombre como procesado
                }
            });
        });
        console.log(datosFinalesFechaGeneradoPorSumaRol)

        // Crear un libro Excel
        const wb = XLSX.utils.book_new();

        const datosParaHoja = [
            ["Generado Por", "Rol", "Total Vendido o Autorizado"]
        ];

        datosFinalesFechaGeneradoPorSumaRol.forEach((doc) => {
            datosParaHoja.push([
                doc["Generado Por"],
                doc.Rol,
                Number(doc["valor Ejecutado"]),
            ]);
        });

        // Ahora puedes usar `aoa_to_sheet` con `datosParaHoja`
        const ws = XLSX.utils.aoa_to_sheet(datosParaHoja);

        // Luego, agrega la hoja al libro Excel
        XLSX.utils.book_append_sheet(wb, ws, 'Resumen');

        // Crear hojas internas para cada coordinador agrupado
        for (const nombreCoordinador in datosAgrupados) {
            if (datosAgrupados.hasOwnProperty(nombreCoordinador)) {
                const datosCoordinador = datosAgrupados[nombreCoordinador];

                datosCoordinador.forEach((dato) => {
                    // Convertir cedula a string para garantizar que charAt funcione
                    const cedulaString = String(dato.cedula);

                    // Si la cédula comienza con un número, convertir a número, de lo contrario, dejar como texto
                    if (!isNaN(cedulaString.charAt(0))) {
                        dato.cedula = Number(cedulaString);
                    } else {
                        dato.cedula = cedulaString; // Dejar como texto
                    }
                    dato.valor = Number(dato.valor);
                });






                const ws = XLSX.utils.json_to_sheet(datosCoordinador);

                // Agregar hoja al libro de trabajo
                XLSX.utils.book_append_sheet(wb, ws, nombreCoordinador);
            }
        }



        // Generar el archivo Excel
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const element = document.createElement('a');
        element.href = url;
        element.download = 'DetalleCoordinadores.xlsx';
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    }


});