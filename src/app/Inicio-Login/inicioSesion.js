
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js"
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { auth, db } from "../firebase.js";
import { aviso } from "../Avisos/avisos.js";


const signInform = document.querySelector('#signIn-form');

signInform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signInform['signIn-email'].value;
    const password = signInform['signIn-password'].value;

    try {
        const credenciales = await signInWithEmailAndPassword(auth, email, password);


        const docRef = doc(db, "Usuarios", credenciales.user.uid);
        const docSnap = await getDoc(docRef);

        const querySnapshot = await getDocs(collection(db, "Base"));
        const Base = querySnapshot.docs.map((doc) => doc.data());

        const estadoQuincena = docSnap.data().estadoQuincena;
        const perfil = docSnap.data().perfil;
        localStorage.setItem('idUsuario', credenciales.user.uid);
        localStorage.setItem('perfil', perfil);
        localStorage.setItem('username', docSnap.data().username);
        localStorage.setItem('sede', docSnap.data().sede);

        localStorage.setItem('sede', docSnap.data().sede);

        if (estadoQuincena == false) {
            aviso('No puedes ingresar, ya se ha cerrado la quincena', 'error');
        }
        else {
            if (perfil == 'Tesorero') {
                localStorage.setItem('empleados', Base.length);
                const datos = await getDocs(collection(db, "Codigos"));
                localStorage.setItem('codigos', verificarCodigoEstado(datos));
                const datosU = await getDocs(collection(db, "Usuarios"));
                localStorage.setItem('coordinadores', numCoordinadoresConestadoSolicitudesTrue(datosU));

                window.location.href = "../Tesorero/tesorero.html";
            } else if (perfil == 'Gerencia') {
                const datos = await getDocs(collection(db, "Usuarios"));
                localStorage.setItem('empleados', Base.length);
                localStorage.setItem('coordinadores', numCoordinador(datos));
                localStorage.setItem('tiendas', numTiendas(datos));
                window.location.href = "../Gerencia/gerencia.html";

            } else if (perfil == 'JefeArea') {
                window.location.href = "../JefeArea/jefeArea.html";
            } else if (perfil == 'Tienda') {
                window.location.href = "../Tienda/tienda.html";
            }
            else if (perfil == 'Coordinador') {
                const docRef = doc(db, "Codigos", credenciales.user.uid);
                const docSnap2 = await getDoc(docRef);
                let codigos;
                if (docSnap2.data() != undefined) {
                    codigos = docSnap2.data().prestamos;
                }
                else {
                    codigos = [];
                }
                const arrayString = JSON.stringify(codigos);
                localStorage.setItem('estado', docSnap.data().estadoSolicitudes);                
                localStorage.setItem('codigos', arrayString);
                window.location.href = "../Coordinador/coordinador.html";
            }
            else if (perfil == 'Comercializadora') {
                const querySnapshot = await getDocs(collection(db, "Comercio"));
                let datosComercializadoraGeneral = querySnapshot.docs.map(doc => doc.data());
                const arrayString = JSON.stringify(datosComercializadoraGeneral);
                localStorage.setItem('datosComercializadoraGeneral', arrayString);
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

