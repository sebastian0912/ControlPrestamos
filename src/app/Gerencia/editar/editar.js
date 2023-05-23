import { collection, doc, setDoc, getDoc ,getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";
import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";

const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
// capturar el id del usuario logeado del input

const boton = document.querySelector('#boton');


const miSelect = document.getElementById('miSelect');

const querySnapshot = await getDocs(collection(db, "Usuarios"));



// crear un arreglo de tipo aux
let datos = [];



querySnapshot.forEach((doc) => {
    let aux = {
        codigo: '',
        nombre: '',
    };
    //console.log(doc.id);
    aux.codigo = doc.id;
    aux.nombre = doc.data().username;
    datos.push(aux);
});

// imprimir el arreglo
//console.log(datos);


datos.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.nombre;
    option.value = opcion.codigo;
    miSelect.appendChild(option);
});

// al darle click a cualquier opcion del select imprima el valor
miSelect.addEventListener('change', async (e) => {
    //console.log(e.target.value);
    const boton = document.querySelector('#boton');
    const docRef = doc(db, "Usuarios", e.target.value);
    const docSnap = await getDoc(docRef);
    // capturar username
    const perfil = docSnap.data().perfil;
    let codigo = e.target.value;
    var cargo = document.getElementById("cargo");    
    cargo.style.display = "block";
    boton.style.display = "block";
    cargo.placeholder = perfil;
    
    boton.addEventListener('click', async (e) => {
        await updateDoc(doc(db, "Usuarios", codigo), {                                   
            perfil: cargo.value,
        });
        aviso("Se ha actualizado el perfil correctamente");
    }
    
    );

}
);

