
import { datosbase, urlBack } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";


// Capturar el h1 del titulo y perfil
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
// Capturar el PERFIL y el USERNAME del local storage
const perfilLocal = localStorage.getItem("perfil");
const usernameLocal = localStorage.getItem("username");
const empleados = localStorage.getItem("empleados");
const codigos = localStorage.getItem("codigos");
const numCoordinadoresConestadoSolicitudesTrue = localStorage.getItem("coordinadores");
//Muestra en la parte superior el nombre y el perfil
titulo.innerHTML = usernameLocal;
perfil.innerHTML = perfilLocal;

const numeroTotal = document.querySelector('#numeroEmpleados');
const numeroSolicitudesPendientes = document.querySelector('#numeroSolicitudesPendientes');

let extrae = document.getElementById("extrae");
let extraeT = document.getElementById("extraeT");

let input = document.getElementById('archivoInput');

let datosFinales = [];

const over = document.querySelector('#overlay');
const loader = document.querySelector('#loader');

var h1Elemento = document.querySelector('#cont');


extrae.addEventListener('click', async () => {
    const querySnapshot = await getDocs(collection(db, "Base"));

    let dataString = '\t\t\t\t\t\t\tANTERIOR\t\tPARA DESCONTAR\t\t\t\t\t\t\t\t\t\tPARA HACER\t\t\t\nCÓDIGO\tCÉDULA\tNOMBRE\tINGRESO\tTEMPORAL\tFINCA\tSALARIO\tSALDOS\tFONDOS\tMERCADOS\tCUOTAS\tPRESTAMO\tCUOTAS\tCASINO\tANCHETAS\tCUOTAS\tFONDO\tCARNET\tSEGURO FUNERARIO\tPRESTAMO\tCUOTAS\tANTICIPO LIQ\tCUENTAS\n';

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        dataString +=
            docData.codigo + '\t' +
            docData.cedula + '\t' +
            docData.nombre + '\t' +
            docData.ingreso + '\t' +
            docData.temporal + '\t' +
            docData.finca + '\t' +
            docData.salario + '\t' +
            docData.saldos + '\t' +
            docData.fondos + '\t' +
            docData.mercados + '\t' +
            docData.cuotasMercados + '\t' +
            docData.prestamoPaDescontar + '\t' +
            docData.cuotasPrestamos + '\t' +
            docData.casino + '\t' +
            docData.anchetas + '\t' +
            docData.cuotasAnchetas + '\t' +
            docData.fondo + '\t' +
            docData.carnet + '\t' +
            docData.seguroFunerario + '\t' +
            docData.prestamoPaHacer + '\t' +
            docData.cuotasPrestamoPahacer + '\t' +
            docData.anticipoLiquidacion + '\t' +
            docData.cuentas + '\n';
    });

    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datos.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});

extraeC.addEventListener('click', async () => {
    datosFinales = [];
    const querySnapshot = await getDocs(collection(db, "Codigos"));
    querySnapshot.forEach((doc) => {
        const cod = doc.data();
        const prestamos = cod.prestamos;
        prestamos.forEach(p => {
            if (p.estado == true) {
                datosFinales.push(p);
            }
        });
    });
    let dataString = 'Código\tCédula quien pidio\tNombre persona quien dio el codigo\tValor\tCuotas\tFecha\n';

    datosFinales.forEach((doc) => {
        dataString +=
            doc.codigo + '\t' +
            doc.cedulaQuienPide + '\t' +
            doc.generadoPor + '\t' +
            doc.monto + '\t' +
            doc.cuotas + '\t' +
            doc.fechaGenerado + '\n';
    });

    // Creamos un elemento "a" invisible, establecemos su URL para que apunte a nuestros datos y forzamos un click para iniciar la descarga
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataString));
    element.setAttribute('download', 'datosCodigos.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);


    // borrar la coleccion de codigos

});


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


input.addEventListener('change', () => {
    let archivo = input.files[0];
    let reader = new FileReader();
    var h1Elemento = document.getElementById("cont");

    /* leer archivo .csv */
    reader.readAsText(archivo);

    reader.onload = () => {
        let info = reader.result;
        /*separado split por tabulaciones*/
        let datos = info.split('\n');

        datos.forEach(dato => {
            datosFinales.push(dato.split('\t'));
        });
        over.style.display = "block";
        loader.style.display = "block";
        h1Elemento.style.display = "block";
        let chunksize = Math.ceil(datosFinales.length / 25);

        for (let i = 0; i < datosFinales.length; i += chunksize) {
            let temparray = datosFinales.slice(i, i + chunksize);
            guardarDatos(temparray);
        }
    }
});

