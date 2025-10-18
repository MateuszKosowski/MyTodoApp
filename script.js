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

// let initList = () => {

//     let savedList = window.localStorage.getItem("todos");
//     if (savedList != null) {
//         todoList = JSON.parse(savedList);
//     }
//     else {
//         todoList.push(new TodoItem({
//             title: "Learn JS",
//             description: "Create a demo application for my TODO's",
//             place: "445",
//             category: '',
//             dueDate: new Date(2024, 10, 16)
//         }));

//         todoList.push(new TodoItem({
//             title: "Lecture test",
//             description: "Quick test from the first three lectures",
//             place: "F6",
//             category: '',
//             dueDate: new Date(2024, 10, 17)
//         }));
//     }
// };

// initList();

let fetchJSON = (method, body) => {
    let req = new XMLHttpRequest();
    const baseUrl = "https://api.jsonbin.io/v3/b/68f38bbcd0ea881f40a9e1cd";
    const url = method === "GET" ? baseUrl + "/latest" : baseUrl;

    req.open(method, url, true);
    req.setRequestHeader("X-Master-Key", "$2a$10$JyiWr4LNEJlpTsDbR2j9SuaRlznciAZmHm/uKAYs2Ijnd6ceaM3TG");
    if (method === "PUT") {
        req.setRequestHeader("Content-Type", "application/json");
    }

    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                if (method === "GET") {
                    let response = JSON.parse(req.responseText);
                    todoList = response.record.map(todo => new TodoItem({
                        ...todo,
                        dueDate: new Date(todo.dueDate)
                    }));
                    updateTodoList();
                }
            } else {
                console.error(`Request failed: ${req.status} ${req.statusText}`);
            }
        }
    };

    if (method === "PUT") {
        req.send(body);
    } else {
        req.send();
    }
};

fetchJSON("GET", null);

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

    fetchJSON("PUT", JSON.stringify(todoList));
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