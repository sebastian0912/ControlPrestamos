
import { codigo, historial } from "../../models/base.js";
import { aviso } from "../../Avisos/avisos.js";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../../firebase.js";

const boton = document.querySelector("#boton");

// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");
const sede = localStorage.getItem("sede");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
// Capturar el h1 del titulo y perfil
const titulo = document.querySelector("#username");
const perfil = document.querySelector("#perfil");
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
var fechaObjetivo2 = ["2023-04-10", "2023-04-24", "2023-05-08", "2023-05-23", "2023-06-07", "2023-06-23", "2023-07-05", "2023-07-26", "2023-08-09", "2023-08-23", "2023-09-06", "2023-09-25", "2023-10-06", "2023-10-23", "2023-11-08", "2023-11-22", "2023-11-05", "2023-12-21", "2024-01-05"]
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


// Mostar contenido en una tabla
const tabla = document.querySelector("#tabla");

const querySnapshot = await getDocs(collection(db, "Comercio"));

let datosComercializadoraGeneral = querySnapshot.docs.map(doc => doc.data());

datosComercializadoraGeneral.forEach((p) => {
    if (p.destino == sede) {
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

function obtenerCodigo(codigo, datos) {
    let cod = null;
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

function verificarCodigoComercio(codigo, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        if (doc.id == codigo) {
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
        if ((diasTrabajados > 8 && diasTrabajados < 15)) {
            if ((sumaTotal + parseInt(nuevovalor) >= 150001)) {
                aviso("Ups no se pueden generar mercado, puede sacar maximo " + (150000 - (sumaTotal)), "error");
                return false;
            }
            else {
                return true;
            }

        }

        // Si ha trabajado entre 15 y 30 dias puede pedir prestamo de 250.000
        else if ((diasTrabajados > 15 && diasTrabajados < 30)) {
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
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.codigo == codigo && p.estado == true) {
                encontrado = true;
            }
        });
    });
    return encontrado;
}

function verificarCedula(codigoP, cedula, datos) {
    let encontrado = false;
    datos.forEach(doc => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.codigo == codigoP) {
                if (p.cedulaQuienPide == cedula) {
                    encontrado = true;
                }
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

// darle click al boton para que se ejecute la funcion
boton.addEventListener("click", async (e) => {
    let cantidad = document.querySelector("#Cantidad").value;
    let cedula = document.querySelector("#cedula").value;
    let codigo = document.querySelector("#codigo").value;
    let codigoA = document.querySelector("#codigoA").value;
    let celular = document.querySelector("#celular").value;



    const CodigosMercado = await getDocs(collection(db, "Codigos"));
    const CodigosComercio = await getDocs(collection(db, "Comercio"));

    const docRef = doc(db, "Comercio", codigo);
    const docSnap = await getDoc(docRef);
    const datos = docSnap.data();

    const doocRef = doc(db, "Base", cedula);
    const doocSnap = await getDoc(doocRef);
    const datos2 = doocSnap.data();
    let cod = null;
    let sumaVentas = parseInt(cantidad) * parseInt(datos.valorUnidad);
    let sumaCantidad = parseInt(cantidad) + parseInt(datos.cantidadTotalVendida);



    if (sumaCantidad > datos.cantidadRecibida) {
        aviso("No se puede cargar el mercado porque no hay inventario lo maximo a sacar es " + (datos.cantidadRecibida - datos.cantidadTotalVendida), "error");
        return;
    }

    if (!verificarCodigo(codigoA, CodigosMercado)) {
        aviso("El codigo no existe", "error");
        return;
    }

    if (!verificarCodigoEstado(codigoA, CodigosMercado)) {
        aviso("El codigo ya fue usado", "error");
        return
    }

    if (!verificarCedula(codigoA, cedula, CodigosMercado)) {
        aviso("El codigo no pertenece a este empleado", "error");
        return;
    }

    if (!verificaMonto(sumaVentas, CodigosMercado)) {
        aviso("El monto del prestamo es mayor al permitido generado por el coodinador", "error");
        return;
    }

    if (!verificarCodigoComercio(codigo, CodigosComercio) == true) {
        aviso("El codigo de la comercializadora no existe", "error");
        return;
    }

    if (!verificaSelect(tipo)) {
        return;
    }

    if (codigoA == "") {
        aviso("Por favor ingrese el codigo de autorizacion generado por el coordinador", "error");
        return;
    }

    if (verificarCodigo(codigoA, CodigosMercado) == true) {




        if (!verificaCondiciones(datos2, sumaVentas) == true) {
            return;
        }

        if (obtenerCodigo(codigoA, CodigosMercado) == null) {
            aviso("El codigo de autorizacion no existe", "error");
            return;
        }
        else {
            cod = obtenerCodigo(codigoA, CodigosMercado);
        }

        cod.estado = false;
        cod.fechaEjecutado = new Date().toLocaleDateString()
        cod.ejecutadoPor = usernameLocal;
        // generar codigo solo numeros aleatorios
        cod.codigoDescontado = "MOH" + Math.floor(Math.random() * (999999 - 100000)) + 100000;

        await setDoc(doc(db, "Codigos", cod.uid), {
            prestamos: arrayUnion(cod)
        });


        await updateDoc(doc(db, "Comercio", codigo), {
            cantidadTotalVendida: parseInt(datos.cantidadTotalVendida) + parseInt(cantidad),
        });



        await updateDoc(doc(db, "Base", cedula), {
            mercados: parseInt(datos2.mercados) + sumaVentas,
            cuotasMercados: 2
        });


        // crear un nuevo registro en la coleccion historial
        const docEmpleado = doc(db, "Historial", cedula);
        const empleadoRef = await getDoc(docEmpleado);
        let data = historial;
        if (empleadoRef.exists()) {
            data.cedula = cedula;
            data.concepto = "Compra producto comercializadora";
            data.fechaEfectuado = new Date().toLocaleDateString()
            data.valor = sumaVentas;
            data.cuotas = cod.cuotas;
            data.nombreQuienEntrego = usernameLocal;
            data.timesStamp = new Date().getTime();
            await updateDoc(doc(db, "Historial", cedula), {
                historia: arrayUnion(data)
            });
        }
        else {
            data.cedula = cedula;
            data.concepto = "Compra producto comercializadora";
            data.fechaEfectuado = new Date().toLocaleDateString()
            data.valor = sumaVentas;
            data.cuotas = cod.cuotas;
            data.nombreQuienEntrego = usernameLocal;
            data.timesStamp = new Date().getTime();
            await setDoc(docEmpleado, {
                historia: [data]
            });
        }

        aviso("Se ha cargado la informacion exitosamente", "success");
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

        docPdf.addFont("Helvetica-Bold", "Helvetica", "bold");


        docPdf.setFontSize(9);
        docPdf.text("______________________________________________________________________________________________________________", 10, 10);
        docPdf.setFontSize(24);
        docPdf.setFont("Helvetica", "bold");
        docPdf.text(empresa, 35, 19);
        docPdf.setFont('Helvetica', 'normal');
        docPdf.setFontSize(9);
        docPdf.text('AUTORIZACION DE LIBRANZA', 132, 15);
        docPdf.text(NIT, 130, 20);
        docPdf.text(direcccion, 135, 25);
        docPdf.text("______________________________________________________________________________________________________________", 10, 27);
        docPdf.text("______________________________________________________________________________________________________________", 10, 29);


        docPdf.text("Fecha de Solicitud: " + new Date().toLocaleDateString(), 10, 40);
        // salto de linea
        docPdf.setFont("Helvetica", "bold");

        docPdf.text("ASUNTO: CREDITO (PRESTAMO)", 10, 50);
        docPdf.setFont("Helvetica", "normal");


        docPdf.text("Yo, " + datos2.nombre + " mayor de edad,  identificado con la cedula de ciudadania No. "
            + datos2.cedula + " autorizo", 10, 55);
        docPdf.text("expresa e irrevocablemente para que del sueldo, salario, prestaciones sociales o de cualquier suma de la sea acreedor; me sean", 10, 60);
        docPdf.text("descontados la cantidad de " + sumaVentas + " (Letras)  " + NumeroALetras(sumaVentas) + "por concepto de" + " PRESTAMO, en 2 cuota(s), ", 10, 65);
        docPdf.text("quincenal del credito del que soy deudor ante Tu alianza S.A.S. , aun en el evento de encontrarme disfrutando de mis licencias ", 10, 70);
        docPdf.text("o incapacidades. ", 10, 75);

        docPdf.text("Fecha de ingreso: " + datos2.ingreso, 10, 90);
        docPdf.text("Forma de pago: " + tipo.value, 10, 95);
        docPdf.text('Centro de Costo: ' + datos2.finca, 130, 90);

        docPdf.text("Telefono: " + celular, 130, 95);
        docPdf.setFont("Helvetica", "bold");
        docPdf.text("Cordialmente ", 10, 110);
        docPdf.setFont("Helvetica", "normal");
        docPdf.text("Firma de Autorización ", 10, 115);
        docPdf.text("C.C. " + datos2.cedula, 10, 120);

        // realizar un cuadro para colocar la huella dactilar
        docPdf.rect(130, 110, 35, 45);
        docPdf.text("Codigo de descuento nomina: " + cod.codigoDescontado, 10, 130);
        docPdf.setFont("Helvetica", "bold");
        docPdf.setFontSize(6);
        docPdf.text("Huella Indice Derecho", 130, 105);

        docPdf.save("PrestamoDescontar" + "_" + datos2.nombre + "_" + cod.codigoDescontado + ".pdf");
    }
    else {
        aviso("El codigo de autorizacion no existe", "error");
    }

    cantidad = ""
    cedula = ""
    codigo = ""
    codigoA = ""
    celular = ""



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
        letrasMonedaPlural: "Pesos",//"PESOS", "Dólares", "Bolívares", "etcs"
        letrasMonedaSingular: "Peso", //"PESO", "Dólar", "Bolivar", "etc"

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