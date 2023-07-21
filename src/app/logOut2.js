

const logout = document.querySelector('#logout');


logout.addEventListener('click', async (e) => {
    e.preventDefault();
         
    /*borrar local storage*/
    localStorage.clear();

    window.location.href = "../../Inicio-Login/index.html";
}
);



