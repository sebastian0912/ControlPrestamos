
import { urlBack } from "../models/base.js";
import { aviso, avisoConfirmado } from "../Avisos/avisos.js";

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


const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');
if (over) {
    console.log("----");
}
if (loader) {
    console.log("----2");
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




const miSelect = document.getElementById('miSelect');

async function listaUsuarios() {
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

const listaU = await listaUsuarios();

// crear un arreglo de tipo aux
let datos = [
    {
        codigo: '0',
        nombre: 'Seleccione un usuario',
    }
];

let roles = ["SELECCIONE EL ROL", "ADMIN",
    "AFILIACIONES",
    "COMERCIALIZADORA",
    "CONTRATACION",
    "CONTRATACIONSELECCIONGENERAL",
    "COORDINADOR",
    "EMPLEADO",
    "GERENCIA",
    "JEFE-DE-AREA",
    "RECEPCION",
    "RECURSOS-HUMANOS",
    "SELECCION",
    "SIN-ASIGNAR",
    "SISTEMAS",
    "SUPERVISOR",
    "TESORERIA",
    "TIENDA"];

// llenar roles con el arreglo roles
roles.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion;
    option.value = opcion;
    rol.appendChild(option);
});


listaU.forEach((doc) => {
    let aux = {
        codigo: '',
        nombre: '',
    };
    aux.codigo = doc.numero_de_documento;
    aux.nombre = doc.primer_nombre + ' ' + doc.primer_apellido;
    datos.push(aux);
});

// Excluye el primer elemento (posición 0) del arreglo
var datosSinPrimero = datos.slice(1);

// Ordena el nuevo arreglo por nombre
datosSinPrimero.sort(function (a, b) {
    if (a.nombre > b.nombre) {
        return 1;
    }
    if (a.nombre < b.nombre) {
        return -1;
    }
    return 0;
});

// Vuelve a unir el primer elemento al principio del arreglo ordenado
var datosOrdenados = [datos[0]].concat(datosSinPrimero);

datosOrdenados.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.nombre;
    option.value = opcion.codigo;
    editar.appendChild(option);
});


async function cambioR(cedulaEmpleado, nuevoRol) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    const urlcompleta = urlBack.url + '/usuarios/administrador/cambioRol';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    ceduladelapersona: cedulaEmpleado,
                    rolacambiar: nuevoRol,
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

// al darle click a cualquier opcion del select imprima el valor
editar.addEventListener('change', async (e) => {
    var boton = document.getElementById('boton');
    boton.style.display = 'block';

    boton.addEventListener('click', async (e) => {
        cambioR(editar.value, rol.value);
        aviso('Se cambio el rol correctamente', 'success');
        document.querySelector('#editar').value = 0;
        document.querySelector('#rol').value = 0;
        boton.style.display = 'none';

    });
}
);



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
    over.style.display = 'block';
    loader.style.display = 'block';

    let datosFinales = [];

    reader.onload = (event) => {
        const fileContent = event.target.result;
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        for (let i = 1; i < rows.length; i++) {
            datosFinales.push({
                correo: rows[i][0],
                contrasena: rows[i][1]
            });
        }

        console.log('Datos cargados desde Excel:', datosFinales);

        subidaMasivaCorreos(datosFinales);
    };

    reader.readAsBinaryString(file);
});


async function subidaMasivaCorreos(datos) {
    console.log('Enviando datos masivos:', datos);

    try {
        var body = localStorage.getItem('key');
        const obj = JSON.parse(body);
        const jwtToken = obj.jwt;

        const urlcompleta = urlBack.url + '/traslados/cargar-correos-raul';

        const response = await fetch(urlcompleta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken
            },
            body: JSON.stringify({
                datos: datos,  // Envía el array completo
                jwt: jwtToken
            })
        });

        // Manojo de la respuesta aquí si es necesario

        if (!response.ok) {
            aviso('Sucedio algun error', 'error');
        }
        over.style.display = 'none';
        loader.style.display = 'none';
        
        let confirmacion = await avisoConfirmado('Termino de subir el archivo', "success");

        if (confirmacion) {
            location.reload();
        }

    } catch (error) {
        console.error('Error al enviar los datos masivos:', error);
    }
}



/* subida masiva de cedulas */

let input3 = document.getElementById('subidaMasiva3');

