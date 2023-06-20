import { doc, getDoc, getDocs, setDoc, updateDoc, collection, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";
import { codigo, historial } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";


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

function verificarCedula(codigoP, cedulaEmpleado, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.codigo == codigoP) {
                if (p.cedulaQuienPide == cedulaEmpleado) {
                    encontrado = true;
                }
            }
        });
    });
    return encontrado;
}

function verificarCodigo(codigo, datos) {
    let encontrado = false;

    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;

        prestamos.forEach(p => {
            if (p.codigo == codigo) {
                encontrado = true;
            }
        });
    });
    return encontrado;
}

function verificarCodigoEstado(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.estado == true) {
                encontrado = true;
            }
        });
    });
    return encontrado;
}

function verificaMonto(monto, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (parseInt(p.monto) >= monto) {
                encontrado = true;
            }
        });
    });
    return encontrado;
}

function obtenerCodigo(codigo, datos) {
    let cod;
    datos.forEach(doc => {
        const codigos = doc.data().prestamos;
        codigos.forEach(c => {
            if (c.codigo == codigo) {
                cod = c;
            }
        });
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

boton.addEventListener('click', async (e) => {
    e.preventDefault();

    // capturar los datos del formulario
    const cedulaEmpleado = document.querySelector('#cedula').value;
    const codigoP = document.querySelector('#codigo').value;
    const valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');
    const cuotas = document.querySelector('#cuotas').value;
    const celular = document.querySelector('#celular').value;

    let encontrado = false;
    let concepto;

    if (codigoP == '') {
        aviso('El campo codigo no puede estar vacio', 'error');
    }
    else {
        const datos = await getDocs(collection(db, "Codigos"));
        const datosUsuario = await getDoc(doc(db, "Base", cedulaEmpleado));
        const usuario = datosUsuario.data();
        let todas = false;
        console.log(datosUsuario)
        if (!verificarCodigo(codigoP, datos)) {
            aviso('El codigo no existe', 'error');
            return;
        }
        if (!verificarCodigoEstado(codigoP, datos)) {
            aviso('El codigo ya fue usado', 'error');
            return
        }
        if (!verificarCedula(codigoP, cedulaEmpleado, datos)) {
            aviso('El codigo no pertenece a este empleado', 'error');
            return;
        }
        if (!verificaMonto(parseInt(nuevovalor), datos)) {
            aviso('El monto del prestamo es mayor al permitido generado por el coodinador', 'error');
            return;
        }
        if (!verificaSiesUnPrestamo(codigoP)) {
            aviso('El codigo no es valido solo se admiten prestamos', 'error');
            return;
        }
        if (!verificaSelect(tipo)) {
            return;
        }
        else {


            const cod = obtenerCodigo(codigoP, datos);
            concepto = 'Prestamo para hacer';
            encontrado = true;

            if (usuario.cuotasPrestamos != "0" && usuario.cuotasPrestamos != "" || parseInt(usuario.cuotasPrestamos) > 0) {
                await updateDoc(doc(db, "Base", cedulaEmpleado), {
                    prestamoPaDescontar: parseInt(usuario.prestamoPaDescontar) + parseInt(nuevovalor),
                });
            }
            else {
                await updateDoc(doc(db, "Base", cedulaEmpleado), {
                    prestamoPaDescontar: parseInt(usuario.prestamoPaDescontar) + parseInt(nuevovalor),
                    cuotasPrestamos: parseInt(cuotas)
                });
            }

            // modificar la variable estado dentro del arreglo y subir cambios a firebase
            cod.estado = false;
            cod.fechaEjecutado = new Date().toLocaleDateString()
            cod.ejecutadoPor = usernameLocal;
            // generar codigo solo numeros aleatorios
            cod.codigoDescontado = 'OH' + Math.floor(Math.random() * (999999 - 100000)) + 100000;


            await setDoc(doc(db, "Codigos", cod.uid), {
                prestamos: arrayUnion(cod)
            });

            // crear un nuevo registro en la coleccion historial
            const docEmpleado = doc(db, "Historial", cedulaEmpleado);
            const empleadoRef = await getDoc(docEmpleado);
            let data = historial;
            if (empleadoRef.exists()) {
                data.cedula = cedulaEmpleado;
                data.concepto = concepto;
                data.fechaEfectuado = new Date().toLocaleDateString()
                data.valor = nuevovalor;
                data.cuotas = cod.cuotas;
                data.nombreQuienEntrego = usernameLocal;
                data.timesStamp = new Date().getTime();
                await updateDoc(doc(db, "Historial", cedulaEmpleado), {
                    historia: arrayUnion(data)
                });
            }
            else {
                data.cedula = cedulaEmpleado;
                data.concepto = concepto;
                data.fechaEfectuado = new Date().toLocaleDateString()
                data.valor = nuevovalor;
                data.cuotas = cod.cuotas;
                data.nombreQuienEntrego = usernameLocal;
                data.timesStamp = new Date().getTime();
                await setDoc(docEmpleado, {
                    historia: [data]
                });
            }

            aviso('Acaba de pedir un prestamo de ' + valor, 'success');

            var docPdf = new jsPDF();

            docPdf.addFont('Helvetica-Bold', 'Helvetica', 'bold');


            docPdf.setFontSize(9);
            docPdf.text('______________________________________________________________________________________________________________', 10, 10);
            docPdf.setFontSize(24);
            docPdf.setFont('Helvetica', 'bold');
            docPdf.text('TU ALIANZA S.A.S', 30, 19);
            docPdf.setFont('Helvetica', 'normal');
            docPdf.setFontSize(9);
            docPdf.text('AUTORIZACION DE DESCUENTO', 132, 15);
            docPdf.text('TU ALIANZA SAS NIT 900864596 - 1', 130, 20);
            docPdf.text('CRA 2 N 8- 156 FACATATIVA', 135, 25);
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
            docPdf.text('Forma de pago: ' + tipo.value, 10, 95);
            docPdf.setFont('Helvetica', 'bold');
            docPdf.text('Cordialmente ', 10, 110);
            docPdf.setFont('Helvetica', 'normal');
            docPdf.text('Firma de Autorización ', 10, 115);
            docPdf.text('C.C. ' + usuario.cedula, 10, 120);
            docPdf.text('Telefono: ' + celular, 10, 125);
            // realizar un cuadro para colocar la huella dactilar
            docPdf.rect(130, 110, 35, 45);
            docPdf.text('Codigo de descuento nomina: ' + cod.codigoDescontado, 10, 130);
            docPdf.setFont('Helvetica', 'bold');
            docPdf.setFontSize(5);
            docPdf.text('Huella Indice Derecho', 130, 105);

            docPdf.save('PrestamoDescontar' + '_' + usuario.nombre + "_" + cod.codigoDescontado + '.pdf');
        }
    }
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

// fin

extraeT.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Tienda"));

    let dataString = 'nombre\tMonto Total\t Numero de compras en la tienda\n';

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        dataString +=
            docData.nombre + '\t' +
            docData.valorTotal + '\t' +
            docData.numPersonasAtendidas + '\n';
    });

    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datosTienda.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});


extrae.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Historial"));
    let historial = [];
    querySnapshot.forEach(doc => {
        const cod = doc.data();
        const historia = cod.historia;

        historia.forEach(p => {
            if (p.concepto.startsWith("Compra")) {
                historial.push(p);
            }
        });
    });

    let dataString = 'Cedula\tconcepto\tcuotas\fechaEfectuado\tnombreQuienEntrego\tvalor\n';
    historial.forEach((doc) => {
        dataString +=
            doc.cedula + '\t' +
            doc.concepto + '\t' +
            doc.cuotas + '\t' +
            doc.fechaEfectuado + '\t' +
            doc.nombreQuienEntrego + '\t' +
            doc.valor + '\n';
    }
    );
    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datosHistorialDetallado.txt');

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});





