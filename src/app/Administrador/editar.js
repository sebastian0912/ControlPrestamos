
import { urlBack } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";

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

/*Calculo cuantos dias faltan*/
// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 27) {
    dia = 0;
    numeroDias.style.color = "red";
}
else if (ahora.getDate() < 13) {
    dia = 13;
}
else if (ahora.getDate() < 27) {
    dia = 27;
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
diasRestantes.innerHTML = dias;


// Mostrar en el html el numero de dias Restantes de liquidacion
var fechaObjetivo2 = ['2023-04-10', '2023-04-24', '2023-05-08', '2023-05-23', '2023-06-07', '2023-06-23', '2023-07-05', '2023-07-26', '2023-08-09', '2023-08-23', '2023-09-06', '2023-09-25', '2023-10-06', '2023-10-23', '2023-11-08', '2023-11-22', '2023-11-05', '2023-12-21', '2024-01-05']
// Recorre el arreglo y muestra los dias restantes deacuerdo a la fecha
for (let i = 0; i < fechaObjetivo2.length; i++) {
    // separar por año, mes y dia
    var fechaObjetivo3 = new Date(fechaObjetivo2[i]);
    if (fechaObjetivo3.getFullYear() == ahora.getFullYear() &&
        fechaObjetivo3.getMonth() == ahora.getMonth() &&
        fechaObjetivo3.getDate() >= ahora.getDate()) {

        var diferencia2 = fechaObjetivo3 - ahora;
        var dias2 = Math.ceil(diferencia2 / (1000 * 60 * 60 * 24));
        if (dias2 == 0) {
            diasLi.style.color = "red";
        }
        diasLi.innerHTML = dias2;
        break;
    }
}




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
            console.log(responseData);
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

// crear un arreglo de tipo aux
let datos = [
    {
        codigo: '0',
        nombre: 'Seleccione un usuario',
    }
];

let roles = [ "SELECCIONE EL ROL", "ADMIN", "COORDINADOR", "TIENDA", "GERENCIA", "JEFE-DE-AREA", "TESORERIA", "COMERCIALIZADORA"];

// llenar roles con el arreglo roles
roles.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion;
    option.value = opcion;
    rol.appendChild(option);
});


listaU.forEach((doc) => {
    let aux = {
        codigo: '',
        nombre: '',
    };
    //console.log(doc.id);
    aux.codigo = doc.numero_de_documento;
    aux.nombre = doc.primer_nombre + ' ' + doc.primer_apellido;
    

    console.log(aux);
    datos.push(aux);
});

datos.forEach((opcion) => {
    const option = document.createElement('option');
    option.text = opcion.nombre;
    option.value = opcion.codigo;
    editar.appendChild(option);
});




async function cambioR(cedulaEmpleado, nuevoRol) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/usuarios/administrador/cambioRol';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    ceduladelapersona: cedulaEmpleado,
                    rolacambiar: nuevoRol,
                    jwt: jwtToken
                })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {

                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }

}

// al darle click a cualquier opcion del select imprima el valor
editar.addEventListener('change', async (e) => {
    var boton = document.getElementById('boton');
    boton.style.display = 'block';
    console.log(editar.value);
    console.log(rol.value);
    boton.addEventListener('click', async (e) => {
        cambioR(editar.value, rol.value);
        aviso('Se cambio el rol correctamente', 'success');
        document.querySelector('#editar').value = 0;
        document.querySelector('#rol').value = 0;
        boton.style.display = 'none';
        
    });
}
);

