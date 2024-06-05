import { urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";

// Capturar elementos HTML importantes
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const diasRestantes = document.querySelector('#diasRestantes');  // Asegúrate de tener este elemento en tu HTML
const diasLi = document.querySelector('#diasLi');  // Asegúrate de tener este elemento en tu HTML
const tabla = document.querySelector('#tabla');  // Asegúrate de que este ID esté en tu tabla HTML

// Captura de datos desde localStorage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const estado = localStorage.getItem("estadoSolicitudes");
const uid = localStorage.getItem("idUsuario");
const correo = localStorage.getItem("correo_electronico");

// Mostrar en la interfaz el nombre y perfil del usuario
titulo.textContent = usernameLocal;
perfil.textContent = perfilLocal;

const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');


// Funciones para obtener datos de traslados y correos
async function datosTraslados() {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = { 'Authorization': jwtKey };
    const urlCompleta = urlBack.url + '/traslados/traer_todo_base_general';

    try {
        const response = await fetch(urlCompleta, { method: 'GET', headers: headers });
        if (!response.ok) throw new Error('Error en la petición GET');
        return await response.json();
    } catch (error) {
        console.error('Error en la petición HTTP GET', error);
        throw error;
    }
}

async function datosCorreos(usernameLocal) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };
    const urlCompleta = urlBack.url + '/traslados/traer_todo_correos_raul/';

    try {
        const response = await fetch(urlCompleta, { method: 'GET', headers: headers });
        if (!response.ok) throw new Error('Error en la petición GET');
        return await response.json();
    } catch (error) {
        console.error('Error en la petición HTTP GET', error);
        throw error;
    }
}

function showInfoBox(over, info) {
    document.getElementById(over).style.display = 'block'; // Muestra el overlay
    document.getElementById(info).style.display = 'block'; // Muestra el infoBox
}


function cerrarInfoBox(over, info) {
    document.getElementById(over).style.display = 'none'; // Oculta el overlay
    document.getElementById(info).style.display = 'none'; // Oculta el infoBox
}

asignar.addEventListener('click', asignarTraslado);

async function asignarTraslado() {
    
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;

    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };

    const urlCompleta = urlBack.url + '/traslados/actualizar_datos/';

    let traslados = await datosTraslados();
    console.log("Traslados:", traslados);
    let correos = await datosCorreos(usernameLocal);
    console.log("Correos:", correos);

    // Verificar si hay traslados sin responsable 
    const trasladosSinResponsable = traslados.filter(traslado => !traslado.responsable);
    if (trasladosSinResponsable.length === 0) {
        aviso("No hay traslados disponibles", "warning");
        return;
    }

    // Verificar si hay correos sin asignar si codigo_traslado
    const correosSinAsignar = correos.filter(correo => !correo.codigo_traslado);
    console.log("Correos sin asignar:", correosSinAsignar);
    if (correosSinAsignar.length === 0) {
        aviso("No hay correos disponibles", "warning");
        return;
    }


    // Seleccionar un traslado sin responsable
    const trasladoSinResponsable = trasladosSinResponsable[0];

    // Seleccionar un correo sin asignar
    const correoSinAsignar = correosSinAsignar[0];

    // Obtener el número de cédula del traslado seleccionado
    const numeroCedula = trasladoSinResponsable.numero_cedula;

    const data = {
        codigo_traslado: trasladoSinResponsable.codigo_traslado,
        correo: correoSinAsignar.correo,
        responsable: usernameLocal,
        numero_cedula: numeroCedula
    };

    console.log('Enviando datos:', data);

    try {
        const response = await fetch(urlCompleta, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            let aviso = avisoConfirmado("Correo asignado correctamente", "success");
            if (aviso) {

                location.reload();

            }
            return responseData;
        } else {
            throw new Error('Error en la petición POST');
        }
    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
        throw error;
    }

}


async function traerAusentismosCedula(cedula) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/contratacion/buscarCandidato/' + cedula;

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            const errorData = await response.json(); // Asegúrate de leer el JSON incluso en caso de error
            return errorData; // Devuelve el error para que se pueda manejar fuera de la función
        }
    } catch (error) {
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}


async function cargarYMostrarDatos(cedulaEm, traslado) {
    const tabla = document.querySelector('#tabla2');

    let datosExtraidos = await traerAusentismosCedula(cedulaEm);

    if (datosExtraidos.message != "success") {
        aviso("No se encontró a la persona no esta cargada en el sistema", "error");
        tabla.innerHTML = '';
        return;
    }

    console.log('Datos extraidos:', datosExtraidos);
    
    datosExtraidos.data.forEach(p => {
        tabla.innerHTML = '';
        tabla.insertAdjacentHTML('afterbegin', `
            <tr>

                <td>${p.numerodeceduladepersona}</td>
                <td>${p.primer_apellido}</td>
                <td>${p.segundo_apellido}</td>
                <td>${p.primer_nombre}</td>
                <td>${p.segundo_nombre}</td>
                <td>${p.fecha_nacimiento}</td>
                <td>${p.genero}</td>
                <td>${p.estado_civil}</td>

                <td>${p.direccion_residencia}</td>
                <td>${p.barrio}</td>
                <td>${p.celular}</td>

                <td>${p.primercorreoelectronico}</td>
                <td>${p.municipio}</td>
                <td>${p.fecha_expedicion_cc}</td>
                <td>${p.municipio_expedicion_cc}</td>
                <td>${p.departamento_expedicion_cc}</td>
                <td>${p.lugar_nacimiento_municipio}</td>
                <td>${p.lugar_nacimiento_departamento}</td>
                <td>${p.rh}</td>
                <td>${p.zurdo_diestro}</td>
                <td>${p.eps13 || '---'}</td>
                
            </tr>
        `);
    });
}

