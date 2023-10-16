import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");

if (usernameLocal == "YENY SOTELO") {
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

let coodinador = document.getElementById("boton");

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
    "LEIDY VANESA"
];

const rolesAsignados = nombresApellidos.map((nombre, indice) => {
    const rol = indice < 41 ? 'COORDINADOR' : 'JEFE DE OFICINA';
    return { nombre, rol };
});

coodinador.addEventListener('click', async () => {

    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;

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
        let arrayCodigos = [];
        const aux = await datosTCodigos();
        if (aux.message == "error") {
            aviso("No hay registros de actividades de los coordinadores", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
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
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }
        console.log(fechaInicio);

        // sacar los datos de los coordinadores donde la fecha de inicio sea igual a fechaGenerado
        let datosFinalesFecha = [];
        datosFinales.forEach((doc) => {
            const fechaGenerado = new Date(doc.fechaGenerado);
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
            const key = item.generadoPor;

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
            const generadoPor = doc.generadoPor;
            if (datosFinalesFechaGeneradoPor.includes(generadoPor)) {
                // no hacer nada
            } else {
                datosFinalesFechaGeneradoPor.push(generadoPor);
            }
        });

        datosFinalesFechaGeneradoPor.forEach((doc) => {
            let sumaAutorizado = 0;
            let sumaEjecutado = 0;

            datosFinalesFecha.forEach((doc2) => {
                if (doc == doc2.generadoPor) {
                    if (doc2.ejecutadoPor != "0") {
                        sumaEjecutado += parseInt(doc2.monto);
                    }
                    sumaAutorizado += parseInt(doc2.monto);
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
                        "Valor Total Autorizado": doc.valorAutorizado,
                        "Valor sin Ejecutar": doc.valorAutorizado - doc.valorEjecutado,
                        "valor Ejecutado": doc.valorEjecutado
                    });
                    nombresProcesados.add(nombre); // Marcar el nombre como procesado
                }
            });
        });

        let datosFinalesFechaGeneradoPorSumaRolCantidad = [];
        let nombresProcesados2 = new Set();

        datosFinalesFechaGeneradoPorSumaRol.forEach((doc) => {
            const nombre = doc["Generado Por"];
            let cantidadConEjecucion = 0;
            let cantidadSinEjecucion = 0;

            datosFinalesFecha.forEach((doc2) => {
                if (doc2.generadoPor == nombre) {
                    if (doc2.ejecutadoPor !== "0") {
                        cantidadConEjecucion++;
                    } else {
                        cantidadSinEjecucion++;
                    }
                }
            });

            if (!nombresProcesados2.has(nombre)) {
                datosFinalesFechaGeneradoPorSumaRolCantidad.push({
                    "Generado Por": doc["Generado Por"],
                    "Rol": doc.Rol,
                    "Valor Total Autorizado": doc["Valor Total Autorizado"],
                    "Valor sin Ejecutar": doc["Valor sin Ejecutar"],
                    "valor Ejecutado": doc["valor Ejecutado"],
                    "Cantidad con Ejecución": cantidadConEjecucion,
                    "Cantidad sin Ejecución": cantidadSinEjecucion
                });
                nombresProcesados2.add(nombre); // Marcar el nombre como procesado
            }
        });

        console.log(datosFinalesFechaGeneradoPorSumaRolCantidad);

        // generar el excel con datosFinalesFechaGeneradoPorSumaRolCantidad y que tenga hojas internas separadas por coordinador con datosAgrupados

        // Crear un libro Excel
        const wb = XLSX.utils.book_new();

        const datosParaHoja = [
            ["Generado Por", "Rol", "Valor Total Autorizado", "Valor sin Ejecutar", "valor Ejecutado", "Cantidad con Ejecución", "Cantidad sin Ejecución"]
        ];

        datosFinalesFechaGeneradoPorSumaRolCantidad.forEach((doc) => {
            datosParaHoja.push([
                doc["Generado Por"],
                doc.Rol,
                Number(doc["Valor Total Autorizado"]),
                Number(doc["Valor sin Ejecutar"]),
                Number(doc["valor Ejecutado"]),
                Number(doc["Cantidad con Ejecución"]),
                Number(doc["Cantidad sin Ejecución"])
            ]);
        });

        // Ahora puedes usar `aoa_to_sheet` con `datosParaHoja`
        const ws = XLSX.utils.aoa_to_sheet(datosParaHoja);

        // Luego, agrega la hoja al libro Excel
        XLSX.utils.book_append_sheet(wb, ws, 'NombreDeLaHoja');

        // Crear hojas internas para cada coordinador agrupado
        for (const nombreCoordinador in datosAgrupados) {
            if (datosAgrupados.hasOwnProperty(nombreCoordinador)) {
                const datosCoordinador = datosAgrupados[nombreCoordinador];
                const ws = XLSX.utils.json_to_sheet(datosCoordinador);
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
    else {
        // realizar el reporte solo con la fecha de inicio
        let arrayCodigos = [];
        const aux = await datosTCodigos();
        if (aux.message == "error") {
            aviso("No hay registros de actividades de los coordinadores", "warning");
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
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
            // resetear los campos
            document.getElementById("fechaInicio").value = "";
            return;
        }
        console.log(fechaInicio);

        // sacar los datos de los coordinadores donde la fecha de inicio sea igual a fechaGenerado
        let datosFinalesFecha = [];
        datosFinales.forEach((doc) => {
            const fechaGenerado = new Date(doc.fechaGenerado);
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
            const key = item.generadoPor;

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
            const generadoPor = doc.generadoPor;
            if (datosFinalesFechaGeneradoPor.includes(generadoPor)) {
                // no hacer nada
            } else {
                datosFinalesFechaGeneradoPor.push(generadoPor);
            }
        });

        datosFinalesFechaGeneradoPor.forEach((doc) => {
            let sumaAutorizado = 0;
            let sumaEjecutado = 0;

            datosFinalesFecha.forEach((doc2) => {
                if (doc == doc2.generadoPor) {
                    if (doc2.ejecutadoPor != "0") {
                        sumaEjecutado += parseInt(doc2.monto);
                    }
                    sumaAutorizado += parseInt(doc2.monto);
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
                        "Valor Total Autorizado": doc.valorAutorizado,
                        "Valor sin Ejecutar": doc.valorAutorizado - doc.valorEjecutado,
                        "valor Ejecutado": doc.valorEjecutado
                    });
                    nombresProcesados.add(nombre); // Marcar el nombre como procesado
                }
            });
        });

        let datosFinalesFechaGeneradoPorSumaRolCantidad = [];
        let nombresProcesados2 = new Set();

        datosFinalesFechaGeneradoPorSumaRol.forEach((doc) => {
            const nombre = doc["Generado Por"];
            let cantidadConEjecucion = 0;
            let cantidadSinEjecucion = 0;

            datosFinalesFecha.forEach((doc2) => {
                if (doc2.generadoPor == nombre) {
                    if (doc2.ejecutadoPor !== "0") {
                        cantidadConEjecucion++;
                    } else {
                        cantidadSinEjecucion++;
                    }
                }
            });

            if (!nombresProcesados2.has(nombre)) {
                datosFinalesFechaGeneradoPorSumaRolCantidad.push({
                    "Generado Por": doc["Generado Por"],
                    "Rol": doc.Rol,
                    "Valor Total Autorizado": doc["Valor Total Autorizado"],
                    "Valor sin Ejecutar": doc["Valor sin Ejecutar"],
                    "valor Ejecutado": doc["valor Ejecutado"],
                    "Cantidad con Ejecución": cantidadConEjecucion,
                    "Cantidad sin Ejecución": cantidadSinEjecucion
                });
                nombresProcesados2.add(nombre); // Marcar el nombre como procesado
            }
        });

        console.log(datosFinalesFechaGeneradoPorSumaRolCantidad);

        // generar el excel con datosFinalesFechaGeneradoPorSumaRolCantidad y que tenga hojas internas separadas por coordinador con datosAgrupados

        // Crear un libro Excel
        const wb = XLSX.utils.book_new();

        const datosParaHoja = [
            ["Generado Por", "Rol", "Valor Total Autorizado", "Valor sin Ejecutar", "valor Ejecutado", "Cantidad con Ejecución", "Cantidad sin Ejecución"]
        ];

        datosFinalesFechaGeneradoPorSumaRolCantidad.forEach((doc) => {
            datosParaHoja.push([
                doc["Generado Por"],
                doc.Rol,
                Number(doc["Valor Total Autorizado"]),
                Number(doc["Valor sin Ejecutar"]),
                Number(doc["valor Ejecutado"]),
                Number(doc["Cantidad con Ejecución"]),
                Number(doc["Cantidad sin Ejecución"])
            ]);
        });

        // Ahora puedes usar `aoa_to_sheet` con `datosParaHoja`
        const ws = XLSX.utils.aoa_to_sheet(datosParaHoja);

        // Luego, agrega la hoja al libro Excel
        XLSX.utils.book_append_sheet(wb, ws, 'NombreDeLaHoja');

        // Crear hojas internas para cada coordinador agrupado
        for (const nombreCoordinador in datosAgrupados) {
            if (datosAgrupados.hasOwnProperty(nombreCoordinador)) {
                const datosCoordinador = datosAgrupados[nombreCoordinador];
                const ws = XLSX.utils.json_to_sheet(datosCoordinador);
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