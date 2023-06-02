
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, onSnapshot, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";
import { codigo, historial, tienda } from "../models/base.js";
import { aviso } from "../Avisos/avisos.js";


const boton = document.querySelector('#boton');
// capturar el id del usuario logeado del input
const idUsuario = localStorage.getItem("idUsuario");

// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const perfil = document.querySelector('#perfil');
const numeroDias = document.querySelector('#diasRestantes');


/*Calculo cuantos dias faltan*/
// Obtén la fecha actual
var ahora = new Date();
var anio = ahora.getFullYear();
var mes = ahora.getMonth();
var dia = 0;

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    dia = 0;
}
else if (ahora.getDate() < 13 || ahora.getDate() > 14) {
    dia = 13;
}
else if (ahora.getDate() < 28 || ahora.getDate() > 29) {
    dia = 28;
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
/*si el dia es 13 o 14 o 28 o 29 colocar numeroDias.innerHtml en rojo*/

if (ahora.getDate() == 13 || ahora.getDate() == 14 || ahora.getDate() == 28 || ahora.getDate() == 29) {
    numeroDias.style.color = "red";
    numeroDias.innerHTML = dias;
}
else {
    numeroDias.innerHTML = dias;
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


//Captura nombre y perfil
const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);

const username = docSnap.data().username;
const perfilUsuario = docSnap.data().perfil;

titulo.innerHTML = username;
perfil.innerHTML = perfilUsuario;



boton.addEventListener('click', async (e) => {
    e.preventDefault();

    // capturar los datos del formulario
    const codigoP = document.querySelector('#codigo').value;
    const valor = document.querySelector('#valor').value;
    const nuevovalor = valor.replace(/\,/g, '');

    const cedulaEmpleado = document.querySelector('#cedula').value;
    if (codigoP == '') {
        aviso('El campo codigo no puede estar vacio', 'error');
    }
    else {
        const docRef = doc(db, "Base", cedulaEmpleado);
        const docSnap = await getDoc(docRef);
        const datos = docSnap.data();
        const querySnapshot = await getDocs(collection(db, "Codigos"));
        querySnapshot.forEach(async (cod) => {
            const docRef = doc(db, "Codigos", cod.id);
            const docSnap = await getDoc(docRef);
            // recorrer arreglo llamado prestamos para buscar el codigo
            const prestamos = docSnap.data().prestamos;
            for (let i = 0; i < prestamos.length; i++) {
                let p = prestamos[i];
                if (p.cedulaQuienPide == cedulaEmpleado) {
                    if (parseInt(p.monto) >= parseInt(nuevovalor)) {
                        if (p.codigo == codigoP) {
                            if (p.estado == false) {
                                aviso('El codigo ya fue usado', 'error');
                            }
                            else {
                                let concepto;
                                if (p.codigo.startsWith("M")) {
                                    concepto = 'Mercado' + username;
                                    await updateDoc(doc(db, "Base", cedulaEmpleado), {
                                        mercados: parseInt(datos.mercados) + parseInt(nuevovalor),
                                        cuotasMercados: parseInt(p.cuotas) + parseInt(datos.cuotasMercados),
                                    });
                                    // modificar la variable estado dentro del arreglo y subir cambios a firebase
                                    p.estado = false;
                                    p.fechaEjecutado = new Date().toLocaleDateString()
                                    p.jefeArea = username;
                                    p.lugar = 'Tienda ' + username;
                                    await updateDoc(doc(db, "Codigos", cod.id), {
                                        prestamos: prestamos
                                    });
                                    // modificamos los datos de la tienda
                                    const docTienda = doc(db, "Tienda", idUsuario);
                                    // datos de la tienda
                                    const tiendaRef = await getDoc(docTienda);
                                    if (!tiendaRef.exists()) {
                                        await setDoc(docTienda, {
                                            nombre: username,
                                            codigo: idUsuario,
                                            valorTotal: parseInt(nuevovalor),
                                            numPersonasAtendidas: 1,
                                        });
                                    } else {
                                        await updateDoc(doc(db, "Tienda", idUsuario), {
                                            nombre: username,
                                            codigo: idUsuario,
                                            valorTotal: parseInt(tiendaRef.data().valorTotal) + parseInt(nuevovalor),
                                            numPersonasAtendidas: parseInt(tiendaRef.data().numPersonasAtendidas) + 1,
                                        });
                                    }
                                    // crear un nuevo registro en la coleccion historial
                                    const docEmpleado = doc(db, "Historial", cedulaEmpleado);
                                    const empleadoRef = await getDoc(docEmpleado);
                                    let data = historial;
                                    if (empleadoRef.exists()) {
                                        data.cedula = cedulaEmpleado;
                                        data.concepto = concepto;
                                        data.fechaEfectuado = new Date().toLocaleDateString()
                                        data.valor = nuevovalor;
                                        data.cuotas = p.cuotas;
                                        data.nombreQuienEntrego = username;
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
                                        data.cuotas = p.cuotas;
                                        data.nombreQuienEntrego = username;
                                        data.timesStamp = new Date().getTime();
                                        await setDoc(docEmpleado, {
                                            historia: [data]
                                        });
                                    }
                                    aviso('Acaba de pedir un mercado de ' + valor, 'success');
                                }
                                else {
                                    aviso('El codigo no es valido', 'error');
                                }

                            }
                        }                        
                    }
                    else {
                        aviso('El monto del prestamo es mayor al permitido generado por el coodinador', 'error');
                    }
                }
                else {
                    aviso('El codigo no pertenece a este empleado', 'error');
                }
            }

        });
    }

});

