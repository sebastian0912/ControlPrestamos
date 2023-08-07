import { urlBack } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";


const boton = document.querySelector('#boton');
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const iddatos = localStorage.getItem("idUsuario");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;


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
else {
    dia = 13;
    mes++; // Cambia al próximo mes
}

// Crea la fecha objetivo
var fechaObjetivo = new Date(anio, mes, dia);
// Calcula la diferencia en milisegundos
var diferencia = fechaObjetivo - ahora;
// Convierte la diferencia en días
var dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
diasRestantes.innerHTML = dias;


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

/*Convertir valor a separado por miles*/
const numemoroM = document.querySelector('#valor');
numemoroM.addEventListener('keyup', (e) => {
    var num = numemoroM.value.replace(/\,/g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/, '');
        numemoroM.value = num;
    } else {
        alert('Solo se permiten números');
        numemoroM.value = numemoroM.value.replace(/[^\d\,]*/g, '');
    }
});


async function escribirCodigo(cedulaEmpleado, nuevovalor, cod, valor) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Codigo/jefedearea/crearcodigo';
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: cod,
                    monto: nuevovalor,
                    cuotas: '2',
                    estado: true,
                    Concepto: 'Mercado Autorizacion',
                    cedulaQuienPide: cedulaEmpleado,
                    generadoPor: usernameLocal,
                    ceduladelGenerador: iddatos,
                    formasdepago: 'none',
                    numerodepago: 'none',
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
                aviso('Acaba de pedir un mercado de ' + valor + ' su codigo es: ' + cod, 'success');
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

async function datosEmpleado(cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Datosbase/tesoreria/' + cedulaEmpleado;

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

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    // capturar los datos del formulario
    let valor = document.querySelector('#valor').value;
    let nuevovalor = valor.replace(/\,/g, '');
    let cedulaEmpleado = document.querySelector('#cedula').value;


    let aux = await datosEmpleado(cedulaEmpleado);
    console.log(aux.datosbase[0]);
    let datos = aux.datosbase[0];

    // datos.ingreso tiene el formato dd-mm-aa usar split para separarlos
    const fechaIngreso = datos.ingreso;
    let dia = fechaIngreso.split('-')[0];
    let mes = fechaIngreso.split('-')[1];
    let anio = fechaIngreso.split('-')[2];

    // el año esta en formato xxaa y se debe convertir a 20aa
    let anioConvertido = '20' + anio;
    anio = anioConvertido;

    const sumaTotal =
        parseInt(datos.saldos) +
        parseInt(datos.fondos) +
        parseInt(datos.mercados) +
        parseInt(datos.prestamoParaDescontar) +
        parseInt(datos.casino) +
        parseInt(datos.valoranchetas) +
        parseInt(datos.fondo) +
        parseInt(datos.carnet) +
        parseInt(datos.seguroFunerario) +
        parseInt(datos.prestamoParaHacer) +
        parseInt(datos.anticipoLiquidacion) +
        parseInt(datos.cuentas);

    console.log(sumaTotal);

    const fechaActual = new Date();


    if (parseInt(datos.saldos) >= 175000) {
        aviso('Ups no se pueden generar mercado porque superas los 175000 de saldo permitido', 'error');
    }
    else {
        // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado   
        let diaActual = fechaActual.getDate();
        let mesActual = fechaActual.getMonth() + 1;
        let anioActual = fechaActual.getFullYear();
        let fechaInicio = new Date(anio, mes, dia); // Asume que 'anio', 'mes', 'dia' representan la fecha de inicio del trabajador
        let fechaActualCompara = new Date(anioActual, mesActual, diaActual); // Asume que 'anioActual', 'mesActual', 'diaActual' representan la fecha actual
        let diferencia = Math.abs(fechaActualCompara - fechaInicio); // Diferencia en milisegundos
        let diasTrabajados = Math.ceil(diferencia / (1000 * 60 * 60 * 24)); // Conversión de milisegundos a días
        let codigoOH = 'M' + Math.floor(Math.random() * 1000000);
        // Si ha trabajado entre 8 y 15 dias puede pedir mercado de 150.000
        if ((diasTrabajados > 8 && diasTrabajados < 15)) {
            if ((sumaTotal + parseInt(nuevovalor) <= 15000)) {
                escribirCodigo(cedulaEmpleado, nuevovalor, codigoOH, cuotas, tipo, valor)
            }
            else {
                console.log("Entro4");
                aviso('Ups no se pueden generar mercado, puede sacar maximo ' + (150000 - (sumaTotal)), 'error');
                return;
            }
        }

        // Si ha trabajado entre 15 y 30 dias puede pedir mercado de 250.000
        else if ((diasTrabajados > 15 && diasTrabajados < 30)) {
            if ((sumaTotal + parseInt(nuevovalor) <= 250000)) {
                escribirCodigo(cedulaEmpleado, nuevovalor, codigoOH, valor)
            }
            else {
                console.log("Entro3");
                aviso('Ups no se pueden generar mercado, puede sacar maximo ' + (250000 - (sumaTotal)), 'error');
                return;
            }
        }

        // Si ha trabajado mas de 30 dias puede pedir mercado de 350.000
        else if ((diasTrabajados > 30)) {
            if ((sumaTotal + parseInt(nuevovalor) <= 350000)) {
                console.log("Entro");
                escribirCodigo(cedulaEmpleado, nuevovalor, codigoOH, valor)
            }
            else {
                console.log("Entro2");
                aviso('Ups no se pueden generar mercado, puede sacar maximo ' + (350000 - (sumaTotal)), 'error');
                return;
            }
        }
    }

    document.querySelector('#valor').value = "";
    document.querySelector('#cedula').value = "";

}
);

