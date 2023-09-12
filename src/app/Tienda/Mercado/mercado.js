import { urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";


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

/*Convertir valor a separado por miles*/
const numemoroM = document.querySelector('#monto');
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
    }
}

async function escribirHistorial(cedulaEmpleado, nuevovalor, cuotas, tipo, codigo) {
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
    // usernameLocal es el usuario que esta en la sesion sin la ñ
    //let usernameLocal2 = usernameLocal.replace(/ñ/g, 'n');
    try {
        fetch(urlcompleta, {
            method: 'POST',
            body:
                JSON.stringify({
                    codigo: codigo,
                    cedula: cedulaEmpleado,
                    nombreQuienEntrego: '',
                    generadopor: usernameLocal,
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

formaPago.addEventListener('change', (e) => {
    const numerodepago = document.querySelector('#celular');

    if (e.target.value == "Daviplata") {
        numerodepago.placeholder = "Número de Daviplata";
    }
    else if (e.target.value == "Master") {
        numerodepago.placeholder = "Número de tarjeta Master";
    }
    else if (e.target.value == "Efectivo") {
        numerodepago.placeholder = "";
    }
    else {
        numerodepago.placeholder = "Número de cuenta";
    }
});

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    // capturar los datos del formulario
    let cedulaEmpleado = document.querySelector('#cedula').value;

    let aux = await datosEmpleado(cedulaEmpleado);
    console.log(aux.datosbase[0]);
    let datos = aux.datosbase[0];

    if (datos == undefined) {
        aviso('Ups no se pueden generar mercado, el empleado no existe', 'error');
        return;
    }

    if (parseInt(datos.saldos) > 175000) {
        aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        return;
    }


    boton.style.display = "none";

    boton.style.display = "none";
    cedula.style.display = "none";

    monto.style.display = "inline-block";
    boton2.style.display = "inline-block";
    formaPago.style.display = "inline-block";
    celular.style.display = "inline-block";


    console.log(datos.nombre);
    datosPersona.innerHTML = datos.nombre;

    boton2.addEventListener('click', async (e) => {
        e.preventDefault();
        let valor = document.querySelector('#monto').value;
        let nuevovalor = valor.replace(/\,/g, '');

        let codigoOH = 'M' + Math.floor(Math.random() * 1000000);

        if (datos == undefined) {
            aviso('Ups no se pueden generar mercado, el empleado no existe', 'error');
            return;
        }

        if (valor == "") {
            aviso('Ups no se pueden generar mercado, el monto no puede estar vacio', 'error');
            return;
        }

        if (formaPago.value != "Efectivo" && formaPago.value != "0") {
            // campo celular debe tener 10 digitos
            if (celular.value.length != 10) {
                aviso('Ups no se pueden generar mercado, el número proporcionado debe tener 10 digitos', 'error');
                return;
            }
        }

        if (!verificaCondiciones(datos, nuevovalor) == true) {
            return;
        }

        await escribirHistorial(cedulaEmpleado, nuevovalor, 2, 'Autorizacion de Mercado', codigoOH);

        await escribirCodigo(cedulaEmpleado, nuevovalor, codigoOH, valor)

        let empresa = null;
        let NIT = null;
        let direcccion = null;

        if (datos.temporal.startsWith("Apoyo") || datos.temporal.startsWith("APOYO")) {
            empresa = "APOYO LABORAL TS SAS";
            NIT = "NIT 900814587"
            direcccion = "CRA 2 N 8-156 FACATATIVA"
        }
        else if (datos.temporal.startsWith("Tu") || datos.temporal.startsWith("TU")) {
            empresa = "TU ALIANZA SAS";
            NIT = "NIT 900864596"
            direcccion = "Calle 7 N 4-49 MADRID'"
        }
        else if (datos.temporal.startsWith("Comercializadora") || datos.temporal.startsWith("COMERCIALIZADORA")) {
            empresa = "COMERCIALIZADORA TS";
            NIT = "NIT 901602948"
            direcccion = "CRA 1 N 17-37 BRAZILIA"
        }

        var docPdf = new jsPDF();

        docPdf.addFont('Helvetica-Bold', 'Helvetica', 'bold');

        docPdf.setFontSize(9);
        docPdf.text('______________________________________________________________________________________________________________', 10, 10);
        docPdf.setFontSize(24);
        docPdf.setFont('Helvetica', 'bold');
        docPdf.text(empresa, 15, 22);
        docPdf.setFont('Helvetica', 'normal');
        docPdf.setFontSize(9);
        docPdf.text('AUTORIZACION DE LIBRANZA', 132, 15);
        docPdf.text(NIT, 145, 20);
        docPdf.text(direcccion, 135, 25);
        docPdf.text('______________________________________________________________________________________________________________', 10, 27);
        docPdf.text('______________________________________________________________________________________________________________', 10, 29);


        docPdf.text('Fecha de Solicitud: ' + new Date().toLocaleDateString(), 10, 40);
        // salto de linea
        docPdf.setFont('Helvetica', 'bold');

        docPdf.text('ASUNTO: CREDITO (PRESTAMO)', 10, 50);
        docPdf.setFont('Helvetica', 'normal');


        docPdf.text('Yo, ' + datos.nombre + ' mayor de edad,  identificado con la cedula de ciudadania No. '
            + datos.numero_de_documento + ' autorizo', 10, 55);
        docPdf.text('expresa e irrevocablemente para que del sueldo, salario, prestaciones sociales o de cualquier suma de la sea acreedor; me sean', 10, 60);
        docPdf.text('descontados la cantidad de ' + valor + ' " ' + NumeroALetras(nuevovalor) + ' " ' + 'por concepto de' + ' Mercado, ', 10, 65);
        docPdf.text('en 2 cuota(s), quincenal del credito del que soy deudor ante ' + empresa + ' , aun en el evento de encontrarme ', 10, 70);
        docPdf.text('disfrutando de mis licencias o incapacidades. ', 10, 75);

        docPdf.text('Fecha de ingreso: ' + datos.ingreso, 10, 85);
        docPdf.text('Centro de Costo: ' + datos.finca, 130, 85);
        docPdf.text('Forma de pago: ' + formaPago.value, 10, 90);
        docPdf.text('Telefono: ' + celular.value, 130, 90);
        docPdf.setFont('Helvetica', 'bold');
        docPdf.text('Cordialmente ', 10, 100);
        docPdf.setFont('Helvetica', 'normal');
        docPdf.text('Firma de Autorización ', 10, 110);
        docPdf.text('C.C. ' + datos.numero_de_documento, 10, 115);

        // realizar un cuadro para colocar la huella dactilar
        docPdf.rect(130, 97, 25, 30);
        docPdf.text('Codigo de autorización nomina: ' + codigoOH, 10, 120);
        docPdf.text('___________________________________', 10, 130);
        docPdf.text(datos.nombre, 10, 135);

        docPdf.setFont('Helvetica', 'bold');
        docPdf.setFontSize(6);
        docPdf.text('Huella Indice Derecho', 130, 95);

        docPdf.save('PrestamoDescontar' + '_' + datos.nombre + "_" + codigoOH + '.pdf');

        let confirmacion = await avisoConfirmado('Acaba de pedir una autorización de mercado por un valor de ' + valor + ' su codigo es: ' + codigoOH, 'success');

        if (confirmacion) {
            // recargar la pagina
            location.reload();
        }

    }
    );

}
);


/*************************************************************/
// NumeroALetras
// The MIT License (MIT)
// 
// Copyright (c) 2015 Luis Alfredo Chee 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// @author Rodolfo Carmona
// @contributor Jean (jpbadoino@gmail.com)
/*************************************************************/
function Unidades(num) {

    switch (num) {
        case 1: return "UN";
        case 2: return "DOS";
        case 3: return "TRES";
        case 4: return "CUATRO";
        case 5: return "CINCO";
        case 6: return "SEIS";
        case 7: return "SIETE";
        case 8: return "OCHO";
        case 9: return "NUEVE";
    }

    return "";
}//Unidades()

function Decenas(num) {

    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
        case 1:
            switch (unidad) {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch (unidad) {
                case 0: return "VEINTE";
                default: return "VEINTI" + Unidades(unidad);
            }
        case 3: return DecenasY("TREINTA", unidad);
        case 4: return DecenasY("CUARENTA", unidad);
        case 5: return DecenasY("CINCUENTA", unidad);
        case 6: return DecenasY("SESENTA", unidad);
        case 7: return DecenasY("SETENTA", unidad);
        case 8: return DecenasY("OCHENTA", unidad);
        case 9: return DecenasY("NOVENTA", unidad);
        case 0: return Unidades(unidad);
    }
}//Unidades()

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + " Y " + Unidades(numUnidades)

    return strSin;
}//DecenasY()

function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + Decenas(decenas);
        case 3: return "TRESCIENTOS " + Decenas(decenas);
        case 4: return "CUATROCIENTOS " + Decenas(decenas);
        case 5: return "QUINIENTOS " + Decenas(decenas);
        case 6: return "SEISCIENTOS " + Decenas(decenas);
        case 7: return "SETECIENTOS " + Decenas(decenas);
        case 8: return "OCHOCIENTOS " + Decenas(decenas);
        case 9: return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
}//Centenas()

function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
}//Seccion()

function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = Seccion(num, divisor, "MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
}//Miles()

function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "")
        return strMiles;

    return strMillones + " " + strMiles;
}//Millones()

function NumeroALetras(num) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: 'Pesos',//"PESOS", 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular: 'Peso', //"PESO", 'Dólar', 'Bolivar', 'etc'

        letrasMonedaCentavoPlural: "CENTAVOS",
        letrasMonedaCentavoSingular: "CENTAVO"
    };

    if (data.centavos > 0) {
        data.letrasCentavos = "CON " + (function () {
            if (data.centavos == 1)
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
            else
                return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
        })();
    };

    if (data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}









