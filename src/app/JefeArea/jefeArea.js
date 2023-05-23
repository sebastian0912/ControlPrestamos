const codigo = document.querySelector('#codigo');
const permiso = document.querySelector('#permiso');


codigo.addEventListener('click', async (e) => {
    e.preventDefault();
    // darle click al boton para dirigir a la pagina de mercado
    window.location.href = "Comercio/comercializadora.html";
});


permiso.addEventListener('click', async (e) => {
    e.preventDefault();
    // darle click al boton para dirigir a la pagina de mercado
    window.location.href = "Dinero/dinero.html";
});