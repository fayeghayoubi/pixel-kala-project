import { showSwal, saveInToLocalStorage , getToken } from './utils.js'


const register = () => {

    const nameInputElem = document.querySelector(".name");
    const emailInputElem = document.querySelector(".email");
    const phoneInputElem = document.querySelector(".phone");
    const passwordInputElem = document.querySelector(".password");

    const newUserInfos = {
        name: nameInputElem.value.trim(),
        email: emailInputElem.value.trim(),
        phone: phoneInputElem.value.trim(),
        password: passwordInputElem.value.trim(),

    };

    fetch(`http://localhost:4000/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserInfos)
    }).then((res) => {
        console.log(res);
        if (res.status === 201) {
            showSwal(
                "ثبت نام با موفقیت انجام شد",
                "success",
                'ورود به پنل کاربری',
                (result) => {
                    location.href = 'index.html';
                }
            );

        } else if (res.status === 400) {
            showSwal(
                "نام کاربری قبلا استفاده شده است",
                "error",
                ' تصحیح اطلاعات ',
                () => { }
            )
        }
        return res.json()
    }).then((data) => {
        console.log(data);
        saveInToLocalStorage("pk_token", data.data.token)
    })
}

const login = () =>{
    const emailInputElem = document.querySelector("#email");
    const passwordInputElem = document.querySelector("#password");

    const userInfos = {
        email : emailInputElem.value.trim(),
        password : passwordInputElem.value.trim(),

    }
    fetch(`http://localhost:4000/api/auth/login` , {
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(userInfos)
    }).then((res) =>{
        console.log(res);
        if (res.status === 401) {
        showSwal(
          "کاربری با این اطلاعات یافت نشد",
          "error",
          "تصحیح اطلاعات",
          () => {}
        );
      } else if (res.status === 200) {
        showSwal("با موفقیت وارد شدید", 
            "success",
             "ورود به پنل",
              () => {
          location.href = "index.html";
        });
      }
      return res.json();        
    }).then((data) =>{
        console.log(data);
        saveInToLocalStorage("pk_token", data.data.token)
    })
};

const getMe = async ()=>{
    const token = getToken()
    if(!token){
        return false
    }
       const res = await fetch(`http://localhost:4000/api/auth/me`,{
            headers : {
                'Authorization' : `Bearer ${getToken()} `
            }
        })
        const data = await res.json()
        console.log(data);
        
        return data
    
    
}
export { register , login , getMe}





// http://localhost:4000/api