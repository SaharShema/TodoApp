// Selectors
const todoInput = document.querySelector('.todo-input');
const todoAdd = document.querySelector('.todo-add');
const todoList = document.querySelector('.todo-list');
const doneList = document.querySelector('.done-list');

const helloDiv = document.querySelector('.hello-div');
const helloDivShadow = document.querySelector('.hello-div-shadow');
const userName = document.querySelector('.userName');
const userNameInput = document.querySelector('.userName-input');
const userNamebutton = document.querySelector('.userName-button');

const clearDataButton = document.querySelector('.clear-data-btn');



// Events
document.addEventListener("DOMContentLoaded", getLocalTodos);

document.addEventListener("DOMContentLoaded", getUserName);
userNamebutton.addEventListener("click", newUserName);
userName.addEventListener("click", () => helloDiv.classList.remove('hide'));
helloDivShadow.addEventListener("click", () => helloDiv.classList.add('hide'));

todoAdd.addEventListener("click", addNewTodo);
todoList.addEventListener("click", checkAndTrash)
doneList.addEventListener("click", checkAndTrash)

clearDataButton.addEventListener("click", clearAllData);

// Functions
let lstTodo, lstDone;

function getLocalTodos() {
    if (!localStorage.getItem('userName')) {
        localStorage.setItem("lstTodo", JSON.stringify(["First ToDo!"]));
        localStorage.setItem("lstDone", JSON.stringify(["Done ToDo!"]));
    }

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
    checkIfDoneIsEmpty();
}

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

function checkAndTrash(eve) {
    const item = eve.target;

    // Trash Optoin
    if (item.classList[0] === 'trash-btn') {
        const todoItem = item.parentElement;

        todoItem.classList.add('trashed');

        todoItem.addEventListener('transitionend', function () {
            if (todoItem.parentElement === todoList) {
                removeTodo(lstTodo, todoItem);
                localStorage.setItem("lstTodo", JSON.stringify(lstTodo));
            }
            else if (todoItem.parentElement === doneList) {
                removeTodo(lstDone, todoItem);
                localStorage.setItem("lstDone", JSON.stringify(lstDone));
                checkIfDoneIsEmpty();
            }
            todoItem.remove();
        });
    }
    // Edit Option
    else if (item.classList[0] === 'edit-btn') {
        const todoItem = item.parentElement;
        const todoLi = todoItem.children[1];
        const todoEditSaveIcon = todoItem.children[0].querySelector('i');

        if (todoLi.contentEditable === "true") {
            todoEditSaveIcon.classList.add('fa-pencil');
            todoEditSaveIcon.classList.remove('fa-floppy-disk');

            if (todoItem.parentElement === todoList) {
                lstTodo[lstTodo.indexOf(todoLi.Title)] = todoLi.innerText = todoLi.innerText.trim();
                localStorage.setItem("lstTodo", JSON.stringify(lstTodo));
            }
            else if (todoItem.parentElement === doneList) {
                lstDone[lstDone.indexOf(todoLi.Title)] = todoLi.innerText = todoLi.innerText.trim();
                localStorage.setItem("lstDone", JSON.stringify(lstDone));
            }

            todoLi.contentEditable = false;
            todoItem.classList.remove('editing');
        }
        else {
            todoEditSaveIcon.classList.remove('fa-pencil');
            todoEditSaveIcon.classList.add('fa-floppy-disk');
            todoLi.contentEditable = true;

            todoLi.Title = todoItem.innerText;
            todoItem.classList.add('editing');
        }
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
        checkIfDoneIsEmpty();
        localStorage.setItem("lstTodo", JSON.stringify(lstTodo));
        localStorage.setItem("lstDone", JSON.stringify(lstDone));
    }

}


function addTodo(ulLstTarget, todoValue) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item');


    // Edit Btn
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    todoDiv.appendChild(editBtn);

    // Todo Text
    const todoLi = document.createElement('li');
    todoLi.contentEditable = false;
    todoLi.innerText = todoValue;

    todoDiv.appendChild(todoLi);

    // Delete Btn
    const trashBtn = document.createElement('button');
    trashBtn.classList.add('trash-btn');
    trashBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todoDiv.appendChild(trashBtn);

    // Adding To The List
    if (ulLstTarget === doneList) todoDiv.classList.add('checked');
    ulLstTarget.appendChild(todoDiv);
}

function removeTodo(lstTarget, todo) {
    const todoValue = todo.children[1].innerText;

    lstTarget.splice(lstTarget.indexOf(todoValue), 1);

    return todoValue;
}

function getUserName() {
    if (localStorage.getItem('userName')) {
        userName.innerText = localStorage.getItem('userName');
        helloDiv.classList.add('hide');
    }
    else {
        userNameInput.focus();
        helloDivShadow.classList.add('non-event');

    }
}

function newUserName(e) {
    e.preventDefault();
    if (/[A-Za-zא-ת]{2,12}/g.test(userNameInput.value)) {
        userNameInput.classList.remove("error-input");

        const afterFilter = /[A-Za-zא-ת]{2,12}/g.exec(userNameInput.value)[0];

        userName.innerText = afterFilter;
        userNameInput.value = afterFilter;
        localStorage.setItem("userName", userNameInput.value);

        helloDiv.classList.add('hide');
        helloDivShadow.classList.remove('non-event');

    }
    else userNameInput.classList.add("error-input");

}

function checkIfDoneIsEmpty() {
    if (lstDone.length === 0) doneList.parentElement.classList.add("hide");
    else doneList.parentElement.classList.remove("hide");
}

function clearAllData() {
    if (confirm('Are you Sure? All the data will be erased!')) {
        localStorage.clear();
        location.reload();
    }
}
