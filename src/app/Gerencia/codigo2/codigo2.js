import { codigo, urlBack } from "../../models/base.js";
import { aviso, avisoConfirmado } from "../../Avisos/avisos.js";

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
    console.log(dia);
    console.log(ahora);
    var fechaObjetivo = new Date(anio, mes, dia);
    console.log(fechaObjetivo);
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
        alert('Solo se permiten números');
        numemoroM.value = numemoroM.value.replace(/[^\d\,]*/g, '');
    }
});


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

extraeHistorialT.addEventListener('click', async () => {
    console.log("entro");
    const datosExtraidos = await THistorial();
    if (datosExtraidos.historial.length == 0) {
        aviso("No hay registros de compras realizadas en las tiendas", "warning");
        return;
    }

    // Crear un objeto para agrupar los datos por mes
    const historialPorMes = {};

    datosExtraidos.historial.forEach(doc => {
        if (doc.concepto.startsWith("Compra tienda")) {
            // Obtener el mes y el día de la fecha en formato 'YYYY-MM-DD'
            const fechaParts = doc.fechaEfectuado.split('-');
            const mes = fechaParts[1];
            let dia = fechaParts[2];
        
            if (!historialPorMes[mes]) {
                historialPorMes[mes] = { '13-27': [], '28-12': [] };
            }
        
            // Si el día está en el rango del 28 al 31, asignar el siguiente mes
            if (dia >= 28) {
                const siguienteMes = (parseInt(mes) + 1).toString().padStart(2, '0');
                historialPorMes[siguienteMes] = historialPorMes[siguienteMes] || { '13-27': [], '28-12': [] };
                dia = dia <= 12 ? `0${dia}` : dia;
                mes = siguienteMes;
            }
        
            const grupo = dia >= 13 && dia <= 27 ? '13-27' : '28-12';
        
            // Utilizar una expresión regular para encontrar "de" o "en" seguido del lugar
            const lugarMatch = doc.concepto.match(/(?:de|en)\s+(.+)/i);
        
            if (lugarMatch) {
                const lugar = lugarMatch[1]; // El segundo grupo capturado es el lugar
                doc.lugar = lugar; // Asignar el valor al campo "lugar"
            }
        
            historialPorMes[mes][grupo].push(doc);
        }
    });     


    // Crear un archivo Excel con hojas internas para cada mes
    const wb = XLSX.utils.book_new();



    for (const mes in historialPorMes) {
        const historialMes = historialPorMes[mes];

        for (const rango in historialMes) {
            const excelData = [['Cedula', 'Concepto', 'Lugar', 'Cuotas', 'Fecha Efectuado', 'Nombre Quien Entregó', 'Valor']];

            historialMes[rango].forEach(doc => {
                excelData.push([
                    doc.cedula,
                    doc.concepto,
                    doc.lugar,
                    Number(doc.cuotas),
                    doc.fechaEfectuado,
                    doc.nombreQuienEntrego,
                    Number(doc.valor)
                ]);
            });

            const ws = XLSX.utils.aoa_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, `${mes} (${rango})`);
        }
    }

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'datosHistorialDetallado.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
});


