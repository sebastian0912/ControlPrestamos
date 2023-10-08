import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
const boton = document.querySelector('#boton');

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const empleados = localStorage.getItem("empleados");
const codigos = localStorage.getItem("codigos");
const numCoordinadoresConestadoSolicitudesTrue = localStorage.getItem("coordinadores");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;


if (usernameLocal == "YENY SOTELO"){
    mercado.style.display = "inline-block"
}
else{
    mercado.style.display = "none"
}


async function datosH(cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Historial/tesoreria/' + cedulaEmpleado;

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

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;

    let aux = await datosEmpleado(cedulaEmpleado);
    console.log(aux.datosbase[0]);
    let datos = aux.datosbase[0];

    if (aux.datosbase == "No se encontró el registro para el ID proporcionado") {
        console.log("No existe");
        aviso('Este usuario no existe, esta retirado o no pertenece a la empresa', 'warning');    
        return;
    }

    const datosExtraidos = await datosH(cedulaEmpleado);
    console.log(datosExtraidos);

    if (datosExtraidos.historial.length == 0) {
        aviso('No hay datos para mostrar', 'warning');
        return;
    }

    const oculto = document.querySelector('#oculto');
    oculto.style.display = "block";

    const tabla = document.querySelector('#tabla');
    tabla.innerHTML = '';
    datosExtraidos.historial.forEach(async (p) => {
        // Verificar si p.nombreQuienEntrego es null y mostrar una cadena vacía en su lugar
        const nombreQuienEntrego = p.nombreQuienEntrego !== null ? p.nombreQuienEntrego : '';

        // Insertar al principio de la tabla
        tabla.insertAdjacentHTML('afterbegin', `
            <tr>
                <td>${p.cedula}</td>
                <td>${p.concepto}</td>            
                <td>${p.fechaEfectuado}</td>
                <td>${p.valor}</td>
                <td>${p.cuotas}</td>
                <td>${nombreQuienEntrego}</td>
                <td>${p.generadopor}</td>
            </tr>
        `);
    });
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
