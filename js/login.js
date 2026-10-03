const email = document.querySelector('#email');
const password = document.querySelector('#password');
const login = document.querySelector('#login');
const url = 'https://todoo.5xcamp.us'
const signup = document.querySelector('#signup');

login.addEventListener('click',() => { 
    if (email.value === '' || password.value === '') { 
        Swal.fire({
            icon: 'error',
            title: '登入失敗',
            text:'欄位不可空白'
        })
        return;
    }
    if (!email.value.includes('@')) {
        Swal.fire({
            icon: 'error',
            title: '登入失敗',
            text:'請輸入正確的email格式'
        })
        return;
    }
    if (password.value.length < 6) { 
        Swal.fire({
            icon: 'error',
            title: '登入失敗',
            text:'密碼長度至少需要 6 位'
        })
        return;
    }

    let data = 
        {
            "user": {
                "email": email.value,
                "password": password.value
            }
        }
    
    axios.post(`${url}/users/sign_in`, data)
        .then(res => {
            axios.defaults.headers.common['Authorization'] = res.headers.authorization;
            localStorage.setItem('Authorization', res.headers.authorization);
            localStorage.setItem('nickname', res.data.nickname);
            Swal.fire({
                icon: 'success',
                title: '登入成功',
                text: '歡迎回來！'
            }).then(() => { 
                window.location.href = './todo.html';
            })
        }
        )
        .catch(err => 
            Swal.fire({
                icon: 'error',
                title: '登入失敗',
                text: err.response.data.error
            })
        ) 

})

signup.addEventListener('click', () => {
    window.location.href = './signup.html';
});