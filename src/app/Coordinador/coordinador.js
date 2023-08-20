
import { aviso } from "../Avisos/avisos.js";
import { urlBack } from "../models/base.js";

const uid = localStorage.getItem("idUsuario");

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const codigos = localStorage.getItem("codigos");
const estado = localStorage.getItem("estadoSolicitudes");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;


const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');


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


async function datosTCodigos() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Codigo/codigos';

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

/* Obtener codigos de la base de datos */
const aux = await datosTCodigos();
let arrayCodigos = [];

aux.codigo.forEach((c) => {
    if (c.ceduladelGenerador_id == uid) {
        arrayCodigos.push(c);
    }
});
console.log(arrayCodigos);
// Mostar contenido en una tabla
arrayCodigos.forEach((c) => {
    tabla.innerHTML += `
    <tr>
        <td>${c.codigo}</td>
        <td>${c.monto}</td>
        <td>${c.cuotas}</td>
        <td>${c.estado}</td>
        <td>${c.Concepto}</td>
        <td>${c.cedulaQuienPide}</td>
    </tr>
    `
});

// Numero de codigos activos de la base de datos del coodinador
let auxSolicitudes = 0;
if (aux == null) {
    numeroSolicitudesPendientes.innerHTML = 0;
}

else {
    //Obtener el numero de solicitudes sin realizar
    for (let i = 0; i < arrayCodigos.length; i++) {
        if (arrayCodigos[i].estado == true) {
            auxSolicitudes++;
        }
    }
}

numeroSolicitudesPendientes.innerHTML = auxSolicitudes;



if (estado == 'true') {
    document.getElementById("myonoffswitch").checked = false;
}
else {
    document.getElementById("myonoffswitch").checked = true;
}

async function estadoSoli(checked) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/usuarios/coordinador/cambioSolicitudes';

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    estadoSolicitudes: checked,
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

/*Inabilitar permisos*/
document.getElementById("myonoffswitch").addEventListener("click", async function (event) {

    if (this.checked) {
        estadoSoli("False");
        localStorage.setItem("estadoSolicitudes", "false");
        aviso('Se ha notificado que no va a publicar mas codigos para hacer', 'success');
       
        
    } else {
        estadoSoli("True");
        localStorage.setItem("estadoSolicitudes", "true");
        aviso('Se ha notificado que va a publicar mas codigos para hacer', 'success');
    }
});



