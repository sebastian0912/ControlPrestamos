
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

async function cambioContra(nueva, vieja) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    const urlcompleta = urlBack.url + '/usuarios/cambiocontrasena';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Agrega cualquier otro encabezado si es necesario
            },
            body:
                JSON.stringify({
                    oldpassword: vieja,
                    newpassword: nueva,
                    token: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    let aviso = avisoConfirmado("Contraseña cambiada correctamente", "success");
                    if (aviso) {
                        window.location.href = "../Inicio-Login/index.html";
                    }

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
                aviso("Error al cambiar la contraseña", "error");
                console.error('Error:', error);
            });

    } catch (error) {
        aviso("Error al cambiar la contraseña", "error");
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}

botonCambio.addEventListener('click', async () => {

    let contrasena = document.getElementById("contrasena").value;
    let contrasena2 = document.getElementById("contrasena2").value;
    let contrasena3 = document.getElementById("contrasena3").value;

    console.log(contrasena);
    console.log(contrasena2);
    console.log(contrasena3);

    if (contrasena == "" || contrasena2 == "" || contrasena3 == "") {
        aviso("error", "Todos los campos son obligatorios");
    }

    else if (contrasena2 != contrasena3) {
        aviso("error", "Las contraseñas no coinciden");
    }
    else {
        cambioContra(contrasena2, contrasena);
        // enviar a inicio
        window.location.href = "../Inicio/inicio.html";
    }

});