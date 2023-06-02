
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js"
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"

import { auth, db } from "../firebase.js";
import { aviso } from "../Avisos/avisos.js";


const signInform = document.querySelector('#signIn-form');

signInform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signInform['signIn-email'].value;
    const password = signInform['signIn-password'].value;

    try {
        const credenciales = await signInWithEmailAndPassword(auth, email, password);
        // extrer el id del usuario
        const idUsuario = credenciales.user.uid;

        const docRef = doc(db, "Usuarios", idUsuario);
        const docSnap = await getDoc(docRef);

        const perfil = docSnap.data().perfil;
        const estadoQuincena = docSnap.data().estadoQuincena;

        localStorage.setItem('idUsuario', idUsuario);

        if (estadoQuincena == false) {
            aviso('No puedes ingresar, ya se ha cerrado la quincena', 'error');
        }
        else {
            if (perfil == 'Tesorero') {
                window.location.href = "../Tesorero/tesorero.html";
            } else if (perfil == 'Gerencia') {
                window.location.href = "../Gerencia/gerencia.html";
            } else if (perfil == 'JefeArea') {
                window.location.href = "../JefeArea/jefeArea.html";
            } else if (perfil == 'Tienda') {
                window.location.href = "../Tienda/tienda.html";
            }
            else if (perfil == 'Coordinador') {
                window.location.href = "../Coordinador/coordinador.html";
            }
            else if (perfil == 'Comercializadora') {
                window.location.href = "../Comercializadora/comercializadora.html";
            }
            else if (perfil == 'Admin') {
                window.location.href = "../Administrador/editar.html";
            }
            else {
                aviso('No tienes acceso todavia, comunicate con el administrador', 'error');
            }
        }        
    } catch (error) {
        console.log(error.message);
        if (error.code === 'auth/wrong-password') {
            aviso('La contraseña que ingresaste es erronea', 'error');
        } else if (error.code === 'auth/user-not-found') {
            aviso('El correo no se encuentra', 'error');
        } else {
            aviso('El correo  no es valido', 'error');
        }
    }
});
