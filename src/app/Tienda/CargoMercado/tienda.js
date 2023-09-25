
import { urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";


const boton = document.querySelector('#boton');

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
const sede = localStorage.getItem("sede");

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

/*Convertir valor a separado por miles*/
const numemoroM = document.querySelector('#valor');
numemoroM.addEventListener('keyup', (e) => {
    var num = numemoroM.value.replace(/\,/g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/, '');
        numemoroM.value = num;
    } else {
        aviso("Solo se permiten numeros", "error");
        return
    }
});


if (usernameLocal == "Señora Carmen" || usernameLocal == "SEÑORA CARMEN" || usernameLocal == "señora carmen") {
    lola.style.display = "inline-block";
}
else {
    lola.style.display = "none";
}


if (usernameLocal == "Señora Carmen" || usernameLocal == "SEÑORA CARMEN" || usernameLocal == "señora carmen"
    || usernameLocal == "Señora Lola" || usernameLocal == "SEÑORA LOLA" || usernameLocal == "señora lola"
    || usernameLocal == "Señor Luis" || usernameLocal == "SEÑOR LUIS" || usernameLocal == "señor luis") {
    lola2.style.display = "inline-block";
}
else {
    lola2.style.display = "none";
}


function verificarCedula(codigoP, cedulaEmpleado, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigoP) {
            if (doc.cedulaQuienPide == cedulaEmpleado) {
                encontrado = true;
            }
        }
    });
    return encontrado;
}

function verificarCodigo(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            encontrado = true;
        }
    });
    return encontrado;
}

function verificarCodigoEstado(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigo && doc.estado == true) {
            encontrado = true;
        }
    });
    return encontrado;
}

function verificaMonto(monto, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (parseInt(doc.monto) >= monto) {
            encontrado = true;
        }
    });
    return encontrado;
}

function obtenerCodigo(codigo, datos) {
    let cod;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            cod = doc;
        }
    });
    return cod;
}

function verificaSiesUnPrestamo(codigo) {
    if (!codigo.startsWith("P")) {
        return false;
    }
    else {
        return true;
    }
}

function verificaCondiciones(datos, nuevovalor) {
    // datos.ingreso tiene el formato dd-mm-aa usar split para separarlos
    const fechaIngreso = datos.ingreso;
    let dia = fechaIngreso.split("-")[0];
    let mes = fechaIngreso.split("-")[1];
    let anio = fechaIngreso.split("-")[2];

    // el año esta en formato xxaa y se debe convertir a 20aa
    let anioConvertido = "20" + anio;
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

    const fechaActual = new Date();

    if (parseInt(datos.saldos) >= 175000) {
        aviso("Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido", "error");
        return false;
    }
    else {
        // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado   
        let diaActual = fechaActual.getDate();
        let mesActual = fechaActual.getMonth() + 1;
        let anioActual = fechaActual.getFullYear();
        let fechaInicio = new Date(anio, mes, dia); // Asume que "anio", "mes", "dia" representan la fecha de inicio del trabajador
        let fechaActualCompara = new Date(anioActual, mesActual, diaActual); // Asume que "anioActual", "mesActual", "diaActual" representan la fecha actual
        let diferencia = Math.abs(fechaActualCompara - fechaInicio); // Diferencia en milisegundos
        let diasTrabajados = Math.ceil(diferencia / (1000 * 60 * 60 * 24)); // Conversión de milisegundos a días

        // Si ha trabajado entre 8 y 15 dias puede pedir prestamo de 150.000
        if ((diasTrabajados > 8 && diasTrabajados <= 15)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 150001)) {
                aviso("Ups no se pueden generar mercado, puede sacar maximo " + (150000 - (sumaTotal)), "error");
                return false;
            }
            else {
                return true;
            }

        }

        // Si ha trabajado entre 15 y 30 dias puede pedir prestamo de 250.000
        else if ((diasTrabajados > 15 && diasTrabajados <= 30)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 250001)) {
                aviso("Ups no se pueden generar mercado, puede sacar maximo " + (250000 - (sumaTotal)), "error");
                return false;
            }
            else {
                return true;
            }
        }

        // Si ha trabajado mas de 30 dias puede pedir prestamo de 350.000
        else if ((diasTrabajados > 30)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 350001)) {
                aviso("Ups no se pueden generar mercado, puede sacar maximo " + (350000 - (sumaTotal)), "error");
                return false;
            }
            else {
                return true;
            }
        }
        else {
            aviso("Ups no se pueden generar mercado, el empleado no tiene los dias suficientes para pedir prestamo", "error");
            return false;
        }

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
            aviso('Ups no se pueden generar mercado, el empleado no existe', 'error');
            throw new Error('Error en la petición GET');
        }
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
        throw error; // Propaga el error para que se pueda manejar fuera de la función
    }
}

async function actualizar(codigo, cod, username, monto2, cuotas) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Codigo/jefedearea/actualizarCodigo/' + cod;

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigoDescontado: codigo,
                    ejecutadoPor: username,
                    nuevomonto: monto2,
                    cuotas: cuotas,
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

