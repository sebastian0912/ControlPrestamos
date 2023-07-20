export let datosbase = {
    codigo: '',
    cedula: '',
    nombre: '',
    ingreso: '',
    temporal: '',
    finca: '',
    salario: '',
    saldos: '',
    fondos: '',
    mercados: '',
    cuotasMercados: '',
    prestamoPaDescontar : '',
    cuotasPrestamos: '',    
    casino: '',
    anchetas: '',
    cuotasAnchetas: '',
    fondo: '',
    carnet : '',
    seguroFunerario: '',
    prestamoPaHacer : '',
    cuotasPrestamoPahacer: '',
    anticipoLiquidacion: '',
    cuentas : '',
}

export let urlBack = {
    url: 'http://192.168.1.14:8000'
    //url: 'http://192.168.1.10:8080'// no borres esta que es cuando quiero hacer pruebas locales despues en prod se borra
}

export let usuarioR = {
    numero_de_documento: '', // Nuevo
    primer_nombre: '', // Nuevo
    segundo_nombre: '', // Nuevo
    primer_apellido: '', // Nuevo
    segundo_apellido: '',    // Nuevo
    Celular: '', // Nuevo
    Localizacion: '', // Nuevo
    Edad: '', // Nuevo
    Tipodedocumento: '' , // Nuevo
    correo_electronico: '', // Se mantiene
    avatar: '',  // nuevo
    empladode: '', // se mantiene es sede
    rol: 'TESORERIA', // se mantiene
    password : '', // se mantiene
    username : '', // se mantiene
    EstadoQuincena: true,
    EstadoSolicitudes: true,
}



export let codigo = {
    codigo: '',    
    codigoDescontado : '',
    monto : '',
    cuotas : '',
    estado : true,
    Concepto : 'Prestamo',
    cedulaQuienPide : '',    
    generadoPor : '',
    fechaGenerado : '',
    fechaEjecutado : '',
    ejecutadoPor : '',
    uid: '',
}

export let comercio = {
    codigo: '',
    concepto : '',
    destino : '',
    cantidadEnvio : '',
    cantidadRecibida : '',
    valorUnidad : '',
    cantidadTotalVendida : 0,
    PersonaEnvia : '',
    PersonaRecibe : '',
    fechaEnviada : '',
    fechaRecibida : '',     
}


export let historial = {
    cedula: '',
    concepto : '',
    fechaEfectuado : '',
    valor : '',
    cuotas : '',
    nombreQuienEntrego : '',
    timesStamp : '',
}

export let tienda = {
    nombre : '',
    codigo : '',
    valorTotal : '',
    numPersonasAtendidas : '',
}

export let historialModificaciones = {
    codigo : '',
    concepto : '',
    fechaEfectuado : '',
    username : '',
}