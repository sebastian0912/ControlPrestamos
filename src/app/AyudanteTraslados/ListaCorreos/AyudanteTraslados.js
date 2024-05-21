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

async function datosCorreos(usernameLocal) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };
    const urlCompleta = urlBack.url + '/traslados/traer_todo_correos_raul?responsable=' + encodeURIComponent(usernameLocal);

    try {
        const response = await fetch(urlCompleta, { method: 'GET', headers: headers });
        if (!response.ok) throw new Error('Error en la petición GET');
        return await response.json();
    } catch (error) {
        console.error('Error en la petición HTTP GET', error);
        throw error;
    }
}

async function actualizarObservacion(correo, observacion, codigo_traslado) {
    const jwtKey = JSON.parse(localStorage.getItem('key')).jwt;
    const urlCompleta = urlBack.url + '/traslados/editar_observacion_correo/';
    const headers = {
        'Authorization': 'Bearer ' + jwtKey,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        correo: correo,
        observacion: observacion,
        codigo_traslado: codigo_traslado
    });

    try {
        const response = await fetch(urlCompleta, { method: 'POST', headers: headers, body: body });
        if (!response.ok) {
            const errorData = await response.json(); // Suponiendo que el servidor devuelve JSON con detalles del error
            throw new Error('Error en la petición POST: ' + errorData.message);
        }
        return await response.json(); // Devuelve la respuesta del servidor
    } catch (error) {
        console.error('Error en la petición HTTP POST', error);
        throw error; // Re-lanzar el error para manejarlo en la función del evento click
    }
}



async function iniciar() {
    let correos = await datosCorreos(usernameLocal);
    console.log("Correos:", correos);  // Verifica la estructura de los correos
    correos = correos.filter(correo => correo.codigo_traslado != null);

    correos.forEach(correo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${correo.correo}</td>
            <td>${correo.contrasena}</td>
            <td>${correo.codigo_traslado || 'Sin asignar'}</td>
            <td><span class="observacion-texto">${correo.observacion || ''}</span><input type="text" value="${correo.observacion || ''}" class="input-observacion" style="display:none;"></td>
            <td><button class="editar-observacion">Editar</button><button class="guardar" style="display:none;">Guardar</button></td>
        `;
        document.getElementById('tabla').appendChild(tr);
    });

    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll('.editar-observacion').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            tr.querySelector('.observacion-texto').style.display = 'none';
            tr.querySelector('.input-observacion').style.display = 'inline';
            tr.querySelector('.guardar').style.display = 'inline';
            button.style.display = 'none';
        });
    });

    document.querySelectorAll('.guardar').forEach(button => {
        button.addEventListener('click', async () => {
            const tr = button.closest('tr');
            const correo = tr.cells[0].textContent.trim();
            const observacion = tr.querySelector('.input-observacion').value.trim();
    
            try {
                const result = await actualizarObservacion(correo, observacion, tr.cells[2].textContent);
                console.log('Observación actualizada:', result);
                alert('Observación actualizada correctamente');
                tr.querySelector('.observacion-texto').textContent = observacion;
                tr.querySelector('.observacion-texto').style.display = 'inline';
                tr.querySelector('.input-observacion').style.display = 'none';
                tr.querySelector('.editar-observacion').style.display = 'inline';
                button.style.display = 'none';
            } catch (error) {
                console.error('Error al actualizar la observación:', error);
                alert('Error al actualizar la observación');
            }
        });
    });
    
}




iniciar();
