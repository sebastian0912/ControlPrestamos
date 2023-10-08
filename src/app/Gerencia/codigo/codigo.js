
import { urlBack } from "../../models/base.js";
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
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

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
    }
});

if (usernameLocal == "YENY SOTELO"){
    mercado.style.display = "inline-block"
}
else{
    mercado.style.display = "none"
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
    if (!codigo.startsWith("M")) {
        return true;
    }
    else {
        return false;
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

    const urlcompleta = urlBack.url + '/Datosbase/jefedearea/actualizarprestamodescontar/' + cedulaEmpleado;
    if (concepto == 'Dinero_Autorizacion') {
        try {
            fetch(urlcompleta, {
                method: 'POST',
                body:
                    JSON.stringify({
                        concepto: concepto,
                        prestamoParaDescontar: valor,
                        cuotasPrestamosParaDescontar: cuotas,
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
    else if (concepto == 'Seguro_Funerario_Autorizacion') {

        try {
            fetch(urlcompleta, {
                method: 'POST',
                body:
                    JSON.stringify({
                        concepto: concepto,
                        seguroFunerario: valor,
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
    else if (concepto == 'Otro_Autorizacion') {
        console.log('con2' + concepto);
        // quitar espacios en blanco a concepto
        concepto = concepto.replace(/\s/g, '');
        try {
            fetch(urlcompleta, {
                method: 'POST',
                body:
                    JSON.stringify({
                        concepto: concepto,
                        anticipoLiquidacion: valor,
                        cuentas: cuotas,
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
}

async function escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, tipo, codigo, generadoPor) {
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
                    cedula: cedulaEmpleado,
                    nombreQuienEntrego: '',
                    generadopor: generadoPor,
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
    let cedulaEmpleado = document.querySelector('#cedula').value;
    let codigoP = document.querySelector('#codigo').value;
    let valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');
    let cuotas = document.querySelector('#cuotas').value;

    let concepto2;

    if (codigoP == '') {
        isFunctionExecuting = false;
        aviso('El campo codigo no puede estar vacio', 'error');
    }

    // valor no sea 
    if (valor == '') {
        isFunctionExecuting = false;
        aviso('El campo codigo no puede estar vacio', 'error');
    }

    if (cuotas == "") {
        isFunctionExecuting = false;
        aviso('Ups no se pueden generar mercado, las cuotas no pueden estar vacias', 'error');
        return;
    }

    const aux = await datosTCodigos();
    console.log(aux.codigo);
    let aux2 = await datosEmpleado(cedulaEmpleado);
    console.log(aux2.datosbase[0]);
    let usuario = aux2.datosbase[0];
    console.log(usuario);

    const cod = obtenerCodigo(codigoP, aux.codigo);

    /*if (!esCodigoValido(cod.fechaGenerado)) {
        aviso('El codigo ya expiro', 'error');
        return;
    }*/

    if (aux2.datosbase == "No se encontró el registro para el ID proporcionado") {
        console.log("No existe");
        aviso('Ups no se pueden generar prestamo, el empleado no existe', 'error');
    }

    if (!verificarCodigo(codigoP, aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El código no existe', 'error');
        return;
    }
    if (!verificarCodigoEstado(codigoP, aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El código ya fue usado', 'error');
        return;
    }
    if (!verificarCedula(codigoP, cedulaEmpleado, aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El código no pertenece a este empleado', 'error');
        return;
    }
    if (!verificaMonto(parseInt(nuevovalor), aux.codigo)) {
        isFunctionExecuting = false;
        aviso('El monto del prestamo es mayor al permitido generado con el código ', 'error');
        return;
    }
    if (!verificaSiesUnPrestamo(codigoP)) {
        isFunctionExecuting = false;
        aviso('El código no es valido solo se admiten prestamos', 'error');
        return;
    }


    else {
        let concepto = null;
        concepto2 = 'Dinero_Autorizacion';
        concepto = 'Libranza_Prestamo_Dinero';

        let codigo = 'OH' + Math.floor(Math.random() * 1000000);;

        if (cod.codigo.startsWith("SF")) {
            concepto2 = 'Seguro_Funerario_Autorizacion';
            concepto = 'Libranza_Seguro_Funerario';

        }
        else if (cod.codigo.startsWith("OT")) {
            concepto2 = 'Otro_Autorizacion';
            concepto = 'Libranza_Otro_concepto';
        }

        await actualizar(codigo, cod.codigo, usernameLocal, nuevovalor, cuotas);
        await actualizarDatosBase(concepto2, nuevovalor, cuotas, cedulaEmpleado);
        await CambiarEstado(cod.codigo, nuevovalor, codigo);
        await escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, concepto, codigo, cod.generadoPor)
        await sleep(2000); // Pausa de 2 segundos
        await ActualizarHistorial(codigo);
        await sleep(4000); // Pausa de 2 segundos
        document.getElementById('successSound').play();

        isFunctionExecuting = false;

        let confirmacion = await avisoConfirmado('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + codigo, 'success');

        if (confirmacion) {
            // recargar la pagina
            location.reload();
        }
    }

});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}









