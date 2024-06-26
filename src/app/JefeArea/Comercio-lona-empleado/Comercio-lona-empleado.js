
import { urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";

const boton = document.querySelector("#boton");

// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const iddatos = localStorage.getItem("idUsuario");
const sede = localStorage.getItem("sede");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');

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




numProducto.addEventListener('change', (e) => {
    const numProducto = document.querySelector('#numProducto');
    if (e.target.value == "0") {
        Cantidad.style.display = "none";
        Cantidad2.style.display = "none";
        Cantidad3.style.display = "none";
        Cantidad4.style.display = "none";
        codigo1.style.display = "none";
        codigo2.style.display = "none";
        codigo3.style.display = "none";
        codigo4.style.display = "none";
        cuerpo.style.height = "410px";
        document.querySelector('#codigo1').value = "";
        document.querySelector('#codigo2').value = "";
        document.querySelector('#codigo3').value = "";
        document.querySelector('#codigo4').value = "";
        document.querySelector('#Cantidad').value = "";
        document.querySelector('#Cantidad2').value = "";
        document.querySelector('#Cantidad3').value = "";
        document.querySelector('#Cantidad4').value = "";
    }
    if (e.target.value == "1") {
        Cantidad.style.display = "inline-block";
        Cantidad2.style.display = "none";
        Cantidad3.style.display = "none";
        Cantidad4.style.display = "none";
        codigo1.style.display = "inline-block";
        codigo2.style.display = "none";
        codigo3.style.display = "none";
        codigo4.style.display = "none";
        cuerpo.style.height = "480px";
        document.querySelector('#codigo2').value = "";
        document.querySelector('#codigo3').value = "";
        document.querySelector('#codigo4').value = "";
        document.querySelector('#Cantidad2').value = "";
        document.querySelector('#Cantidad3').value = "";
        document.querySelector('#Cantidad4').value = "";

    }
    else if (e.target.value == "2") {
        Cantidad.style.display = "inline-block";
        Cantidad2.style.display = "inline-block";
        Cantidad3.style.display = "none";
        Cantidad4.style.display = "none";
        codigo1.style.display = "inline-block";
        codigo2.style.display = "inline-block";
        codigo3.style.display = "none";
        codigo4.style.display = "none";
        cuerpo.style.height = "550px";

        document.querySelector('#codigo3').value = "";
        document.querySelector('#codigo4').value = "";
        document.querySelector('#Cantidad3').value = "";
        document.querySelector('#Cantidad4').value = "";
    }
    else if (e.target.value == "3") {
        Cantidad.style.display = "inline-block";
        Cantidad2.style.display = "inline-block";
        Cantidad3.style.display = "inline-block";
        Cantidad4.style.display = "none";
        codigo1.style.display = "inline-block";
        codigo2.style.display = "inline-block";
        codigo3.style.display = "inline-block";
        codigo4.style.display = "none";
        cuerpo.style.height = "620px";
        document.querySelector('#codigo4').value = "";
        document.querySelector('#Cantidad4').value = "";

    }
    else if (e.target.value == "4") {
        Cantidad.style.display = "inline-block";
        Cantidad2.style.display = "inline-block";
        Cantidad3.style.display = "inline-block";
        Cantidad4.style.display = "inline-block";
        codigo1.style.display = "inline-block";
        codigo2.style.display = "inline-block";
        codigo3.style.display = "inline-block";
        codigo4.style.display = "inline-block";
        cuerpo.style.height = "690px";
    }
});

async function datosTComercio() {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Comercio/comercio';

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


// Mostar contenido en una tabla
const tabla = document.querySelector("#tabla");

let datosComercializadoraGeneral = [];
datosComercializadoraGeneral = await datosTComercio();
let datosArreglo = datosComercializadoraGeneral.comercio;

// ordenar por fechaRecibida de mas reciente a mas nuevo formato 2023-12-14
datosArreglo.sort((a, b) => {
    if (a.fechaRecibida < b.fechaRecibida) {
        return 1;
    }
    if (a.fechaRecibida > b.fechaRecibida) {
        return -1;
    }
    return 0;
});


     
console.log(datosArreglo);

datosArreglo.forEach((p) => {
    if (p.destino == sede && p.cantidadRecibida != p.cantidadTotalVendida) {
        tabla.innerHTML += `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.concepto}</td>
            <td>${p.destino}</td>
            <td>${p.cantidadEnvio}</td>
            <td>${p.cantidadRecibida}</td>
            <td>${p.valorUnidad}</td>
            <td>${p.cantidadTotalVendida}</td>
            <td>${p.PersonaEnvia}</td>
            <td>${p.PersonaRecibe}</td>
        </tr>
    `
    }
});

function verificarCodigo(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            encontrado = true;
        }
    });
    return encontrado;
}

