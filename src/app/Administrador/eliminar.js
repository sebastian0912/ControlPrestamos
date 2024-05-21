
import { urlBack } from "../models/base.js";
import { aviso, avisoConfirmacion } from "../Avisos/avisos.js";

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");

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

listaU.forEach((doc) => {
    let aux = {
        codigo: '',
        nombre: '',
    };
    //console.log(doc.id);
    aux.codigo = doc.numero_de_documento;
    aux.nombre = doc.primer_nombre + ' ' + doc.primer_apellido;
    datos.push(aux);
});

// Excluye el primer elemento (posición 0) del arreglo
var datosSinPrimero = datos.slice(1);

// Ordena el nuevo arreglo por nombre
datosSinPrimero.sort(function(a, b) {
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
    miSelect.appendChild(option);
});

async function EliminarU(cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    const urlcompleta = urlBack.url + '/usuarios/administrador/eliminarUsuario/' + cedulaEmpleado;
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

miSelect.addEventListener('change', async (e) => {

    const boton = document.querySelector('#boton');

    const resultado = await avisoConfirmacion();

    if (resultado){
        EliminarU(e.target.value);
        document.querySelector('#miSelect').value = 0;
    }
    else{
        document.querySelector('#miSelect').value = 0;
    }


});



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
            datosFinales.push([rows[i][0], rows[i][1]]);
        }

        console.log('Datos cargados desde Excel:', datosFinales);

        subidaMasivaCorreos(datosFinales);
    };

    reader.readAsBinaryString(file);
});


async function subidaMasivaCorreos(datos) {
    console.log(datos);

    for (const doc of datos) {
        console.log('Procesando documento:', doc);

        try {
            var body = localStorage.getItem('key');
            const obj = JSON.parse(body);
            const jwtToken = obj.jwt;

            console.log('jwtToken:', jwtToken);

            const urlcompleta = urlBack.url + '/traslados/cargar-correos-raul';

            const response = await fetch(urlcompleta, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken
                },
                body: JSON.stringify({
                    datos: [{  // Envía un array con objetos que incluyan correo y contraseña
                        correo: doc[0],
                        contrasena: doc[1],
                    }],
                    jwt: jwtToken  // Verifica si realmente necesitas enviar el JWT en el cuerpo
                })
            });

            // Manojo de la respuesta aquí si es necesario

        } catch (error) {
            console.error('Error procesando el documento:', doc, 'Error:', error);
        }
    }

    let confirmacion = await avisoConfirmado('Termino de subir el archivo', "success");

    if (confirmacion) {
        location.reload();
    }
}
