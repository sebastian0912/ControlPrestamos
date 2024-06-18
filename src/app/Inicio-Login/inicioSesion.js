import { aviso } from "../Avisos/avisos.js";
import { urlBack, usuarioR } from "../models/base.js";


const signInform = document.querySelector('#signIn-form');


const icon = document.querySelector(".bx"),
    pas = document.getElementById("signIn-password")
icon.addEventListener("click", e => {
    if (pas.type === "password") {
        pas.type = "text";
        icon.classList.remove('bx-show-alt')
        icon.classList.add("bx-hide")
    }
    else {
        pas.type = "password"
        icon.classList.remove('bc-hide')
        icon.classList.add('bx-show-alt')
    }
})

signInform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const values = await fetchData();
    const user = await getUserbyUsername();
    if (values.jwt === "Contraseña incorrecta") {
        aviso('Contraseña incorrecta', 'error');
        return;
    }

    else if (values.jwt === "Usuario no encontrado") {
        aviso('Usuario no encontrado', 'error');
        return;
    }

    else if (values.message === 'success') {
        const user = await getUserbyUsername();

        localStorage.setItem('idUsuario', user.numero_de_documento);
        localStorage.setItem('perfil', user.rol);
        localStorage.setItem('username', user.primer_nombre + ' ' + user.primer_apellido);
        localStorage.setItem('sede', user.sucursalde);
        localStorage.setItem('estadoSolicitudes', user.EstadoSolicitudes);
        localStorage.setItem('estadoQuincena', user.EstadoQuincena);
        localStorage.setItem('correo_electronico', user.correo_electronico);

        if (user.rol == 'TESORERIA') {
            window.location.href = "../Tesorero/tesorero.html";
        }
        if (user.EstadoQuincena == false) {
            aviso('No puedes ingresar, ya se ha cerrado la quincena', 'error');
        }
        else {
            if (user.rol == 'GERENCIA') {
                window.location.href = "../Gerencia/gerencia.html";
            } else if (user.rol == 'JEFE-DE-AREA') {
                window.location.href = "../JefeArea/jefeArea.html";
            } else if (user.rol == 'TIENDA') {
                window.location.href = "../Tienda/InicioTienda.html";
            } else if (user.rol == 'COORDINADOR') {
                window.location.href = "../Coordinador/coordinador.html";
            } else if (user.rol == 'COMERCIALIZADORA') {
                window.location.href = "../Comercializadora/comercializadora.html";
            } else if (user.rol == 'ADMIN') {
                window.location.href = "../Administrador/editar.html";
            }
            else if (user.rol == 'TRASLADOS') {
                window.location.href = "../AyudanteTraslados/AyudanteTraslados.html";
            }
            else {
                aviso('No tienes acceso todavia, comunicate con el administrador', 'error');
            }
        }
    }
});

async function fetchData() {
    let email = signInform['signIn-email'].value;
    const password = signInform['signIn-password'].value;
    // quitar espacios en blanco a email
    email = email.trim();
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
            return obj;
        }
        return null; // Si no hay valores o hay errores, devuelve null
    } catch (error) {
        aviso("Contecta el vpn", "warning")
        console.error(error);
        return null; // En caso de error, devuelve null
    }
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