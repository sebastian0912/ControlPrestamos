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
    localStorage.setItem('a', JSON.stringify(values));

    if (values.EstadoQuincena == false) {
        aviso('No puedes ingresar, ya se ha cerrado la quincena', 'error');
    }
    else {
        if (values.rol == 'TESORERIA') {
            console.log(values);
            window.location.href = "../Tesorero/tesorero.html";
        } else if (values.rol == 'GERENCIA') {

            window.location.href = "../Gerencia/gerencia.html";
        } else if (values.rol == 'JEFE-DE-AREA') {
            window.location.href = "../JefeArea/jefeArea.html";
        } else if (values.rol == 'Tienda') {
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

function verificarCodigoEstado(datos) {
    let encontrado = 0;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.estado == true) {
                encontrado++;
            }
        });
    });
    return encontrado;
}

function numCoordinadoresConestadoSolicitudesTrue(datos) {
    let auxCoordinadores = 0;
    datos.forEach((doc) => {
        if (doc.data().perfil == "Coordinador" && doc.data().estadoSolicitudes == true) {
            auxCoordinadores++;
        }
    });
    return auxCoordinadores;
}

function numCoordinador(datos) {
    let auxCoordinadores = 0;
    datos.forEach((doc) => {
        if (doc.data().perfil == "Coordinador") {
            auxCoordinadores++;
        }
    });
    return auxCoordinadores;
}

function numTiendas(datos) {
    let auxTiendas = 0;
    datos.forEach((doc) => {
        if (doc.data().perfil == "Tienda") {
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