import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js"
import { auth } from "./firebase.js";

const logout = document.querySelector('#logout');


logout.addEventListener('click', async (e) => {
    e.preventDefault();
    await auth.signOut();       
    /*borrar local storage*/
    localStorage.clear();

    window.location.href = "../../Inicio-Login/index.html";
}
);



