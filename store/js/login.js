import { login , getMe } from "./auth.js";

const loginSubmitBtn = document.querySelector("#loginSubmitBtn");


loginSubmitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    login()
})