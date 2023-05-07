
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { mostrarMensaje } from "./mostrarMensajes.js";




const signupForm = document.querySelector('#signUp-form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = signupForm['signUp-username'].value;
    const email = signupForm['signUp-email'].value;
    const password = signupForm['signUp-password'].value;

    console.log (username, email, password);

    try {
        const registro = await createUserWithEmailAndPassword(auth, email, password);
        
        mostrarMensaje('Usuario '+ email +'registrado correctamente', 'success');
    } catch (error) {
        console.log(error.message);
        if (error.code == 'auth/invalid-email') {
            mostrarMensaje('El correo electrónico no es válido', 'error');
        }
        else if (error.code == 'auth/weak-password') {
            mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        }
        else if (error.code == 'auth/email-already-in-use') {
            mostrarMensaje('El correo electrónico ya está en uso', 'error');
        }
        else if (error.code){
            mostrarMensaje('Sucedió un error', 'error');
        }

    }

});

