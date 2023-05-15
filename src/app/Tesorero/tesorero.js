
import { doc, getDoc,setDoc} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js"
import { db } from "../firebase.js";
import { datosbase } from "../models/base.js";

const idUsuario = localStorage.getItem("idUsuario");
// MOSTRAR EN EL HTML EL NOMBRE DEL USUARIO LOGEADO
const titulo = document.querySelector('#username');
const ingresar = document.querySelector('#ingresar');
let input = document.getElementById('archivoInput');

let datosFinales = [];


input.addEventListener('change', () => {    
    let archivo = input.files[0];
    let reader = new FileReader();
    /* leer archivo .csv */
    reader.readAsText(archivo);
    reader.onload = () => {
        let info = reader.result;
        /*separado split por tabulaciones*/
        let datos = info.split('\n');      
        
        datos.forEach(dato => {
            datosFinales.push(dato.split('\t'));
        });
        //console.log(datosFinales);

        guardarDatos(datosFinales);
    }    // llamar a la funcion para guardar los datos en la base de datos
    
});

async function guardarDatos(datosFinales){
    //console.log("entro a la funcion");
    //console.log(datosFinales.length);
    for (let i = 4; i < datosFinales.length-1; i++) {
        let datos = datosFinales[i]; // Dividir la cadena por las tabulaciones
        
        datosbase.codigo = datos[0];
        datosbase.cedula = datos[1];
        datosbase.nombre = datos[2];
        datosbase.ingreso = datos[3];
        datosbase.temporal = datos[4];
        datosbase.finca = datos[5];
        datosbase.salario = datos[6];
        datosbase.saldos = datos[7];
        datosbase.fondos = datos[8];
        datosbase.mercados = datos[9];
        datosbase.cuotasPrestamos = datos[10];
        datosbase.prestamoPaDescontar = datos[11];
        datosbase.cuotasCasino = datos[12];
        datosbase.casino = datos[13];
        datosbase.anchetas = datos[14];
        datosbase.cuotasfondo = datos[15];
        datosbase.fondo = datos[16];
        datosbase.carnet = datos[17];
        datosbase.seguroFunerario = datos[18];
        datosbase.prestamoPaHacer = datos[19];
        datosbase.cuotasAnticipoLiquidacion = datos[20];
        datosbase.anticipoLiquidacion = datos[21];
        datosbase.cuentas = datos[22];
        
        const aux = await setDoc(doc(db, "Base", datosbase.cedula), datosbase);
    }
    
}

const docRef = doc(db, "Usuarios", idUsuario);
const docSnap = await getDoc(docRef);
// capturar username
const username = docSnap.data().username;

titulo.innerHTML = " ¡ BIENVENIDO " + username + " ! ";