async function actualizarDatosBase(concepto, valor, cuotas, cedulaEmpleado) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Datosbase/tienda/actualizarMercados/' + cedulaEmpleado;

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    concepto: concepto,
                    mercados: valor,
                    cuotasMercados: cuotas,
                    ejecutadoPor: username,
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

async function CambiarEstado(cod, valor, codigo) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Codigo/jefedearea/cambiarEstadoCodigo/' + cod;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    estado: false,
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

async function escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, tipo, codigo, generadopor) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);
    var dia = new Date().getDate();
    var mes = new Date().getMonth() + 1;
    var anio = new Date().getFullYear();
    // yyyy-mm-dd
    const fecha = anio + '-' + mes + '-' + dia;
    const urlcompleta = urlBack.url + '/Historial/jefedearea/crearHistorialPrestamo/' + cedulaEmpleado;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: codigo,
                    nombreQuienEntrego: '',
                    generadopor: generadopor,
                    valor: nuevovalor,
                    cuotas: cuotas,
                    fechaEfectuado: fecha,
                    concepto: tipo,
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

async function historialT(valor) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Tienda/actualizarTienda';

    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    nombre: usernameLocal,
                    valorTotal: valor,
                    numPersonasAtendidas: 1,
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

async function ActualizarHistorial(codigo) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);
    const urlcompleta = urlBack.url + '/Historial/actualizarXcodigo/' + codigo;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: codigo,
                    nombreQuienEntrego: usernameLocal,
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

function esCodigoValido(fechaGeneradoStr) {
    const hoy = new Date(); // Obtiene la fecha actual
    const fechaGenerado = new Date(fechaGeneradoStr);
    const diaGenerado = fechaGenerado.getDate();
    const diaLimite = diaGenerado <= 13 ? 27 : 13;

    if (diaGenerado <= diaLimite || diaGenerado === 13) {
        // El código es válido
        return true;
    } else {
        // El código no es válido
        return false;
    }
}

let isFunctionExecuting = false; // Variable para rastrear si la función está en ejecución

boton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (isFunctionExecuting) {
        // Puedes mostrar un mensaje o simplemente regresar sin hacer nada
        aviso('Se esta ejecutando la funcion', 'warning');
        return;
    }

    isFunctionExecuting = true; // Marcar la función como en ejecución
    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;
    const codigoP = document.querySelector('#codigo').value;
    const valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');

    let concepto;

    if (codigoP == '') {
        isFunctionExecuting = false;
        aviso('El campo codigo no puede estar vacio', 'error');
    }

    else {
        const aux = await datosTCodigos();
        console.log(aux.codigo);
        let datos = aux.codigo;
        let aux2 = await datosEmpleado(cedulaEmpleado);
        console.log(aux2.datosbase[0]);
        let datosUsuario = aux2.datosbase[0];
        console.log(datosUsuario);
        const cod = obtenerCodigo(codigoP, datos);

        /*if (!esCodigoValido(cod.fechaGenerado)) {
            aviso('El codigo ya expiro', 'error');
            return;
        }*/

        if (!verificarCodigo(codigoP, datos)) {
            isFunctionExecuting = false;
            aviso('El codigo no existe', 'error');
            return;
        }

        if (!verificarCodigoEstado(codigoP, datos)) {
            isFunctionExecuting = false;
            aviso('El codigo ya fue usado', 'error');
            return
        }
        
        if (!verificarCedula(codigoP, cedulaEmpleado, datos)) {
            isFunctionExecuting = false;
            aviso('El codigo no pertenece a este empleado', 'error');
            return;
        }

        if (verificaSiesUnPrestamo(codigoP)) {
            isFunctionExecuting = false;
            aviso('El codigo no es valido solo se admiten mercado', 'error');
            return;
        }

        if (!verificaCondiciones(datosUsuario, parseInt(nuevovalor)) == true) {
            isFunctionExecuting = false;
            return;
        }

        console.log("entro");

        concepto = 'Compra tienda de ' + usernameLocal;

        // generar codigo solo numeros aleatorios
        let codigoAux = 'MOH' + Math.floor(Math.random() * 1000000);

        await CambiarEstado(codigoP, nuevovalor, codigoAux);
        await actualizar(codigoAux, codigoP, usernameLocal, nuevovalor, 2);

        await escribirHistorial(cedulaEmpleado, nuevovalor, 2, concepto, codigoAux, cod.generadoPor);
        await sleep(2000); // Pausa de 2 segundos
        await ActualizarHistorial(codigoAux);

        await historialT(nuevovalor);
        await actualizarDatosBase(concepto, nuevovalor, 2, cedulaEmpleado);
        await sleep(1000); // Pausa de 2 segundos

        isFunctionExecuting = false;

        let confirmacion = await avisoConfirmado('Acaba de pedir un mercado de ' + valor + ' su codigo es: ' + codigoAux, 'success');

        if (confirmacion) {
            // recargar la pagina
            location.reload();
        }

    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


