import { aviso } from "../Avisos/avisos.js";
import { urlBack, usuarioR } from "../models/base.js";


const signInform = document.querySelector('#signIn-form');

signInform.addEventListener('submit', async (e) => {
    e.preventDefault();

    const values = await fetchData();

    localStorage.setItem('idUsuario', values.numero_de_documento);
    localStorage.setItem('perfil', values.rol);
    localStorage.setItem('username', values.primer_nombre + ' ' + values.primer_apellido);
    localStorage.setItem('sede', values.sucursalde);
    localStorage.setItem('estadoSolicitudes', values.EstadoSolicitudes);
    localStorage.setItem('estadoQuincena', values.EstadoQuincena);

    const aux = await datosTCodigos();
    console.log(aux.codigo);
    let datos = aux.codigo;
    let aux2 = await datosEmpleado();

    let datosU = await datosUsuarios();
    console.log(datosU);

    let datosEmpleados = aux2.datosbase;
    
    console.log(datosEmpleados);

    if (values.rol == 'TESORERIA') {
        values.EstadoQuincena = true;
        localStorage.setItem('CantidadEmpleados', datosEmpleados.length);
        localStorage.setItem('CantidadSolicitudes', verificarCodigoEstado(datos));
        localStorage.setItem('CantidadCoordinadoresConEstadoSolicitudesTrue', numCoordinadoresConestadoSolicitudesTrue(datosU));
        window.location.href = "../Tesorero/tesorero.html";
    }
    if (values.EstadoQuincena == false) {
        aviso('No puedes ingresar, ya se ha cerrado la quincena', 'error');
    }
    else {
        if (values.rol == 'GERENCIA') {
            localStorage.setItem('CantidadCoordinadores', numCoordinador(datosU));
            localStorage.setItem('CantidadTiendas', numTiendas(datosU));            
            if (datosEmpleados == "error") {
                localStorage.setItem('CantidadEmpleados', 0);
            } else {
                localStorage.setItem('CantidadEmpleados', datosEmpleados.length);                
            }
            window.location.href = "../Gerencia/gerencia.html";
        } else if (values.rol == 'JEFE-DE-AREA') {
            window.location.href = "../JefeArea/jefeArea.html";
        } else if (values.rol == 'TIENDA') {
            window.location.href = "../Tienda/tienda.html";
        }
        else if (values.rol == 'COORDINADOR') {
            window.location.href = "../Coordinador/coordinador.html";
        }
        else if (values.rol == 'COMERCIALIZADORA') {
            window.location.href = "../Comercializadora/comercializadora.html";
        }
        else if (values.rol == 'ADMIN') {
            window.location.href = "../Administrador/editar.html";
        }
        else {
            aviso('No tienes acceso todavia, comunicate con el administrador', 'error');
        }
    }

});

async function fetchData() {
    const email = signInform['signIn-email'].value;
    const password = signInform['signIn-password'].value;
    const urlcompleta = urlBack.url + '/usuarios/ingresar';

    try {
        const response = await fetch(urlcompleta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: email, password: password }),
        });

        const responseBody = await response.text();

        localStorage.setItem('key', responseBody);

        var body = localStorage.getItem('key');

        const obj = JSON.parse(body);

        if (responseBody != null && obj.jwt != null) {
            const values = await getUserbyUsername(responseBody);
            if (values != null) {
                return values; // Devuelve el valor de 'values'
            }
        }
        return null; // Si no hay valores o hay errores, devuelve null
    } catch (error) {
        console.error(error);
        return null; // En caso de error, devuelve null
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

async function datosEmpleado() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Datosbase/datosbase';

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

function verificarCodigoEstado(datos) {
    let encontrado = 0;
    datos.forEach(doc => {
        if (doc.estado == true) {
            encontrado++;
        }
    });
    return encontrado;
}

function numCoordinadoresConestadoSolicitudesTrue(datos) {
    
    let auxCoordinadores = 0;
    datos.forEach((doc) => {
        console.log(doc);
        if (doc.rol == "COORDINADOR" && doc.estadoSolicitudes == true) {
            auxCoordinadores++;
        }
    });
    return auxCoordinadores;
}

function numCoordinador(datos) {
    console.log(datos);
    let auxCoordinadores = 0;
    datos.forEach((doc) => {
        if (doc.rol == "COORDINADOR") {
            auxCoordinadores++;
        }
    });
    return auxCoordinadores;
}

function numTiendas(datos) {
    console.log(datos);
    let auxTiendas = 0;
    datos.forEach((doc) => {
        if (doc.rol == "TIENDA") {
            auxTiendas++;
        }
    });
    return auxTiendas;
}

async function getUserbyUsername(jwt) {

    var user = usuarioR;
    var body = localStorage.getItem("key");
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;
    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/usuarios/usuario';
    try {
        const response = await fetch(urlcompleta, {
            headers: headers
        });
        const json = await response.json();
        if (json.message !== "sessionOut") {
            if (json !== null) {
                usuarioR.numero_de_documento = json.numero_de_documento;
                usuarioR.primer_nombre = json.primer_nombre;
                usuarioR.celular = json.celular;
                usuarioR.primer_apellido = json.primer_apellido;
                usuarioR.localizacion = json.localizacion;
                usuarioR.edad = json.edad;
                usuarioR.tipodedocumento = json.tipodedocumento;
                usuarioR.correo_electronico = json.correo_electronico;
                usuarioR.avatar = json.avatar;
                usuarioR.empladode = json.empleadode;
                usuarioR.sucursalde = json.sucursalde;
                usuarioR.rol = json.rol;
            }
        } else {
            this.currentUser = null;
            window.sessionStorage.removeItem('key');
            window.location.href = "/Login";
        }
        return user;
    } catch (error) {
        aviso('Error al iniciar sesión, constraseña o correo equivocados', 'error');

        return null;
    }
}