async function guardarDatos(datosFinales) {

    const arrayDatosBase = [];
    for (let i = 4; i < datosFinales.length - 1; i++) {
        let datos = datosFinales[i]; // Dividir la cadena por las tabulaciones
        datosbase.codigo = datos[0];
        datosbase.numero_de_documento = datos[1];
        datosbase.nombre = datos[2];
        const fechaIngreso = datos[3];
        let dia = fechaIngreso.split('-')[0];
        let mes = fechaIngreso.split('-')[1];
        let anio = fechaIngreso.split('-')[2];
        // el año esta en formato xxaa y se debe convertir a 20aa
        let anioConvertido = '20' + anio;        
        anio = anioConvertido;
        datosbase.ingreso = anio + '-' + mes + '-' + dia;        
        datosbase.temporal = datos[4];
        datosbase.finca = datos[5];
        datosbase.salario = datos[6];
        datosbase.saldos = datos[7];
        datosbase.fondos = datos[8];
        datosbase.mercados = datos[9];
        datosbase.cuotasMercados = datos[10];
        datosbase.prestamoParaDescontar = datos[11];
        datosbase.cuotasPrestamos = datos[12];
        datosbase.casino = datos[13];
        datosbase.anchetas = datos[14];
        datosbase.cuotasAnchetas = datos[15];
        datosbase.fondo = datos[16];
        datosbase.carnet = datos[17];
        datosbase.seguroFunerario = datos[18];
        datosbase.prestamoPaHacer = datos[19];
        datosbase.cuotasPrestamoPahacer = datos[20];
        datosbase.anticipoLiquidacion = datos[21];
        datosbase.cuentas = datos[22];

        (function (indice) {
            setTimeout(function () {
                h1Elemento.textContent = "Empleados cargados: " + indice - 3;
            }, indice * 1);
        })(i);
        
        arrayDatosBase.push(datosbase);
    }

    console.log(arrayDatosBase);
    const dataArrayName = 'datos'; // Nombre del array en el título de datos

    const requestData = {
        [dataArrayName]: arrayDatosBase
    };

    var body = localStorage.getItem('jwt');
    const obj = JSON.parse(body);
    const jwtKey = obj.jwt;
    
    
    const bodyData = {
        jwt: jwtKey,
        mensaje:"muchos",
        datos: arrayDatosBase
    };

    const headers = {
        'Authorization': jwtKey
    };

    const urlcompleta = urlBack.url + '/Datosbase/datosbase';
    try {
        fetch(urlcompleta, {
            method: 'POST',// para el resto de peticiónes HTTP le cambias a GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(bodyData),// Aquí va el body de tu petición tiene que ser asi en json para que el back lo pueda leer y procesar y hay algun problema me dices
            
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
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
        console.error('Error en la petición HTTP PUT');
        console.error(error);
    }

    aviso("Datos guardados correctamente", "success");
    over.style.display = "none";
    loader.style.display = "none";
    h1Elemento.style.display = "none";
}

/*Inabilitar permisos*/
document.getElementById("myonoffswitch").addEventListener("click", async function (event) {
    const querySnapshot2 = await getDocs(collection(db, "Usuarios"));

    const jwtToken = localStorage.getItem('jwt');
    const urlcompleta = urlBack.url + '/usuarios/usuario';
    try {
        fetch(urlcompleta, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: jwtToken
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();// aca metes los datos uqe llegan del servidor si necesitas un dato en especifico me dices
                    //muchas veces mando un mensaje de sucess o algo asi para saber que todo salio bien o mal
                } else {
                    throw new Error('Error en la petición GET');
                }
            })
            .then(responseData => {
                console.log('Respuesta:', responseData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } catch (error) {
        console.error('Error en la petición HTTP GET');
        console.error(error);
    }
    if (this.checked) {
        querySnapshot2.forEach(async (cod) => {
            const docRef = doc(db, "Usuarios", cod.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.data().perfil == 'JefeArea' || docSnap.data().perfil == 'Coordinador' || docSnap.data().perfil == 'Tienda') {
                await updateDoc(doc(db, "Usuarios", cod.id), {
                    estadoQuincena: true
                });
                aviso('Se ha habilitado el acceso a la modificaciones de jefes de area, tiendas y coordinadores', 'success');
            }
        });
    } else {
        querySnapshot2.forEach(async (cod) => {
            const docRef = doc(db, "Usuarios", cod.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.data().perfil == 'JefeArea' || docSnap.data().perfil == 'Coordinador' || docSnap.data().perfil == 'Tienda') {
                await updateDoc(doc(db, "Usuarios", cod.id), {
                    estadoQuincena: false
                });
                aviso('Se ha deshabilitado el acceso a la modificaciones de jefes de area, tiendas y coordinadores', 'success');
            }
        });
    }
});

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




// Base total de empleados
numeroTotal.innerHTML = empleados;


/* Obtener codigos de la base de datos */
// Numero de codigos activos de la base de datos del coodinador

numeroSolicitudesPendientes.innerHTML = codigos;


numeroCoordinadores.innerHTML = numCoordinadoresConestadoSolicitudesTrue;


