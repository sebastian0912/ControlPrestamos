

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