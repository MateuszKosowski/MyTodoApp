"use strict";

class TodoItem {
    constructor({ title, description, place, category, dueDate }) {
        this.title = title;
        this.description = description;
        this.place = place;
        this.category = category;
        this.dueDate = dueDate;
    }
}

let todoList = [];

// Użycie funkcji strzałkowej blokuje możliwość wywołania jej przed deklaracją
// Jeśli nie potrzebuję, this lub konstruktora to jest prostsza składnia niż funkcja anonimowa
let initList = () => {

    let savedList = window.localStorage.getItem("todos");
    if (savedList != null) {
        todoList = JSON.parse(savedList);
    }
    else {
        todoList.push(new TodoItem({
            title: "Learn JS",
            description: "Create a demo application for my TODO's",
            place: "445",
            category: '',
            dueDate: new Date(2024, 10, 16)
        }));

        todoList.push(new TodoItem({
            title: "Lecture test",
            description: "Quick test from the first three lectures",
            place: "F6",
            category: '',
            dueDate: new Date(2024, 10, 17)
        }));
    }
};

initList();

let updateTodoList = () => {
    const todoListDiv = document.querySelector(".todoListView");
    const filterInput = document.querySelector("#inputSearch");
    filterInput.addEventListener("input", updateTodoList);
    
    let createItem = (todo) => {
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newP.textContent = todo.title + " " + todo.description;
        newDiv.appendChild(newP);

        const newDeleteButton = document.createElement("input");
        newDeleteButton.type = "button";
        newDeleteButton.value = "Delete";
        newDeleteButton.addEventListener("click",
            function () {
                deleteTodo(todo);
            });

        newDiv.appendChild(newDeleteButton);

        todoListDiv.appendChild(newDiv);
    }

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    for (let todo of todoList) {
        if (filterInput.value == "") {
            createItem(todo);
        } else {
            if ((todo.title.includes(filterInput.value)) ||
                (todo.description.includes(filterInput.value))) {
                createItem(todo);
            }
        }
    }

    window.localStorage.setItem("todos", JSON.stringify(todoList));
};


let deleteTodo = (todo) => {
    const index = todoList.indexOf(todo);
    if (index > -1) {
        todoList.splice(index, 1);
        updateTodoList();
    }
};

let addTodo = () => {

    const form = document.querySelector(".todoFormView form");
    const { inputTitle, inputDescription, inputPlace, inputCategory, inputDate } = form.elements;

    const newTodoItem = new TodoItem({
        title: inputTitle.value,
        description: inputDescription.value,
        place: inputPlace.value,
        category: inputCategory.value,
        dueDate: new Date(inputDate.value)
    });

    todoList.push(newTodoItem);
    form.reset();
    updateTodoList();
}

updateTodoList();