async function cargarYMostrarDatosEstados(datosExtraidos) {
    const tabla = document.querySelector('#tabla3');
    if (!datosExtraidos || Object.keys(datosExtraidos).length === 0) {
        aviso("No hay datos para mostrar", "warning");
        return;
    }

    console.log('Datos extraidos:', datosExtraidos);

    tabla.innerHTML = '';

    // Utilizar Object.entries para iterar sobre el objeto
    Object.entries(datosExtraidos).forEach(([fecha, estado]) => {
        console.log('Fecha:', fecha, 'Estado:', estado);
        tabla.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${new Date(fecha).toLocaleString()}</td>
                <td>${estado}</td>                
            </tr>
        `);
    });
}

async function iniciar() {
    try {
        // Año actual para filtrar traslados relevantes
        const anoActual = new Date().getFullYear();
        let trasladosFiltrados = await buscarTrasladosFiltro(usernameLocal, anoActual);
        console.log('Traslados filtrados:', trasladosFiltrados);
        // Limpiar tabla antes de agregar nuevas filas
        tabla.innerHTML = '';

        // Crear filas de traslados en la tabla
        trasladosFiltrados
            .sort((a, b) => a.codigo_traslado - b.codigo_traslado)
            .forEach(traslado => crearFilaTraslado(traslado, null, tabla));

        // Añadir escuchadores de eventos, si necesario
        addEventListeners();
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
}


function crearFilaTraslado(traslado, correos, tabla) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${traslado.codigo_traslado}</td>
        <td>${traslado.estado_del_traslado}</td>

        <td>${traslado.numero_cedula}</td>
        <td><a style="  text-decoration:underline; color: blue" href="#" class="ver-pdf" data-pdf="${traslado.solicitud_traslado}">Ver PDF</a></td>
        <td><a style="  text-decoration:underline; color: blue" href="${traslado.numero_cc2 || "No disponible"}" target="_blank">${traslado.numero_cc2 || "No disponible"}</a></td>
        <td>${traslado.asignacion_correo}</td>
        <td>${traslado.eps_a_trasladar}</td>
        <td>
            <button class="btn-cambiar-estado">Cambiar Estado</button>
            <button class="btn-ver-trabajador">Ver Trabajador</button>
            <button class="btn-estados">Estados</button>
            <button class="btn-correo">Cambiar correo</button>

        </td>
    `;
    tabla.appendChild(tr);
}

async function traerTrasladoCedula(cedula) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers
        = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/traslados/buscar/' + cedula;

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Respuesta:', responseData);
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


async function buscarTrasladosFiltro(responsable, ano) {
    console.log("Responsable:", responsable, "Año:", ano);  // Añade esto para verificar los valores que se envían

    // Construye la URL con los parámetros de la consulta
    let url = urlBack.url + `/traslados/buscar-filtro/?responsable=${encodeURIComponent(responsable)}&ano=${encodeURIComponent(ano)}`;

    // Realiza la solicitud GET usando fetch y devuelve el resultado
    try {
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json(); // Procesa la respuesta JSON si la solicitud fue exitosa
            return data; // Devuelve los datos para que puedan ser utilizados donde se llama a esta función
        } else {
            throw new Error('La solicitud a la API falló con el estado ' + response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}




function addEventListeners() {
    document.querySelectorAll('.ver-pdf').forEach(el => {
        el.addEventListener('click', event => {
            event.preventDefault();
            abrirPDF(el.getAttribute('data-pdf'));
        });
    });


    document.getElementById('cerrarInfoBox').addEventListener('click', function () {
        cerrarInfoBox('overlay', 'infoBox');
    });

    document.getElementById('cerrarInfoBox2').addEventListener('click', function () {
        cerrarInfoBox('overlay2', 'infoBox2');
    });

    document.getElementById('cerrarInfoBox3').addEventListener('click', function () {
        cerrarInfoBox('overlay3', 'infoBox3');
    });


    





    // Añadir evento para mostrar infoBox al clickear 'Cambiar Estado'
    document.querySelectorAll('.btn-cambiar-estado').forEach(button => {

        button.addEventListener('click', function () {
            showInfoBox('overlay', 'infoBox');
        });

        // imprimir el codigo del traslado
        button.addEventListener('click', function () {
            const tr = button.closest('tr');
            const codigo = tr.cells[0].textContent.trim();
            let guardarEstado = document.getElementById('guardarEstado');

            guardarEstado.addEventListener('click', function () {

                const estadoSelect = document.getElementById('estadoSelect').value;
                const fechaConfirmacion = document.getElementById('fechaConfirmacion').value;
                const numeroRadicado = document.getElementById('numeroRadicado').value;
                const numeroBebeficiarios = document.getElementById('numeroBeneficiarios').value;
                const observaciones = document.getElementById('observaciones').value;
                const epsTraslado = document.getElementById('epsTraslado').value;

                const data = {
                    codigo_traslado: codigo,
                    estado_del_traslado: estadoSelect,
                    fecha_aceptacion: fechaConfirmacion,
                    numero_radicado: numeroRadicado,
                    numero_beneficiarios: numeroBebeficiarios,
                    observaciones: observaciones,
                    eps_traslado: epsTraslado
                };

                console.log('Datos a enviar:', data);
                cambiarEstadoTraslado(codigo, estadoSelect, fechaConfirmacion, numeroRadicado, numeroBebeficiarios, observaciones, epsTraslado);




            });
        });
    });


    // Añadir evento para mostrar infoBox al clickear 'Ver Trabajador'
    document.querySelectorAll('.btn-ver-trabajador').forEach(button => {
        // Hacemos la función del evento async para poder usar await dentro
        button.addEventListener('click', async function () {
            const tr = button.closest('tr');
            const cedula = tr.cells[2].textContent.trim();
            // Asumimos que cargarYMostrarDatos es una función async

            showInfoBox('overlay2', 'infoBox2');
            await cargarYMostrarDatos(cedula, tr.cells[1].textContent.trim());
        });
    });

    // Añadir evento para mostrar infoBox al clickear 'Estados'
    document.querySelectorAll('.btn-estados').forEach(button => {
        /* imprimir por consola el estado del traslados pero ese no esta en la tabla */
        button.addEventListener('click', async function () {
            console.log('Estado del traslado');
            let traslado = button.closest('tr').cells[0].textContent.trim();
            console.log(traslado);
            let trasladoCedula = await traerTrasladoCedula(traslado);
            console.log(trasladoCedula);
            let trasladoEstado = trasladoCedula[0].ultimas_actualizaciones
            console.log(trasladoEstado);

            showInfoBox('overlay3', 'infoBox3');
            cargarYMostrarDatosEstados(trasladoEstado);

        }
        );
    });

    document.getElementById('estadoSelect').addEventListener('change', function () {
        var selectedOption = this.value;
        var esperaAceptacionCampos = document.getElementById('esperaAceptacionCampos');
        if (selectedOption === 'Espera Aceptacion') {
            esperaAceptacionCampos.style.display = 'block';
        } else {
            esperaAceptacionCampos.style.display = 'none';
        }
    });


    // Añadir evento para mostrar infoBox al clickear 'Cambiar correo'
    document.querySelectorAll('.btn-correo').forEach(button => {
        button.addEventListener('click', async function () {
            /* imprimir info de la fila */
            const tr = button.closest('tr');
            const codigo = tr.cells[0].textContent.trim();
            console.log('Codigo:', codigo);
            await assinarCorreoNuevo(codigo);
            
        });
    });
}

async function assinarCorreoNuevo(codigo) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };

    const urlCompleta = urlBack.url + '/traslados/asignar-correo';

    const data = {
        codigo_traslado: codigo,
        responsable: usernameLocal
    };

    fetch(urlCompleta, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la petición POST');
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            let aviso = avisoConfirmado('Estado del traslado actualizado correctamente', 'success');
            if (aviso) {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error en la petición HTTP POST', error);
            let aviso = aviso('Error al actualizar el estado del traslado', 'error');
            if (aviso) {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        });
}


function cambiarEstadoTraslado(codigo, estado, fecha, radicado, beneficiarios, observaciones, eps) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };
    const urlCompleta = urlBack.url + '/traslados/actualizar_estado/';

    const data = {
        codigo_traslado: codigo,
        estado_del_traslado: estado,
        fecha_efectividad: fecha,
        numero_radicado: radicado,
        cantidad_beneficiarios: beneficiarios,
        observacion_estado: observaciones,
        eps_trasladada: eps
    };

    fetch(urlCompleta, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la petición POST');
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            let aviso = avisoConfirmado('Estado del traslado actualizado correctamente', 'success');
            if (aviso) {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error en la petición HTTP POST', error);
            let aviso = aviso('Error al actualizar el estado del traslado', 'error');
            if (aviso) {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        });

    cerrarInfoBox('overlay', 'infoBox');
}

function abrirPDF(base64) {
    const base64Cleaned = base64.replace(/^data:application\/pdf;base64,/, '');
    const pdfWindow = window.open();
    pdfWindow.document.write(`<embed width="100%" height="100%" src="data:application/pdf;base64,${base64Cleaned}" type="application/pdf">`);
}

iniciar();
