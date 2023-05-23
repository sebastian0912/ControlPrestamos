
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js"
import { doc, getDoc} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"

import { auth, db } from "../app/firebase.js";
import { aviso } from "../app/Avisos/avisos.js";


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
        
        localStorage.setItem('idUsuario', idUsuario);
        if (perfil == 'Tesorero') {            
            window.location.href = "../app/Tesorero/tesorero.html";            
        }else if (perfil == 'Gerencia') {
            window.location.href = "../app/Gerencia/gerencia.html"; 
        }else if (perfil == 'JefeArea') {
            window.location.href = "../app/JefeArea/jefeArea.html";
        }else if (perfil == 'Tienda') {
            window.location.href = "../app/Tienda/tienda.html";
        }
        else if (perfil == 'Coodinador') {
            window.location.href = "../app/Coordinador/coordinador.html";
        }
        else if (perfil == 'Comercializadora') {
            window.location.href = "../app/Comercializadora/comercializadora.html";
        }
        
        //window.location.href = "../app/Tesorero/tesorero.html";
    }catch (error) {
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
