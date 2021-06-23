export const validateEmail = (mail)=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    } 
        return (false)
}

export const validatePassword = (password)=>{
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password)) {
        return (true)
    } 
        return (false)
}