async function escribirCodigo(cedulaEmpleado, nuevovalor, cod, cuotas, tipo, valor) {
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
                    cuotas: cuotas,
                    estado: true,
                    Concepto: tipo + ' Autorizacion',
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

function verificaSelect2(select) {
    let encontrado = false;
    if (select.value == '0') {
        aviso('Debe seleccionar un concepto', 'error');
        return false;
    }
    else {
        encontrado = true;
        return encontrado;
    }
}

let coodinador = document.getElementById("coordinadores");

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

const nombresApellidos = [
    "LEYDI CAMACHO",
    "CLAUDIA BELTRAN",
    "MARIO MONTERO",
    "LUIS RUBIANO",
    "DIANA SIERRA",
    "ANGIE LEON",
    "JHONATAN PARRA",
    "DUMAR NUÑEZ",
    "DANIEL PEREZ",
    "SERGIO ROCHA",
    "DIEGO MENDIETA",
    "DIEGO FORERO",
    "ERIKA GALEANO",
    "DUMAR NUÑEZ",
    "ANDRES PEÑA",
    "DANIEL HERNANDEZ",
    "JULIETH REYES",
    "MAURY RAMIREZ",
    "ANGIE CASTILLO",
    "MARIA MERCHAN",
    "ANGELICA GOMEZ",
    "LUISA PEÑA",
    "SERGIO ROCHA",
    "ANGIE GUTIERREZ",
    "NOHORA CASTRO",
    "BRIGITH ACEVEDO",
    "ANGIE GARCIA",
    "FANNY ROBLES",
    "DUVAN FORERO",
    "LEIDI CAMARGO",
    "ANGIE ACOSTA",
    "SAREN BELLO",
    "PAOLA MACANA",
    "ANYI HERNANDEZ",
    "YESENIA PALACIOS",
    "LIGIA HUERTAS",
    "NIKOL SARMIENTO",
    "DIANA RUBIANO",
    "YURLEY REYES",
    "ANTONIO RUIZ",
    "ESTEFANIA REALPE",
    "CARLOS ROJAS",
    "KAREN RAMIREZ",
    "ANGELA MARIA ALDANA",
    "SEBASTIAN RODRIGUEZ",
    "ERIKA GUERRERO",
    "CAMILA GARCIA",
    "ANDREA DIAZ",
    "VALENTINA GUILLEN",
    "KAREN RIQUETT",
    "ANGELICA GOMEZ",
    "CAROL PALACIOS",
    "LEIDY VANESA QUIÑONES"
];

coodinador.addEventListener('click', async () => {
    let arrayCodigos = [];
    const aux = await datosTCodigos();
    if (aux.message == "error") {
        aviso("No hay registros de actividades de los coordinadores", "warning");
        return;
    }
    let datosFinales = [];
    nombresApellidos.forEach((nombre) => {
        aux.codigo.forEach((doc) => {
            if (doc.generadoPor == nombre) {
                datosFinales.push(doc);
            }
        });
    });

    if (datosFinales.length == 0) {
        aviso("No hay registros de actividades de los coordinadores", "warning");
        return;
    }

    // Crear un objeto para almacenar los datos por quincena de forma dinámica
    const datosPorQuincena = {};

    datosFinales.forEach((doc) => {
        const fechaGenerado = new Date(doc.fechaGenerado);
        const dia = fechaGenerado.getDate(); // Obtener el día del mes
        const mes = fechaGenerado.getMonth() + 1; // Obtener el mes

        // Determinar la quincena según el día del mes
        const quincena = dia >= 13 ? `Quincena_${mes}_1` : `Quincena_${mes}_2`;

        if (!datosPorQuincena[quincena]) {
            datosPorQuincena[quincena] = [['Concepto', 'Concepto Palabra Clave', 'Cedula Quien Pide', 'Codigo', 'Codigo Descontado', 'Cuotas', 'Ejecutado Por', 'Estado', 'Fecha Ejecutado', 'Fecha Generado', 'Generado Por', 'Hora Generado', 'Monto']];
        }

        const docData = doc;
        let estado = "";
        if (docData.estado == true) {
            estado = "Pendiente";
        } else if (docData.estado == false) {
            estado = "Ejecutado";
        }

        // Determinar el valor de "Concepto Palabra Clave"
        let conceptoPalabraClave = "";
        if (docData.Concepto.startsWith("Mercado")) {
            conceptoPalabraClave = "Mercado";
        } else if (docData.Concepto.startsWith("Autorizacion")) {
            conceptoPalabraClave = "Prestamo dinero";
        }

        datosPorQuincena[quincena].push([
            docData.Concepto,
            conceptoPalabraClave, // Agregar la nueva columna
            docData.cedulaQuienPide,
            docData.codigo,
            docData.codigoDescontado,
            Number(docData.cuotas),
            docData.ejecutadoPor,
            estado,
            docData.fechaEjecutado,
            docData.fechaGenerado,
            docData.generadoPor,
            docData.horaGenerado,
            Number(docData.monto),
        ]);
    });

    // Crear una hoja de resumen
    const resumenSheet = [['Generado Por', 'Total Pendiente', 'Total Ejecutado', 'Rol']];

    // Crear un objeto para almacenar el recuento de registros por Generado Por y Rol
    const countByGeneradoPorYRol = {};

    datosFinales.forEach((doc) => {
        const generadoPor = doc.generadoPor;
        const estado = doc.estado ? 'Pendiente' : 'Ejecutado';

        // Determinar el rol de la persona
        const rol = nombresApellidos.indexOf(generadoPor) >= 40 ? 'JEFE DE AREA' : 'COORDINADOR';

        // Inicializar el contador para el Generado Por y Rol si aún no existe
        if (!countByGeneradoPorYRol[generadoPor]) {
            countByGeneradoPorYRol[generadoPor] = { 'COORDINADOR': { 'Pendiente': 0, 'Ejecutado': 0 }, 'JEFE DE AREA': { 'Pendiente': 0, 'Ejecutado': 0 } };
        }

        // Incrementar el contador correspondiente para el rol y el estado
        countByGeneradoPorYRol[generadoPor][rol][estado] += 1;

        // Llenar la hoja de resumen con los valores de recuento, el rol y el estado
    });

    // Calcular el resumen acumulado
    for (const generadoPor in countByGeneradoPorYRol) {
        const rol = nombresApellidos.indexOf(generadoPor) >= 40 ? 'JEFE DE AREA' : 'COORDINADOR';

        let totalPendiente = 0;
        let totalEjecutado = 0;

        for (const estado in countByGeneradoPorYRol[generadoPor][rol]) {
            if (estado === 'Pendiente') {
                totalPendiente += countByGeneradoPorYRol[generadoPor][rol][estado];
            } else {
                totalEjecutado += countByGeneradoPorYRol[generadoPor][rol][estado];
            }
        }

        resumenSheet.push([generadoPor, totalPendiente, totalEjecutado, rol]);
    }

    // Crear un archivo Excel con hojas separadas por quincena y la hoja de resumen
    const wb = XLSX.utils.book_new();

    // Agregar la hoja de resumen al libro Excel
    const resumenWs = XLSX.utils.aoa_to_sheet(resumenSheet);
    XLSX.utils.book_append_sheet(wb, resumenWs, 'Resumen');

    for (const quincena in datosPorQuincena) {
        if (datosPorQuincena.hasOwnProperty(quincena)) {
            const ws = XLSX.utils.aoa_to_sheet(datosPorQuincena[quincena]);
            XLSX.utils.book_append_sheet(wb, ws, quincena);
        }
    }

    // Generar el archivo Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = url;
    element.download = 'DetalleCoodinadores.xlsx';
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
});

// darle click al boton para que se ejecute la funcion
boton.addEventListener('click', async (e) => {
    e.preventDefault();
    let cedulaEmpleado = document.querySelector('#cedula').value;

    let aux = await datosEmpleado(cedulaEmpleado);
    console.log(aux.datosbase[0]);
    let datos = aux.datosbase[0];

    //console.log(datos.nombre);
    
    if (datos == undefined || datos == "error") {
        aviso('Ups no se pueden generar mercado, el empleado no existe', 'error');
        return;
    }
    
    if (parseInt(datos.saldos) > 175000) {
        aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        return;
    }
    else if (parseInt(datos.fondos) > 0) {
        aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
        return;
    }
    datosPersona.innerHTML = datos.nombre;
    
    boton.style.display = "none";
    cedula.style.display = "none";
    boton2.style.display = "inline-block";
    tipo.style.display = "inline-block";
    
    formaPago.style.display = "inline-block";
    celular.style.display = "inline-block";
    boton2.addEventListener('click', async (e) => {


        let valor = document.querySelector('#valor').value;
        let nuevovalor = valor.replace(/\,/g, '');
        let cuotas = document.querySelector('#cuotas').value;
        let tipo = document.querySelector('#tipo').value;
        let cuotasAux = cuotas;
        
        if (!verificaSelect(formaPago)) {
            return;
        }
        
        if (!verificaSelect2(tipo)) {
            return;
        }
        
        if (valor == "") {
            aviso('Ups no se pueden generar mercado, el monto no puede estar vacio', 'error');
            return;
        }

        if (formaPago.value != "Efectivo" && formaPago.value != "0" && formaPago.value != "Otro") {
            // campo celular debe tener 10 digitos
            if (celular.value.length != 10) {
                aviso('Ups no se pueden generar mercado, el número proporcionado debe tener 10 digitos', 'error');
                return;
            }
        }

        // datos.ingreso tiene el formato dd-mm-aa usar split para separarlos

        const fechaIngreso = datos.ingreso;

        let mes = fechaIngreso.split('-')[1];
        let anio = fechaIngreso.split('-')[2];
        let dia = fechaIngreso.split('-')[0];

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

        const fechaActual = new Date();
        let codigoOH = null;

        if (parseInt(datos.saldos) >= 175000) {
            aviso('Ups no se pueden generar prestamos porque superas los 175000 de saldo permitido', 'error');
        }
        else if (parseInt(datos.fondos) > 0) {
            aviso('Ups no se pueden generar prestamos perteneces al fondo', 'error');
        }
        else {
            console.log('suma total: ' + sumaTotal);
            let concepto = null;
            // VERIFICAR EL TIPO QUE SE ESTA SELECCIONANDO        
            if (tipo == "Seguro Funerario") {
                codigoOH = 'SF' + Math.floor(Math.random() * 1000000);
                concepto = "Autorizacion Seguro Funerario";
                cuotasAux = 1;
            }
            else if (tipo == "Dinero") {
                codigoOH = 'PH' + Math.floor(Math.random() * 1000000);
                concepto = "Autorizacion prestamo dinero";

            }
            else if (tipo == "Otro") {
                codigoOH = 'OT' + Math.floor(Math.random() * 1000000);
                concepto = "Autorizacion otro concepto";
            }

            if (cuotasAux == "") {
                aviso('Ups no se pueden generar mercado, las cuotas no pueden estar vacias', 'error');
                return;
            }

            await escribirHistorial(cedulaEmpleado, nuevovalor, cuotasAux, concepto, codigoOH);
            await escribirCodigo(cedulaEmpleado, nuevovalor, codigoOH, cuotasAux, tipo, valor);

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
            docPdf.text('AUTORIZACIÓN DE LIBRANZA', 132, 15);
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
            docPdf.text('descontados la cantidad de ' + valor + ' " ' + NumeroALetras(nuevovalor) + ' " ' + 'por concepto de' + ' PRESTAMO, ', 10, 65);
            docPdf.text('en ' + cuotas + ' cuota(s), quincenal del credito del que soy deudor ante ' + empresa + ', aun en el evento de encontrarme', 10, 70);
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

            let confirmacion = await avisoConfirmado('Acaba de pedir una autorización de prestamo de dinero por un valor de  ' + valor + ' su codigo es: ' + codigoOH, 'success');
        
            if (confirmacion) {
                // recargar la pagina
                location.reload();
            }


        }
    });

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









