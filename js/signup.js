const email = document.querySelector('#email'); //email
const signup = document.querySelector(".btn-primary"); //登入
const nicekname = document.querySelector('#nickname'); //暱稱
const password = document.querySelector('#password'); //密碼
const confirmPassword = document.querySelector('#confirm_password'); //確認密碼
const url = 'https://todoo.5xcamp.us'
//註冊按鈕監聽
signup.addEventListener('click', (e) => {
    const data = {
        "user": {
            "email": email.value,
            "nickname": nicekname.value,
            "password": password.value
        }
    }
    if (email.value === "" || nicekname.value === "" || password.value === "" || confirmPassword.value === "") {
        Swal.fire({
            icon: 'error',
            title: '欄位不可空白'
        });
        return;
    }
    if (password.value !== confirmPassword.value) {
        Swal.fire({
            icon: 'error',
            title: '密碼不一致'
        });
        return;
    }
    if (!email.value.includes("@")) {
        Swal.fire({
            icon: 'error',
            title: 'Email 格式錯誤'
        });
        return;
    }
    if (password.value.length < 6) {
        Swal.fire({
            icon: 'error',
            title: '密碼長度至少需要 6 位'
        });
        return;
    }

    

    axios.post(`${url}/users`, data)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: '註冊成功',
            }).then(() => { 
                window.location.href = './login.html';
            })
        })
        
        .catch(err => { 
            Swal.fire({
                icon: 'error',
                title: '註冊失敗',
                text: err.response.data.error
            })  
        })
        
}
    
)