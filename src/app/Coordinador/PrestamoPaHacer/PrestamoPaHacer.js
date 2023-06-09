import { codigo } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const idUsuario = localStorage.getItem("idUsuario");

// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
//Muestra en la parte superior el nombre y el perfil
username.innerHTML = usernameLocal;
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
        if (dias2 == 0){
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

async function escribirCodigo(data, cedulaEmpleado, nuevovalor, valor, cuotas, tipo) {

    const docCoordinador = doc(db, "Codigos", idUsuario);
    const coordninador = await getDoc(docCoordinador);
    data.codigo = tipo;
    data.monto = nuevovalor;
    data.uid = idUsuario;
    data.cuotas = cuotas;
    data.cedulaQuienPide = cedulaEmpleado;
    data.fechaGenerado = new Date().toLocaleDateString()
    data.generadoPor = usernameLocal;

    if (coordninador.exists()) {
        // generar un codigo aleatorio para el prestamo        
        // Actualizar en la base de datos
        await updateDoc(doc(db, "Codigos", idUsuario), {
            prestamos: arrayUnion(data)
        });
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
    }
    else {
        await setDoc(docCoordinador, {
            prestamos: [data]
        });
        //await setDoc(doc(db, "Codigos", idUsuario), data);
        aviso('Acaba de pedir un prestamo de ' + valor + ' su codigo es: ' + data.codigo, 'success');
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

let tipo = document.querySelector('#tipo');
tipo.addEventListener('change', (e) => {
    const valor = document.querySelector('#valor');
    const cuotas = document.querySelector('#cuotas');

    if (e.target.value == "Otro" || e.target.value == "Dinero") {
        valor.style.display = "inline-block";
        cuotas.style.display = "inline-block";
    }
    else if (e.target.value == "Seguro Funerario") {
        valor.style.display = "block";
        cuotas.style.display = "none";
    }
    else {
        valor.style.display = "none";
        cuotas.style.display = "none";
    }
});

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    let valor = document.querySelector('#valor').value;
    let nuevovalor = valor.replace(/\,/g, '');
    let cedulaEmpleado = document.querySelector('#cedula').value;
    let cuotas = document.querySelector('#cuotas').value;
    let tipo = document.querySelector('#tipo').value;

    if (!verificaSelect(formaPago)) {
        return;
    }

    const docRef = doc(db, "Base", cedulaEmpleado);
    const docSnap = await getDoc(docRef);

    const datos = docSnap.data();

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
        parseInt(datos.prestamoPaDescontar) +
        parseInt(datos.casino) +
        parseInt(datos.anchetas) +
        parseInt(datos.fondo) +
        parseInt(datos.carnet) +
        parseInt(datos.seguroFunerario) +
        parseInt(datos.prestamoPaHacer) +
        parseInt(datos.anticipoLiquidacion) +
        parseInt(datos.cuentas);

    const fechaActual = new Date();
    let codigoOH = null;

    if (parseInt(datos.saldos) >= 175000) {
        aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        return;
    }
    else if (parseInt(datos.fondos) > 0) {
        aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
        return;
    }
    else {
        // VERIFICAR EL TIPO QUE SE ESTA SELECCIONANDO        
        if (tipo == "Seguro Funerario") {
            codigoOH = 'SF' + Math.floor(Math.random() * 1000000);
            cuotas = 1;
        }
        else if (tipo == "Dinero") {
            codigoOH = 'PH' + Math.floor(Math.random() * 1000000);            
        }
        else if (tipo == "Otro") {
            codigoOH = 'OT' + Math.floor(Math.random() * 1000000);
        }

        // conseguir la fecha actual y separarla en dia, mes y año para poder compararla con la fecha de ingreso del empleado            
        let mesActual = fechaActual.getMonth() + 1;
        let anioActual = fechaActual.getFullYear();
        let bandera = false;

        if ((anioActual == anio) && ((mesActual - mes) >= 2)) {
            if (parseInt(nuevovalor) >= 200001) {
                aviso('Ups no se pueden generar el prestamo que superas los 200.000', 'error');
                bandera = false;
                return;
            }
            else if (sumaTotal >= 350001 || (sumaTotal + parseInt(nuevovalor)) >= 350001) {
                bandera = false;
                aviso('Ups no se pueden generar prestamos, puede sacar maximo ' + (350000 - (sumaTotal)), 'error');
                return;
            }
            else {
                let data = codigo;
                bandera = true;
                escribirCodigo(data, cedulaEmpleado, nuevovalor, valor, cuotas, codigoOH)
            }
        }
        else if ((anioActual > anio)) {
            if (parseInt(nuevovalor) >= 200001) {
                bandera = false;
                aviso('Ups no se pueden generar el prestamo que superas los 200.000', 'error');
                return;
            }
            else if (sumaTotal >= 350001 || (sumaTotal + parseInt(nuevovalor)) >= 350001) {
                bandera = false;
                aviso('Ups no se pueden generar prestamos, puede sacar maximo ' + (350000 - (sumaTotal)), 'error');
                return;
            }
            else {
                bandera = true;
                let data = codigo;
                escribirCodigo(data, cedulaEmpleado, nuevovalor, valor, cuotas, codigoOH)
            }
        }
        if (bandera == true) {
            const datosUsuario = await getDoc(doc(db, "Base", cedulaEmpleado));
            const usuario = datosUsuario.data();
            let empresa = null;
            let NIT = null;
            let direcccion = null;
            if (usuario.temporal.startsWith("Apoyo") || usuario.temporal.startsWith("APOYO")) {
                empresa = "APOYO LABORAL TS SAS";
                NIT = "NIT 900814587"
                direcccion = "CALLE 112 A No. 18 A -05"
            }
            else if (usuario.temporal.startsWith("Tu") || usuario.temporal.startsWith("TU")) {
                empresa = "TU ALIANZA SAS";
                NIT = "NIT 900864596 - 1"
                direcccion = "CRA 2 N 8- 156 FACATATIVA'"
            }
            else if (usuario.temporal.startsWith("Comercializadora") || usuario.temporal.startsWith("COMERCIALIZADORA")) {
                empresa = "COMERCIALIZADORA TS";
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


            docPdf.text('Yo, ' + usuario.nombre + ' mayor de edad,  identificado con la cedula de ciudadania No. '
                + usuario.cedula + ' autorizo', 10, 55);
            docPdf.text('expresa e irrevocablemente para que del sueldo, salario, prestaciones sociales o de cualquier suma de la sea acreedor; me sean', 10, 60);
            docPdf.text('descontados la cantidad de ' + valor + ' (Letras)  ' + NumeroALetras(nuevovalor) + 'por concepto de' + ' PRESTAMO, en ' + cuotas + ' cuota(s), ', 10, 65);
            docPdf.text('quincenal del credito del que soy deudor ante Tu alianza S.A.S. , aun en el evento de encontrarme disfrutando de mis licencias ', 10, 70);
            docPdf.text('o incapacidades. ', 10, 75);

            docPdf.text('Fecha de ingreso: ' + usuario.ingreso, 10, 90);
            docPdf.text('Centro de Costo: ' + usuario.finca, 130, 90);
            docPdf.text('Forma de pago: ' + formaPago.value, 10, 95);
            docPdf.text('Telefono: ' + celular.value, 130, 95);
            docPdf.setFont('Helvetica', 'bold');
            docPdf.text('Cordialmente ', 10, 110);
            docPdf.setFont('Helvetica', 'normal');
            docPdf.text('Firma de Autorización ', 10, 115);
            docPdf.text('C.C. ' + usuario.cedula, 10, 120);

            // realizar un cuadro para colocar la huella dactilar
            docPdf.rect(130, 110, 35, 45);
            docPdf.text('Codigo de autorización nomina: ' + codigoOH, 10, 130);
            docPdf.setFont('Helvetica', 'bold');
            docPdf.setFontSize(6);
            docPdf.text('Huella Indice Derecho', 130, 105);

            docPdf.save('PrestamoDescontar' + '_' + usuario.nombre + "_" + codigoOH + '.pdf');
        }
    }
    valor = '';
    nuevovalor = '';
    cuotas = '';
    cedulaEmpleado = '';
});


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









