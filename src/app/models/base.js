export let datosbase = {
    codigo: '',
    numero_de_documento: '',
    nombre: '',
    ingreso: '',
    temporal: '',
    finca: '',
    salario: '',
    saldos: '',
    fondos: '',
    mercados: '',
    cuotasMercados: '',
    prestamoParaDescontar: '',
    cuotasPrestamos: '',
    casino: '',
    anchetas: '',
    cuotasAnchetas: '',
    fondo: '',
    carnet: '',
    seguroFunerario: '',
    prestamoPaHacer: '',
    cuotasPrestamoPahacer: '',
    anticipoLiquidacion: '',
    cuentas: '',
}

export let urlBack = {
    url: 'http://10.10.10.60:4545'
    // url: 'http://127.0.0.1:8000'

}

export let usuarioR = {
    numero_de_documento: '', // Nuevo
    primer_nombre: '', // Nuevo
    segundo_nombre: '', // Nuevo
    primer_apellido: '', // Nuevo
    segundo_apellido: '',    // Nuevo
    celular: '', // Nuevo
    localizacion: '', // Nuevo
    edad: '', // Nuevo
    tipodedocumento: '', // Nuevo
    correo_electronico: '', // Se mantiene
    avatar: '',  // nuevo
    empladode: '', // se mantiene es sede
    sucursalde: '', // se mantiene es sede
    rol: 'SIN-ASIGNAR', // se mantiene
    sucursalde: 'FACA_CENTRO', // se mantiene es sede
    password: '', // se mantiene
    username: '', // se mantiene
    EstadoQuincena: true,
    EstadoSolicitudes: true,
}



export let codigo = {
    codigo: '',
    codigoDescontado: '',
    monto: '',
    cuotas: '',
    estado: true,
    Concepto: 'Prestamo',
    cedulaQuienPide: '',
    generadoPor: '',
    fechaGenerado: '',
    fechaEjecutado: '',
    ejecutadoPor: '',
    uid: '',
}

export let comercio = {
    codigo: '',
    concepto: '',
    destino: '',
    cantidadEnvio: '',
    cantidadRecibida: '',
    valorUnidad: '',
    cantidadTotalVendida: 0,
    PersonaEnvia: '',
    PersonaRecibe: '',
    fechaEnviada: '',
    fechaRecibida: '',
}


export let historial = {
    cedula: '',
    concepto: '',
    fechaEfectuado: '',
    valor: '',
    cuotas: '',
    nombreQuienEntrego: '',
    timesStamp: '',
}

export let tienda = {
    nombre: '',
    codigo: '',
    valorTotal: '',
    numPersonasAtendidas: '',
}

export let historialModificaciones = {
    codigo: '',
    concepto: '',
    fechaEfectuado: '',
    username: '',
}