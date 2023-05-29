
import { collection, doc, getDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";

const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
// capturar el id del usuario logeado del input

const boton = document.querySelector('#boton');

// darle click al boton para que se ejecute la funcion

boton.addEventListener('click', async (e) => {
    e.preventDefault();
    // capturar los datos del formulario
    const codigoP = document.querySelector('#codigo').value;
    const valor = document.querySelector('#valor').value;

    const cedulaEmpleado = document.querySelector('#cedula').value;
    const docRef = doc(db, "Base", cedulaEmpleado);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

    const sumaTotal =
        parseInt(datos.saldos) +
        parseInt(datos.fondos) +
        parseInt(datos.mercados) +
        parseInt(datos.prestamoPaDescontar) +
        parseInt(datos.casino) +
        parseInt(datos.anchetas) +
        parseInt(datos.fondo) +
        parseInt(datos.carnet) +
        parseInt(datos.seguroFunerario) +
        parseInt(datos.prestamoPaHacer) +
        parseInt(datos.anticipoLiquidacion) +
        parseInt(datos.cuentas);


    if (sumaTotal > 350000) {
        aviso('Ups no se pueden generar prestamos has pasado tu tope 350.0000', 'error');
    }
    else if ((sumaTotal + parseInt(valor)) <= 350000) {
        //console.log('entro al if');

        const querySnapshot = await getDocs(collection(db, "Codigos"));
        querySnapshot.forEach(async (cod) => {
            const docRef = doc(db, "Codigos", cod.id);
            const docSnap = await getDoc(docRef);
            // recorrer arreglo llamado prestamos para buscar el codigo
            const prestamos = docSnap.data().prestamos;
            //console.log(prestamos);
            prestamos.forEach(async (p) => {
                if (p.codigo == codigoP) {                    
                    if (p.estado == false) {
                        aviso('El codigo ya fue usado', 'error');
                    }
                    else {
                        await updateDoc(doc(db, "Base", cedulaEmpleado), {
                            prestamoPaDescontar: parseInt(datos.mercados) + parseInt(valor),

                            //cuotasMercados: 2,
                        });
                        // modificar la variable estado dentro del arreglo y subir cambios a firebase
                        p.estado = false;
                        await updateDoc(doc(db, "Codigos", cod.id), {
                            prestamos: prestamos
                        });
                        aviso('Acaba de pedir un prestamo de ' + valor, 'success');
                    }
                }
               


            }
            );
        });
    }
    else {
        aviso('Ups no se pueden generar prestamos has pasado tu tope 350.0000', 'error');
    }
});


const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);
// capturar username
const username = docSnap.data().username;

titulo.innerHTML = " ¡ BIENVENIDO " + username + " ! ";