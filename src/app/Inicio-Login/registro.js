
import { aviso } from "../Avisos/avisos.js";
import { usuarioR, urlBack } from "../models/base.js";

const signupForm = document.querySelector('#signUp-form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let datos = usuarioR;
    datos.primer_nombre = signupForm['PNombre'].value;
    datos.segundo_nombre = signupForm['SNombre'].value;
    datos.primer_apellido = signupForm['PApellido'].value;
    datos.segundo_apellido = signupForm['SApellido'].value;
    datos.numero_de_documento = signupForm['NDocumento'].value;

    datos.correo_electronico = signupForm['signUp-email'].value;
    datos.password = signupForm['signUp-password'].value;

    console.log(datos);
    
    datos.username = signupForm['signUp-email'].value;
    const urlcompleta = urlBack.url + '/usuarios/registro';
    fetch(urlcompleta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(datos),
    })
        .then(response => response.text())
        .then(responseBody => {
            console.log(responseBody);
            window.sessionStorage.setItem('key', responseBody);
            var body = window.sessionStorage.getItem('key');
            console.log(body);
            const obj = JSON.parse(body);
            return true;

        })
        .catch(error => {
            console.error(error);
            return false;
        });
    aviso('Usuario registrado correctamente', 'success');





});

