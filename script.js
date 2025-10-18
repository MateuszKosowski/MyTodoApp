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
    const todoListBody = document.querySelector(".todoListBody");
    const filterInput = document.querySelector("#inputSearch");
    const filterFromDate = document.querySelector("#filterFromDate");
    const filterToDate = document.querySelector("#filterToDate");
    
    let createItem = (todo) => {
        const newTr = document.createElement("tr");
        for (let key in todo) {
            const newTd = document.createElement("td");
            if (key === "dueDate") {
                newTd.textContent = todo[key].toLocaleDateString();
            }
            else {
                newTd.textContent = todo[key];
            }
            newTr.appendChild(newTd);
        }

        const newDeleteButton = document.createElement("button");
        newDeleteButton.type = "button";
        newDeleteButton.className = "btn btn-danger btn-sm";
        newDeleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete';
        newDeleteButton.addEventListener("click",
            function () {
                deleteTodo(todo);
            });

        const actionCell = document.createElement("td");
        actionCell.className = "text-center";
        actionCell.appendChild(newDeleteButton);
        newTr.appendChild(actionCell);
        todoListBody.appendChild(newTr);
    }

    while (todoListBody.firstChild) {
        todoListBody.removeChild(todoListBody.firstChild);
    }

    for (let todo of todoList) {
        let matchesSearch = filterInput.value === "" || (todo.title.includes(filterInput.value) || todo.description.includes(filterInput.value));
        let fromDate = filterFromDate.value ? new Date(filterFromDate.value) : null;
        let toDate = filterToDate.value ? new Date(filterToDate.value) : null;
        let matchesDate = true;
        if (fromDate && todo.dueDate < fromDate) matchesDate = false;
        if (toDate && todo.dueDate > toDate) matchesDate = false;
        if (matchesSearch && matchesDate) {
            createItem(todo);
        }
    }
};

let createdFilterListener = () => {
    const filterInput = document.querySelector("#inputSearch");
    const filterFromDate = document.querySelector("#filterFromDate");
    const filterToDate = document.querySelector("#filterToDate");
    
    filterInput.addEventListener("input", updateTodoList);
    filterFromDate.addEventListener("input", updateTodoList);
    filterToDate.addEventListener("input", updateTodoList);
};

createdFilterListener();

let deleteTodo = (todo) => {
    const index = todoList.indexOf(todo);
    if (index > -1) {
        todoList.splice(index, 1);
        updateTodoList();
        fetchJSON("PUT", JSON.stringify(todoList));
    }
};

let addTodo = () => {
    const form = document.querySelector(".todoFormView form");
    const { inputTitle, inputDescription, inputPlace, inputDate } = form.elements;

    const newTodoItem = new TodoItem({
        title: inputTitle.value,
        description: inputDescription.value,
        place: inputPlace.value,
        dueDate: new Date(inputDate.value)
    });

    todoList.push(newTodoItem);
    form.reset();
    updateTodoList();
    fetchJSON("PUT", JSON.stringify(todoList));
    
    confetti({
        particleCount: 500,
        spread: 360,
        origin: { y: 0.6 },
        angle: 90,
        startVelocity: 100,
        gravity: 0.5,
        ticks: 200
    });
}

updateTodoList();