function obtenerCodigo(codigo, datos) {
    let cod = null;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            cod = doc;
        }
    });
    return cod;
}

function verificarCodigoComercio(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigo) {
            encontrado = true;
        }
    });
    return encontrado;
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

function verificaSelect(select) {
    let encontrado = false;
    if (select.value == '0') {
        aviso('Debe seleccionar una forma de pago', 'error');
        return false;
    }
    else {
        encontrado = true;
        return encontrado;
    }
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

function verificarCedula(codigoP, cedula, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.codigo == codigoP) {
            if (doc.cedulaQuienPide == cedula) {
                encontrado = true;
            }
        }
    });
    return encontrado;
}

function verificaMonto(monto, datos) {
    let encontrado = false;
    if (parseInt(datos.monto) >= monto) {
        encontrado = true;
    }
    return encontrado;
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

// ENCONTRAR EL CODIGO DE LA COMERCIALIZADORA
async function datosComercializadora(codigo, listaC) {
    for (let i = 0; i < listaC.length; i++) {
        if (listaC[i].codigo == codigo) {
            return listaC[i];
        }
    }
}

async function actualizar(codigo, cod, username, monto2, cuotas2) {
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
                    cuotas: cuotas2,
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

async function actualizarVentas(cantidad, cod, username) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);
    console.log(cantidad);
    const urlcompleta = urlBack.url + '/Comercio/jefedearea/ActualizarCantidadVendida/' + cod;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    cantidadTotalVendida: cantidad,
                    PersonaRecibe: username,
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

async function actualizarDatos(cedulaEmpleado, valor, cuotas) {
    var body = localStorage.getItem('key');
    const obj = JSON.parse(body);
    const jwtToken = obj.jwt;
    console.log(jwtToken);

    const urlcompleta = urlBack.url + '/Datosbase/jefedearea/actualizarAnchetas/' + cedulaEmpleado;
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    valoranchetas: valor,
                    cuotasAnchetas: cuotas,
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
                    over.style.display = "none";
                    loader.style.display = "none";
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {

                    over.style.display = "none";
                    loader.style.display = "none";
                    throw new Error('Error en la petición POST');
                }
            })
            .then(responseData => {
                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                over.style.display = "none";
                loader.style.display = "none";
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error en la petición HTTP POST');
        console.error(error);
    }
}

let isFunctionExecuting = false; // Variable para rastrear si la función está en ejecución


async function verificarDatosComercializadora(codigo, datosArreglo) {
    if (codigo === "") return { valorUnidad: 0, concepto: "", cantidadTotalVendida: 0 }; // Retorna un objeto vacío si el código está vacío
    const datos = await datosComercializadora(codigo, datosArreglo);
    return datos || { valorUnidad: 0, concepto: "", cantidadTotalVendida: 0 }; // Retorna los datos o un objeto vacío si son undefined
}

