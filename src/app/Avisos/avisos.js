

export function aviso(titulo, icono) {
  // Guardar la posición de desplazamiento actual
  let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  Swal.fire({
    title: titulo,
    icon: icono,
  }).then(() => {
    // Restablecer la posición de desplazamiento después de que se cierre la alerta
    window.scrollTo(0, scrollPosition);
  });
}


export async function avisoConfirmacion() {
  const resultado = await Swal.fire({
    title: '¿Estás seguro de eliminar?',
    text: '¡No se puede revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Eliminar empleados!',
  });

  if (resultado.isConfirmed) {
    await Swal.fire('¡Se confirmo eliminación!', 'Empleados seran eliminados', 'success');
  }

  return resultado.isConfirmed;
}


export async function avisoConfirmacionAc() {
  const resultado = await Swal.fire({
    title: '¿Estás seguro de actualizar los saldos?',
    text: '¡No se puede revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Actualizar saldos de empleados!',
  });

  if (resultado.isConfirmed) {
    await Swal.fire('¡Se confirmo actualización!', 'Saldos de los empleados seran actualizados', 'success');
  }

  return resultado.isConfirmed;
}

export async function avisoConfirmacionAc2() {
  const resultado = await Swal.fire({
    title: '¿Estás seguro de dejar los valores en 0?',
    text: '¡No se puede revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Valores de las personas reseteados!',
  });

  if (resultado.isConfirmed) {
    await Swal.fire('¡Se confirmo actualización!', 'Campos de los empleados seran actualizados', 'success');
  }

  return resultado.isConfirmed;
}