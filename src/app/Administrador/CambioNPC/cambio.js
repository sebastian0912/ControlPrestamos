
import { urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
let extraeT = document.getElementById("extraeT");


// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 1;
var bandera = true;

if (ahora.getDate() == 13 || ahora.getDate() == 27) {
    dia = 0;
    diasRestantes.innerHTML = "0";
    diasRestantes.style.color = "red";
    bandera = false;
}
else if (ahora.getDate() < 13) {
    dia = 13;
}
else if (ahora.getDate() < 27) {
    dia = 27;
}
else {
    dia = 13;
    mes++; // Cambia al próximo mes
}
if (bandera) {
    // Crea la fecha objetivo
    var fechaObjetivo = new Date(anio, mes, dia);
    // Calcula la diferencia en milisegundos
    var diferencia = fechaObjetivo - ahora;
    // Convierte la diferencia en días
    var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    diasRestantes.innerHTML = dias;
}

var fechaObjetivo2 = ['2023-04-10', '2023-04-24', '2023-05-08', '2023-05-23', '2023-06-07', '2023-06-23', '2023-07-05', '2023-07-26', '2023-08-09', '2023-08-23', '2023-09-06', '2023-09-25', '2023-10-06', '2023-10-23', '2023-11-08', '2023-11-22', '2023-11-05', '2023-12-21', '2024-01-05'];

function obtenerFecha() {
    // Convertimos la fecha actual a un formato que coincida con las fechas del arreglo
    var fechaActualFormato = ahora.toISOString().slice(0, 10);

    var fechaSeleccionada = null;

    for (var i = 0; i < fechaObjetivo2.length; i++) {
        // Comparamos las fechas ignorando la información de la hora y el huso horario
        if (fechaActualFormato <= fechaObjetivo2[i]) {
            fechaSeleccionada = fechaObjetivo2[i];
            return fechaSeleccionada;
        }
    }
}

var diferencia2 = new Date(obtenerFecha()) - ahora;
var dias2 = Math.ceil(diferencia2 / (1000 * 60 * 60 * 24));

if (dias2 == 0) {
    diasLi.style.color = "red";
} else {
    diasLi.style.color = "black";
}
diasLi.innerHTML = dias2;




const miSelect = document.getElementById('miSelect');

async function listaUsuarios() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/usuarios/usuarios';

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

async function usuarioID(cedula) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/usuarios/usuario/'+ cedula;

    try {
        const response = await fetch(urlcompleta, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

const listaU = await listaUsuarios();
console.log(listaU)
// crear un arreglo de tipo aux
let datos = [
    {
        codigo: '0',
        nombre: 'Seleccione un usuario',
    }
];


listaU.forEach((doc) => {
    let aux = {
        codigo: '',
        nombre: '',
    };
    aux.codigo = doc.numero_de_documento;
    aux.nombre = doc.correo_electronico;
    datos.push(aux);
});

// Excluye el primer elemento (posición 0) del arreglo
var datosSinPrimero = datos.slice(1);

// Ordena el nuevo arreglo por nombre
datosSinPrimero.sort(function (a, b) {
    if (a.nombre > b.nombre) {
        return 1;
    }
    if (a.nombre < b.nombre) {
        return -1;
    }
    return 0;
});

// Vuelve a unir el primer elemento al principio del arreglo ordenado
var datosOrdenados = [datos[0]].concat(datosSinPrimero);

datosOrdenados.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.nombre;
    option.value = opcion.codigo;
    editar.appendChild(option);
});


async function cambioNombreRaul(pnombre, snombre, papellido, sapellido, contrasena, cedula, correo) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;

    const urlcompleta = urlBack.url + '/usuarios/cambiarDatosUsuario';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    primernombre : pnombre,
                    segundonombre : snombre,
                    primerapellido : papellido,
                    segundoapellido : sapellido,
                    newpassword : contrasena,
                    numero_de_documento : cedula,
                    correo_electronico : correo,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    aviso('Se realizaron debidamente los cambios', 'success');

                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices

                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    aviso('No se realizaron los cambios', 'error');
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {

                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                aviso('No se realizaron los cambios', 'error');
                console.error('Error:', error);
            });

    } catch (error) {
        aviso('No se realizaron los cambios', 'error');
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}



// al darle click a cualquier opcion del select imprima el valor
editar.addEventListener('change', async (e) => {
    var boton = document.getElementById('boton');
    boton.style.display = 'block';

    console.log(editar.value)

    const usuario = await usuarioID(editar.value);
    console.log(usuario)


    let pnombre = document.getElementById('pnombre');
    let snombre = document.getElementById('snombre');
    let papellido = document.getElementById('papellido');
    let sapellido = document.getElementById('sapellido');

    // mostrar los datos del usuario como valor en los input
    pnombre.value = usuario.primer_nombre;
    snombre.value = usuario.segundo_nombre;
    papellido.value = usuario.primer_apellido;
    sapellido.value = usuario.segundo_apellido;


    
    boton.addEventListener('click', async (e) => {
        e.preventDefault();
        let contrasena = document.getElementById('contrasena').value;
        console.log(contrasena)
        console.log(pnombre.value)
        console.log(snombre.value)
        console.log(papellido.value)
        console.log(sapellido.value)
        console.log(editar.value)
        console.log(usuario.correo_electronico)
        await cambioNombreRaul(pnombre.value, snombre.value, papellido.value, sapellido.value, contrasena, editar.value, usuario.correo_electronico);
        
        aviso('Se cambio el rol correctamente', 'success');
    });
}
);

