const showSwal = (title, icon, button, callback) => {
    swal({
        title,
        icon,
        button,
    }).then((result) => callback(result))
}

const saveInToLocalStorage = (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
}
const getFromLocalStorage = (key) => {
    return JSON.stringify(localStorage.getItem(key))
}

const getToken = () => {
    const userInfos = localStorage.getItem("pk_token")
    return userInfos ? JSON.parse(userInfos) : null
}
const isLogin = () => {
    const userInfos = localStorage.getItem('pk_token')
    return userInfos ? true : false
}

const getUrlParam = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key)
}
function formatPrice(amount) {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' ت';
}
function starsFromRating(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export {
    showSwal,
    saveInToLocalStorage,
    getFromLocalStorage,
    getToken,
    isLogin,
    getUrlParam,
    formatPrice,
    starsFromRating,
}