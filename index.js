// Selectors
const todoInput = document.querySelector('.todo-input');
const todoAdd = document.querySelector('.todo-add');
const todoList = document.querySelector('.todo-list');
const doneList = document.querySelector('.done-list');


// Events
document.addEventListener("DOMContentLoaded", getLocalTodos);
todoAdd.addEventListener("click", addNewTodo);
todoList.addEventListener("click", checkAndTrash)
doneList.addEventListener("click", checkAndTrash)


// Functions
let lstTodo, lstDone;

function addNewTodo(eve) {
    eve.preventDefault();

    if (todoInput.value) {
        addTodo(todoList, todoInput.value);

        lstTodo.push(todoInput.value);
        localStorage.setItem("lstTodo", JSON.stringify(lstTodo));

        todoInput.value = '';
        todoInput.focus();
    }
}

function addTodo(ulLstTarget, todoValue) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item');

    // Todo Text
    const todo = document.createElement('li');
    todo.innerText = todoValue;
    todoDiv.appendChild(todo);

    // Delete Btn
    const trashBtn = document.createElement('button');
    trashBtn.classList.add('trash-btn');
    trashBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todoDiv.appendChild(trashBtn);

    // Adding To The List
    if (ulLstTarget === doneList) todoDiv.classList.add('checked');
    ulLstTarget.appendChild(todoDiv);
}

function checkAndTrash(eve) {
    const item = eve.target;

    // Trash Optoin
    if (item.classList[0] === 'trash-btn') {
        item.parentElement.classList.add('trashed');

        item.parentElement.addEventListener('transitionend', function () {
            const todoItem = item.parentElement;
            if (todoItem.parentElement === todoList) {
                removeTodo(lstTodo, todoItem);
                localStorage.setItem("lstTodo", JSON.stringify(lstTodo));
            }
            else if (todoItem.parentElement === doneList) {
                removeTodo(lstDone, todoItem);
                localStorage.setItem("lstDone", JSON.stringify(lstDone));
            }
            todoItem.remove();
        });
    }
    // Check Option
    else if (item.classList[0] === 'todo-item') {

        if (item.parentElement === todoList) {
            doneList.appendChild(item);

            const todoValue = removeTodo(lstTodo, item);
            lstDone.push(todoValue);

            item.classList.add('checked');
        } else {
            todoList.appendChild(item);

            const todoValue = removeTodo(lstDone, item);
            lstTodo.push(todoValue);

            item.classList.remove('checked');
        }

        localStorage.setItem("lstTodo", JSON.stringify(lstTodo));
        localStorage.setItem("lstDone", JSON.stringify(lstDone));
    }

}

function getLocalTodos() {
    if (localStorage.getItem('lstTodo'))
        lstTodo = JSON.parse(localStorage.getItem('lstTodo'));
    else lstTodo = [];

    if (localStorage.getItem('lstDone'))
        lstDone = JSON.parse(localStorage.getItem('lstDone'));
    else lstDone = [];


    lstTodo.forEach(element => {
        addTodo(todoList, element);
    });
    lstDone.forEach(element => {
        addTodo(doneList, element);
    });
}

function removeTodo(lstTarget, todo) {
    const todoValue = todo.children[0].innerText;

    lstTarget.splice(lstTarget.indexOf(todoValue), 1);

    return todoValue;
}


