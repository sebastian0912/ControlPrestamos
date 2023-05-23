
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');
const idUsuario = localStorage.getItem("idUsuario");


// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    const codigo = document.querySelector('#codigo').value;
    const llegada = document.querySelector('#llegada').value;    
    
    const docRef = doc(db, "Comercio", codigo);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

    
    await updateDoc(doc(db, "Comercio", codigo), {                                   
        uidPersonaRecibe: idUsuario,
        cantidadRecibida: llegada
    });

    
    aviso("Se ha cargado la informacion exitosamente", "success");


});