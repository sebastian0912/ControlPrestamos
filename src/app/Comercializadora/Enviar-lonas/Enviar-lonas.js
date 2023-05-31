

import { comercio } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector('#boton');

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroDias = document.querySelector('#diasRestantes');




//Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;

let datos = [];
const querySnapshot = await getDocs(collection(db, "Sedes"));
let datos2 = [];
const querySnapshot2 = await getDocs(collection(db, "Conceptos"));

// consultar en las base de datos los conceptos y rellenar datos
querySnapshot2.forEach((doc) => {
    let aux = {
        codigo: '',
        concepto: '',
    };
    aux.codigo = doc.id;
    aux.concepto = doc.data().concepto;
    datos2.push(aux);
});

// rellenar el select con los datos de las sedes de la base de datos
datos2.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.concepto;
    option.value = opcion.codigo;
    miSelect2.appendChild(option);
});

// consultar en las base de datos las sedes y rellenar datos
querySnapshot.forEach((doc) => {
    let aux = {
        codigo: '',
        sede: '',
    };
    aux.codigo = doc.id;
    aux.sede = doc.data().barrio;
    datos.push(aux);
});


// rellenar el select con los datos de las sedes de la base de datos
datos.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.sede;
    option.value = opcion.codigo;
    miSelect.appendChild(option);
});

/*Calculo cuantos dias faltan*/
// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    dia = 0;
}
else if (ahora.getDate() < 13 || ahora.getDate() > 14) {
    dia = 13;
}
else if (ahora.getDate() < 28 || ahora.getDate() > 29) {
    dia = 28;
}

// Comprueba si el día ya ha pasado este mes
if (ahora.getDate() > dia) {
    // Si es así, cambia al próximo mes
    mes++;
}
// Crea la fecha objetivo
var fechaObjetivo = new Date(anio, mes, dia);
// Calcula la diferencia en milisegundos
var diferencia = fechaObjetivo - ahora;
// Convierte la diferencia en días
var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
numeroDias.innerHTML = dias;

// al darle click a cualquier opcion del select imprima el valor
/*
miSelect.addEventListener('change', async (e) => {
    const querySnapshot = await getDocs(collection(db, "Sedes"));
    const otro = document.querySelector('#otro');

    const boton = document.querySelector('#boton');
    // capturar otro    
    if (e.target.value == "2") {
        let data = {
            barrio: '',
            codigo: '',
        };
        otro.style.display = "inline-block";
        boton.addEventListener('click', async (e) => {
            data.codigo = querySnapshot.size + 1;
            const otro2 = document.querySelector('#otro');
            if (otro2.value == "") {
                aviso("No se ha ingresado ningun valor", "error");
            }
            else {
                data.barrio = otro2.value;
                /* insertar con el codigo de la sede 
                await setDoc(doc(db, "Sedes", (querySnapshot.size + 1).toString()), data);
                aviso("Se ha cargado la informacion exitosamente", "success");
            }
        }
        );
    }
    else {
        otro.style.display = "none";
    }
}
);*/


let mostrarAviso = false;
miSelect2.addEventListener('change', async (e) => {
    const querySnapshot = await getDocs(collection(db, "Conceptos"));
    const otro = document.querySelector('#otro2');

    if (e.target.value == "2") {
        mostrarAviso = true;
        otro.style.display = "inline-block";
    } else {
        mostrarAviso = false;
        otro.style.display = "none";
    }
});

boton.addEventListener('click', async (e) => {
    if (mostrarAviso) {
        const otro2 = document.querySelector('#otro2');
        if (otro2.value == "") {
            aviso("No se ha ingresado ningun valor", "error");
        } else {
            let data = {
                codigo: querySnapshot.size + 1,
                concepto: otro2.value,
            };

            /* insertar con el codigo de la sede */
            await setDoc(doc(db, "Conceptos", (querySnapshot.size + 1).toString()), data);
            aviso("Se ha cargado la informacion exitosamente", "success");
        }
    }
});




// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    const cantidad = document.querySelector('#cantidad').value;
    const valorUnidad = document.querySelector('#valorUnidad').value;
    const otro = document.querySelector('#otro').value;
    const otro2 = document.querySelector('#otro2').value;
    let miSelect = document.querySelector('#miSelect').value;
    let miSelect2 = document.querySelector('#miSelect2').value;

    if (otro != "") {
        miSelect = otro;
    }
    else {
        //acceder a la posicion 4 de datos
        miSelect = datos[parseInt(miSelect) - 1].sede;
    }
    if (otro2 != "") {
        miSelect2 = otro2;
    }
    else {
        miSelect2 = datos2[parseInt(miSelect2) - 1].concepto;
    }


    let aux = comercio;
    let uid;
    let docExists;
    
    do {
        uid = Math.floor(Math.random() * 10000000);
        const docRef = doc(db, "Comercio", uid.toString());

        try {
            const docSnapshot = await getDoc(docRef);
            docExists = docSnapshot.exists();
        } catch (error) {
            console.error("Error obteniendo el documento: ", error);
        }
    } while (docExists);

    aux.codigo = uid;
    aux.destino = miSelect;
    aux.concepto = miSelect2;
    aux.cantidadEnvio = cantidad;
    aux.PersonaEnvia = username;
    aux.valorUnidad = valorUnidad;
    aux.fechaEnviada = new Date().toLocaleDateString();
    await setDoc(doc(db, "Comercio", uid.toString()), aux);
    aviso("Se ha cargado la informacion exitosamente, el codigo es: " + uid, "success");
});



