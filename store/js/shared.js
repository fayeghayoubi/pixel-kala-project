import { getMe } from "./auth.js";
import { 
    showUserInNavbar ,
    getAndShowAllProducts ,
    getandShowAllCategory,
} from "./funcs.js";

window.addEventListener('load',()=>{
    showUserInNavbar()
    getAndShowAllProducts()
    getandShowAllCategory()
    getMe().then((data) =>{
        console.log(data);
        
    })
    
})