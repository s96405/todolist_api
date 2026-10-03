const token = localStorage.getItem('Authorization'); //接收token
const nickname = localStorage.getItem('nickname'); //接收nickname
const user_name = document.querySelector('.user_name'); //使用者dom
const logout = document.querySelector('.btn-logout'); //登出按鈕
const input = document.querySelector('.input'); //新增待辦事項
const add = document.querySelector('.btn-add'); //新增按鈕
const url = 'https://todoo.5xcamp.us'; //API網址
const todoList = document.querySelector('.todo-list'); //待辦事項列表
const clearCompleted = document.querySelector('#clear-completed');//清除已完成項目按鈕
const all = document.querySelector('.all'); //全部按鈕
const pending = document.querySelector('.pending'); //待完成按鈕
const completed = document.querySelector('.completed'); //已完成按鈕
let todoData = []; //存放待辦事項資料
axios.defaults.headers.common['Authorization'] = token;
//使用者名稱
user_name.textContent = nickname + '代辦';
//登出
logout.addEventListener('click', () => { 
    Swal.fire({
        icon: 'question',
        title: '確定要登出嗎？',
        showCancelButton: true,
        confirmButtonText: '登出',
        cancelButtonText: '取消'
    }).then((result) => { 
        if (result.isConfirmed === true) { 
            localStorage.removeItem('Authorization');
            localStorage.removeItem('nickname');
            Swal.fire({
                icon: 'success',
                title: '登出成功',
                text: '歡迎下次再回來！'
            }).then(() => { 
                window.location.href = './login.html';
            })
        }
    })
})

//新增待辦事項
add.addEventListener('click', () => {
    
    if (input.value === '') {
        Swal.fire({
            icon: 'error',
            title: '新增失敗',
            text: '欄位不可空白'
        })
        return;
    }
    add.disabled = true;
    let data = {
        "todo": {
            "content": input.value
        }
    }
    axios.post(`${url}/todos`, data)
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: '新增成功',
                text: '待辦事項已新增！'
            }).then(() => {
                getTodo();
                add.disabled = false;
            })
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: '新增失敗',
                text: '請稍後再試！'
            })
            add.disabled = false;
        })
})
getTodo()
//取得todo列表
function getTodo() {
    axios.get(`${url}/todos`)
        .then(res => {
            todoData = res.data.todos;
            renderTodo(todoData);
        }).then(() => {
            input.value = '';
            all.classList.add('active');
            pending.classList.remove('active');
            completed.classList.remove('active');
        })
        .catch(err => {
            console.log(err.response.message);
        })
}

//渲染todo列表
function renderTodo(todoData) { 
    let str = '';
    todoData.forEach(item => { 
        str += `<li class="todo-item">
                    <input type="checkbox" class="todo-checkbox">
                    <span>${item.content}</span>
                    <div class="todo-item-btn">
                    <button class="btn-edit"></button> 
                    <button class="btn-delete">X</button>
                    </div>
                </li>`
    }) 
    todoList.innerHTML = str;
    //刪除待辦事項
    const btnDelete = document.querySelectorAll('.btn-delete'); //刪除按鈕
    btnDelete.forEach((item, index) => { 
        item.addEventListener('click', () => { 
            axios.delete(`${url}/todos/${todoData[index].id}`)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '刪除成功',
                        text: '待辦事項已刪除！'
                    }).then(() => {
                        getTodo();
                    })
                })
                .catch(err => {console.log(err.response.message)})
        })

    })
    const btnEdit = document.querySelectorAll('.btn-edit'); //編輯按鈕
    btnEdit.forEach((item, index) => {
        item.addEventListener('click',async () => {
            let todoId =todoData[index].id;

            const result = await Swal.fire({
                title: '編輯代辦視窗',
                input: 'text',
                inputValue: todoData[index].content,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) return "請輸入修改內容!";
                }
            })
            if (!result.isConfirmed) return;
            const newContent = result.value;
            axios.put(`${url}/todos/${todoId}`, {
                "todo": {
                    "content": newContent
                }
            }).then(() => {
                getTodo(), Swal.fire({
                    icon: 'success',
                    title: '編輯成功',
                    text: '待辦事項已修改！'
                })
             })
              .catch(() => { 
                    Swal.fire({
                        icon: 'error',
                        title: '編輯失敗',
                        text: '請稍後再試！'
                    })
                })
        })
    })

   

    //勾選待辦事項
    const checkbox = document.querySelectorAll('.todo-checkbox'); //checkbox
    checkbox.forEach((item, index) => { 
        if (todoData[index].completed_at !== null) {
            item.checked = true;
            item.nextElementSibling.classList.add('checked');
        } else { 
            item.checked = false;
        }
        item.addEventListener('change', () => { 
            axios.patch(`${url}/todos/${todoData[index].id}/toggle`)
                .then(() => { 
                    getTodo();
                })
                .catch(err => {console.log(err.response.message)})
        })
    })

    //計算已完成項目數量
    const completedCount = document.querySelector('#completed-count');
    const completedItems = todoData.filter(item => item.completed_at !== null);
    completedCount.textContent = `${completedItems.length} 個已完成項目`;

   
}



//清除已完成項目
clearCompleted.addEventListener('click', () => {
    
    let newData = todoData.filter(item => item.completed_at !== null);
    const deletePromises = newData.map(item => { 
        return axios.delete(`${url}/todos/${item.id}`);
    });
    Promise.all(deletePromises)
            .then(() => { 
                Swal.fire({
                    icon: 'success',
                    title: '清除成功',
                    text: '已清除完成的項目！'
                }).then(() => { 
                    getTodo();
                })
            })
            .catch(err => {console.log(err.response.message)})
    })
 
//切換按鈕及樣式
all.addEventListener('click', (e) => { 
    all.classList.add('active');
    pending.classList.remove('active');
    completed.classList.remove('active');
    getTodo();
})
pending.addEventListener('click', () => {
    pending.classList.add('active');
    all.classList.remove('active');
    completed.classList.remove('active');
    let newData = todoData.filter(item => item.completed_at === null);
    renderTodo(newData);
})
completed.addEventListener('click', () => {
    completed.classList.add('active');
    pending.classList.remove('active');
    all.classList.remove('active');
    let newData = todoData.filter(item => item.completed_at !== null);
    renderTodo(newData);
})


