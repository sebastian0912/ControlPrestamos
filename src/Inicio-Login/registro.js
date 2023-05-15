
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { doc, setDoc} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { auth, db} from "../app/firebase.js";
import { aviso } from "../app/Avisos/avisos.js";

const signupForm = document.querySelector('#signUp-form');

let datos = {
    username: '',
    email: '',
    password: '',
    id : '',
    perfil : 'Tienda'
}

signupForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    datos.username = signupForm['signUp-username'].value;
    datos.email = signupForm['signUp-email'].value;
    datos.password = signupForm['signUp-password'].value;   

    try {
        const registro = await createUserWithEmailAndPassword(auth, datos.email, datos.password);
        
        const idRegistro = registro.user.uid;
        const path = 'Usuarios';
        datos.id = idRegistro;
        datos.password = null;
        
        await setDoc(doc(db, path, idRegistro), datos);
        aviso('Usuario registrado correctamente', 'success');        
    } catch (error) {
        
        if (error.code == 'auth/invalid-email') {            
            aviso('El correo  no es valido', 'error');        
        }
        else if (error.code == 'auth/weak-password') {
            aviso('La contraseña debe tener al menos 6 caracteres', 'error');     
        }
        else if (error.code == 'auth/email-already-in-use') {
            aviso('El correo ya existe, escoja otro', 'error');     
        }
        else if (error.code){
            aviso('¡ Ups sucedio un error !', 'error');     

        }

    }

});