function validarInventario(datosProducto, sumaCantidad, numeroProducto) {
    if (sumaCantidad > datosProducto.cantidadRecibida) {
        //throw new Error(`No se puede cargar el mercado del producto #${numeroProducto} porque la suma de la cantidad supera el inventario disponible. Lo máximo a sacar es ${datosProducto.cantidadRecibida - datosProducto.cantidadTotalVendida}`);
        aviso("No se puede cargar el mercado del producto " + numeroProducto + " porque la suma de la cantidad supera el inventario disponible. Lo máximo a sacar es " + datosProducto.cantidadRecibida - datosProducto.cantidadTotalVendida, "error");
    }

}

// darle click al boton para que se ejecute la funcion
boton.addEventListener("click", async (e) => {
    if (isFunctionExecuting) {
        aviso('Se esta ejecutando la funcion', 'warning');
        return;
    }

    over.style.display = "block";
    loader.style.display = "block";

    isFunctionExecuting = true; // Marcar la función como en ejecución

    // Limpiar y obtener los valores de los inputs una sola vez
    const cedula = document.querySelector("#cedula").value;
    let codigoA = document.querySelector("#codigoA").value.replace(/\s+/g, ''); // Limpieza de espacios realizada una vez
    let cantidad = document.querySelector("#Cantidad").value;
    let cantidad2 = document.querySelector("#Cantidad2").value;
    let cantidad3 = document.querySelector("#Cantidad3").value;
    let cantidad4 = document.querySelector("#Cantidad4").value;
    let codigo = document.querySelector("#codigo1").value.replace(/\s+/g, '');
    let codigo2 = document.querySelector("#codigo2").value.replace(/\s+/g, '');
    let codigo3 = document.querySelector("#codigo3").value.replace(/\s+/g, '');
    let codigo4 = document.querySelector("#codigo4").value.replace(/\s+/g, '');

    try {
        const aux = await datosTCodigos();
        let CodigosMercado = aux.codigo;
        let aux2 = await datosEmpleado(cedula);
        let usuario = aux2.datosbase[0];

        if (aux2.datosbase == "No se encontró el registro para el ID proporcionado") {
            over.style.display = "none";
            loader.style.display = "none";
            aviso('Ups no se pueden generar mercado, el empleado no existe', 'error');
        }

        datosComercializadoraGeneral = await datosTComercio();
        let datosArreglo = datosComercializadoraGeneral.comercio;

        const datos = await datosComercializadora(codigo, datosArreglo);
        const datos2 = await verificarDatosComercializadora(codigo2, datosArreglo);
        const datos3 = await verificarDatosComercializadora(codigo3, datosArreglo);
        const datos4 = await verificarDatosComercializadora(codigo4, datosArreglo);

        // Convertir cantidades a números, asegurándose de que sean cero si están vacías
        cantidad = cantidad === "" ? 0 : parseInt(cantidad);
        cantidad2 = cantidad2 === "" ? 0 : parseInt(cantidad2);
        cantidad3 = cantidad3 === "" ? 0 : parseInt(cantidad3);
        cantidad4 = cantidad4 === "" ? 0 : parseInt(cantidad4);

        const sumaVentas = parseInt(cantidad) * parseInt(datos.valorUnidad) +
            parseInt(cantidad2) * datos2.valorUnidad +
            parseInt(cantidad3) * datos3.valorUnidad +
            parseInt(cantidad4) * datos4.valorUnidad;

        // Asegúrate de que 'datos', 'datos2', 'datos3', y 'datos4' tengan los campos necesarios.
        const sumaCantidad = parseInt(cantidad) + (datos.cantidadTotalVendida || 0);
        const sumaCantidad2 = cantidad2 + (datos2.cantidadTotalVendida || 0);
        const sumaCantidad3 = cantidad3 + (datos3.cantidadTotalVendida || 0);
        const sumaCantidad4 = cantidad4 + (datos4.cantidadTotalVendida || 0);

        const cod = obtenerCodigo(codigoA, CodigosMercado);

        // Validaciones de inventario
        validarInventario(datos, sumaCantidad, 1);
        validarInventario(datos2, sumaCantidad2, 2);
        validarInventario(datos3, sumaCantidad3, 3);
        validarInventario(datos4, sumaCantidad4, 4);


        if (!verificarCodigo(codigoA, CodigosMercado)) {
            isFunctionExecuting = false;
            over.style.display = "none";
            loader.style.display = "none";
            aviso("El codigo no existe", "error");
            return;
        }

        if (!verificarCodigoEstado(codigoA, CodigosMercado)) {
            isFunctionExecuting = false;
            over.style.display = "none";
            loader.style.display = "none";
            aviso("El codigo ya fue usado", "error");
            return
        }

        if (!verificarCedula(codigoA, cedula, CodigosMercado)) {
            isFunctionExecuting = false;
            over.style.display = "none";
            loader.style.display = "none";
            aviso("El codigo no pertenece a este empleado", "error");
            return;
        }

        if (!verificarCodigoComercio(codigo, datosArreglo) == true) {
            isFunctionExecuting = false;
            over.style.display = "none";
            loader.style.display = "none";
            aviso("El codigo de la comercializadora no existe", "error");
            return;
        }

        if (codigoA == "") {
            isFunctionExecuting = false;
            over.style.display = "none";
            loader.style.display = "none";
            aviso("Por favor ingrese el codigo de autorizacion generado por el coordinador", "error");
            return;
        }



        if (verificarCodigo(codigoA, CodigosMercado) == true) {

            if (codigoA.startsWith("MG")) {
                if (!verificaMonto(sumaVentas, cod) == true) {
                    isFunctionExecuting = false;
                    over.style.display = "none";
                    loader.style.display = "none";
                    aviso("El monto supera el monto maximo permitido solicitado antes", "error");
                    return;
                }
            }
            else {
                if (!verificaCondiciones(usuario, sumaVentas) == true) {
                    over.style.display = "none";
                    loader.style.display = "none";
                    isFunctionExecuting = false;
                    return;
                }
            }

            if (obtenerCodigo(codigoA, CodigosMercado) == null) {
                isFunctionExecuting = false;
                over.style.display = "none";
                loader.style.display = "none";
                aviso("El codigo de autorizacion no existe", "error");
                return;
            }

            let codigAux = "MOH" + Math.floor(Math.random() * 1000000 + 1);
            let concepto = datos.concepto;

            if (datos2) {
                concepto += " , " + datos2.concepto;
            }

            if (datos3) {
                concepto += " , " + datos3.concepto;
            }

            if (datos4) {
                concepto += " , " + datos4.concepto;
            }

            // modificar en la tabla codigos el estado del codigo a false para que no pueda ser usado nuevamente
            await CambiarEstado(cod.codigo, sumaVentas, codigAux);
            await actualizar(codigAux, cod.codigo, usernameLocal, sumaVentas, 2);
            await actualizarVentas(cantidad, codigo, usernameLocal);

            if (codigo2 != "") {
                await actualizarVentas(cantidad2, codigo2, usernameLocal);
            }
            if (codigo3 != "") {
                await actualizarVentas(cantidad3, codigo3, usernameLocal);
            }
            if (codigo4 != "") {
                await actualizarVentas(cantidad4, codigo4, usernameLocal);
            }
            await actualizarDatos(cedula, sumaVentas, 2);
            await historialT(sumaVentas);
            await escribirHistorial(cedula, sumaVentas, 2, "Compra tienda respecto a:" + concepto + " en " + sede, codigAux, cod.generadoPor);
            await sleep(2000); // Pausa de 2 segundos
            await ActualizarHistorial(codigAux);

            over.style.display = "none";
            loader.style.display = "none";

            isFunctionExecuting = false;

            let confirmacion = await avisoConfirmado('Acaba de pedir un mercado de ' + sumaVentas + ' su codigo es: ' + codigAux, 'success');

            if (confirmacion) {
                // recargar la pagina
                location.reload();
            }

        }
        else {
            isFunctionExecuting = false;
            aviso("El codigo de autorizacion no existe", "error");
        }
    } catch (error) {


    }



});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