input3.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();

        // Mostrar elementos de carga
        loader.style.display = 'block';
        over.style.display = 'block';

        reader.onload = async (event) => {
            const arrayBuffer = event.target.result;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convertir la hoja de trabajo en un arreglo de arreglos
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

            const claves = ["cedula", "cedula_escaneada_delante"];

            // Procesar cada fila y asignar los valores a las claves correspondientes
            const datosFinales = rows.map((row, index) => {
                // Ignorar las primeras cuatro filas y comenzar a leer desde la quinta fila
                if (index >= 1) {
                    let modifiedRow = {};
                    row.forEach((cell, idx) => {
                        if (idx < claves.length) {
                            modifiedRow[claves[idx]] = cell !== null ? cell : 'N/A';
                        }
                    });
                    return modifiedRow;
                }
            }).filter(row => row !== undefined);  // Filtrar las filas no definidas (antes de la quinta fila)

            console.log('Datos cargados desde Excel:', datosFinales);

            // Aquí puedes hacer algo con datosFinales, como almacenarlo o procesarlo
            await subidaMasivaCedulas(datosFinales);

        };

        reader.readAsArrayBuffer(file);
    }
});


async function subidaMasivaCedulas(datosFinales) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const urlcompleta = urlBack.url + '/traslados/cargar-cedulas';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body: JSON.stringify(
                {
                    datos: datosFinales,
                    mensaje: "muchos",
                    jwt: jwtKey
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la petición POST');
                }
                return response.json(); // Si la respuesta está OK, la convertimos a JSON
            })
            .then(async data => { // Aquí modificamos para que la función sea directamente asíncrona.
                document.getElementById('successSound').play();
                over.style.display = "none";
                loader.style.display = "none";
                console.log('Respuesta del servidor:', data); // Imprime la respuesta ya convertida a JSON
                let aviso = await avisoConfirmado("Datos guardados correctamente", "success");
                if (aviso) {
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('errorSound').play();
                over.style.display = "none";
                loader.style.display = "none";
                aviso("Error al guardar los datos", "error");

            });

    } catch (error) {
        console.error('Error capturado en el bloque try-catch:', error);
    }
}


let input4 = document.getElementById('subidaMasiva4');

input4.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();

        // Mostrar elementos de carga
        loader.style.display = 'block';
        over.style.display = 'block';

        reader.onload = async (event) => {
            const arrayBuffer = event.target.result;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convertir la hoja de trabajo en un arreglo de arreglos
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, blankrows: false });

            const claves = [
                "codigoTraslado", "solicitudTraslado", "cedulas", "nCC2", "estadoEspera",
                "epsTrasladar", "asignacionCorreo", "responsable", "estadoTraslado", "observacionEstado",
                "numeroRadicado", "fechaEfectividad", "cantidadBeneficiarios", "codigo4", "nombreCarnet",
                "fechaNacimiento", "fechaExpedicionCC", "telefonoMovil", "sexo", "rh", "ciudadResidencia",
                "direccionResidencia", "municipioExpedicionCC", "departamentoExpedicionCC", "lugarNacimientoMunicipio",
                "lugarNacimientoDepartamento", "ultimaActualizacion"
            ];

            // Procesar cada fila y asignar los valores a las claves correspondientes
            const datosFinales = rows.map((row, index) => {
                if (index >= 1) {  // Asumiendo que la primera fila contiene los encabezados
                    let modifiedRow = {};
                    row.forEach((cell, idx) => {
                        let value = cell !== undefined ? cell : 'N/A'; // Manejo de celdas indefinidas

                        // Convertir números de serie de Excel a fechas para las columnas específicas
                        if (idx === 11 || idx === 26) { // Indices de 'fechaEfectividad' y 'ultimaActualizacion'
                            if (typeof value === 'number') {
                                const date = new Date(Date.UTC(0, 0, value - 1));
                                value = date.toISOString().split('T')[0];
                            }
                        }

                        if (idx < claves.length) {
                            modifiedRow[claves[idx]] = value;
                        }
                    });
                    return modifiedRow;
                }
            }).filter(row => row !== undefined); // Filtrar filas no definidas (e.g., filas vacías)

            console.log('Datos cargados desde Excel:', datosFinales);

            // Aquí puedes hacer algo con datosFinales, como almacenarlo o procesarlo
            await subidaMasivaBase(datosFinales);
        };

        reader.readAsArrayBuffer(file);
    }
});





async function subidaMasivaBase(datosFinales) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const urlcompleta = urlBack.url + '/traslados/subida-masiva-traslados';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body: JSON.stringify(
                {
                    datos: datosFinales,
                    mensaje: "muchos",
                    jwt: jwtKey
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la petición POST');
                }
                return response.json(); // Si la respuesta está OK, la convertimos a JSON
            })
            .then(async data => { // Aquí modificamos para que la función sea directamente asíncrona.
                document.getElementById('successSound').play();
                over.style.display = "none";
                loader.style.display = "none";
                console.log('Respuesta del servidor:', data); // Imprime la respuesta ya convertida a JSON
                let aviso = await avisoConfirmado("Datos guardados correctamente", "success");
                if (aviso) {
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('errorSound').play();
                over.style.display = "none";
                loader.style.display = "none";
                aviso("Error al guardar los datos", "error");

            });

    } catch (error) {
        console.error('Error capturado en el bloque try-catch:', error);
    }
}



