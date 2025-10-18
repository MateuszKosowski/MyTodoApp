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

    todoList.push(new TodoItem({
        title: "Learn JS",
        description: "Create a demo application for my TODO's",
        place: "445",
        category: '',
        dueDate: new Date(2024,10,16)
    }));

    todoList.push(new TodoItem({
        title: "Lecture test",
        description: "Quick test from the first three lectures",
        place: "F6",
        category: '',
        dueDate: new Date(2024,10,17)
    }));

};

initList();

let updateTodoList = () => {
    let todoListDiv = document.querySelector(".todoListView");

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    for (let todo of todoList) {
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newP.textContent = todo.title + " " + todo.description;
        newDiv.appendChild(newP);
        todoListDiv.appendChild(newDiv);
    }

};

let addTodo = (todo) => {

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
    updateTodoList();
}

updateTodoList();


