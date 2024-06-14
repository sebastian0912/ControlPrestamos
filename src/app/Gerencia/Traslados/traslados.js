
import { usuarioR, urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";


const boton = document.querySelector('#boton');
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
const correo = localStorage.getItem("correo_electronico");

//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

if (correo == "a.sotelotualianza@gmail.com" || correo == "contaduria.rtc@gmail.com") {
    mercado.style.display = "inline-block"
}
else {
    mercado.style.display = "none"
}

if (correo == "contaduria.rtc@gmail.com") {
    traslados.style.display = "inline-block"
}



document.querySelector('#crear').addEventListener('click', async () => {
    const numero = parseInt(document.getElementById('numeroUsuarios').value);
    const contenedor = document.getElementById('camposDinamicos');
    contenedor.innerHTML = ''; // Limpiar campos anteriores
    const usuarios = await listaUsuarios();
    usuarios.sort((a, b) => a.primer_nombre.localeCompare(b.primer_nombre));

    for (let i = 0; i < numero; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3 style="margin: 15px 0 15px 0">Usuario ${i + 1}</h3>
            <input type="text" list="usuarioList_${i}" id="inputUsuario_${i}" placeholder="Escribe para filtrar..." class="input2">
            <datalist id="usuarioList_${i}">
                ${usuarios.map(u => `<option value="${u.primer_nombre} ${u.primer_apellido} - ${u.numero_de_documento}"></option>`).join('')}
            </datalist>
        `;
        contenedor.appendChild(div);
    }
    document.getElementById('guardar').style.display = 'block';
});


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

async function obtenerUsuarioPorId(id) {
    const usuarios = await listaUsuarios();
    return usuarios.find(usuario => usuario.numero_de_documento === id);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generarExcel(datos) {
    const worksheet = XLSX.utils.json_to_sheet(datos, {
        header: ["nombre", "correo_electronico", "password"],
        skipHeader: false
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    XLSX.writeFile(workbook, 'ListaUsuarios.xlsx');  // Guardar el archivo
}


document.querySelector('#guardar').addEventListener('click', async () => {
    const numero = parseInt(document.getElementById('numeroUsuarios').value, 10);
    let nombresResponsables = [];
    let datosUsuarios = [];  // Array para almacenar los datos de los usuarios

    let usuarios = await listaUsuarios();

    const numerosTraslados = usuarios
        .map(usuario => usuario.correo_electronico) // Obtener solo los correos electrónicos
        .filter(correo => correo.startsWith('traslados')) // Filtrar correos que comienzan con 'traslados'
        .map(correo => parseInt(correo.match(/traslados(\d+)/)[1])) // Extraer los números de los correos
        .filter(numero => !isNaN(numero)); // Filtrar valores no numéricos

    const maxNumero = numerosTraslados.length > 0 ? Math.max(...numerosTraslados) : null;

    console.log('El número más grande es:', maxNumero);    

    for (let i = 0+maxNumero; i < numero+maxNumero; i++) {
        try {
            let userId = document.getElementById(`inputUsuario_${i-maxNumero}`).value.split(' - ')[1];
            console.log('ID del usuario:', userId);
            let user = await obtenerUsuarioPorId(String(userId));
            console.log('Usuario encontrado:', user);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const usuario = {
                correo_electronico: `traslados${i + 1}@gmail.com`,
                password: 'Ll4v42024#$',
                primer_nombre: user.primer_nombre || '-',
                segundo_nombre: user.segundo_nombre || '',
                primer_apellido: user.primer_apellido || '-',
                segundo_apellido: user.segundo_apellido + ' TRASLADOS' || '',
                numero_de_documento: 'T' + user.numero_de_documento,
                perfil: user.perfil || '',
                rol: "TRASLADOS",
                username: `traslados${i + 1}@gmail.com`,
            };

            const usuaroCorreo = {
                nombre : `${user.primer_nombre} ${user.segundo_nombre} ${user.primer_apellido} ${user.segundo_apellido}`,
                correo_electronico: `traslados${i + 1}@gmail.com`,
                password : 'Ll4v42024#$',
            }



            await registrarUsuario(usuario);
            await sleep(1000); // Espera 1 segundo entre registros para evitar sobrecargar el servidor o la base de datos
            datosUsuarios.push(usuaroCorreo);
            nombresResponsables.push(`${user.primer_nombre} ${user.primer_apellido}`);
        } catch (error) {
            console.error(error);
            aviso('Error al registrar algunos usuarios', 'error');
            return;  // Detiene la ejecución en caso de error
        }
    }

    let avisoConfirm = await avisoConfirmado('Usuarios registrados correctamente', 'success');
    if (avisoConfirm) {
        generarExcel(datosUsuarios);  // Llamar a la función para generar Excel
        location.reload(); // Descomenta esta línea si necesitas recargar la página después de completar las operaciones
    }
});

async function registrarUsuario(data) {
    console.log('Registrando usuario:', data);
    const urlcompleta = urlBack.url + '/usuarios/registro';

    fetch(urlcompleta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    })
        .then(response => response.text())
        .then(responseBody => {
            console.log(responseBody);
        })
        .catch(error => {
            console.error(error);
            aviso('Error al registrar usuario', 'error');
        });
}



