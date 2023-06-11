let inputEle = document.querySelector(".input");
let submitEle = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks")
let containerDiv = document.querySelector(".container")
let deleteAll = document.querySelector(".delete-all");
let arrayOfTasks = [];
// console.log(inputEle)

getTasksFromServer();

submitEle.onclick = function () {
    if (inputEle.value !== "") {
        addTaskToArray(inputEle.value);
        inputEle.value = "";
    }
}

function addTaskToArray(taskText) {
    addTaskToServer(taskText);
}

function addTaskToPage(arrayOfTasks) {
    tasksDiv.innerHTML = "";

    arrayOfTasks.forEach((task) => {
        let div = document.createElement("div");
        div.className = "task";
        if (task.complated) {
            div.className = "task done";
        }
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));
        let span = document.createElement("span");
        span.className = "del";
        span.appendChild(document.createTextNode("Delete"))
        div.appendChild(span);
        tasksDiv.appendChild(div)
        // console.log(div)
    });
}


function addTaskToServer(taskText) {
    // Create an XMLHttpRequest object
    const xhttp = new XMLHttpRequest();

    // Define a callback function
    xhttp.onload = function () {
        let task = JSON.parse(xhttp.response)
        arrayOfTasks.push(task);
        addTaskToPage(arrayOfTasks);
    }

    // Send a request
    xhttp.open("GET", "/add-task?title=" + taskText);
    xhttp.send();
}
function getTasksFromServer() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        arrayOfTasks = JSON.parse(xhttp.response)
        addElementsToPageFromServer(arrayOfTasks);
    }
    xhttp.open("GET", "/all-tasks");
    xhttp.send();
}

function addElementsToPageFromServer(arrayOfTasks) {
    tasksDiv.innerHTML = "";
    arrayOfTasks.forEach((task) => {
        let div = document.createElement("div");
        div.className = "task";
        if (task.completed) {
            div.className = "task done";
        }
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));
        let span = document.createElement("span");
        span.className = "del";
        span.appendChild(document.createTextNode("Delete"));
        div.appendChild(span);
        tasksDiv.appendChild(div);
    });
}

// Click On Task Element
tasksDiv.onclick = ((e) => {
    if (e.target.classList.contains("del")) {
        deleteTaskFromServer(e.target.parentElement.getAttribute("data-id"));
    }
    if (e.target.classList.contains("task")) {
        updateStatusInServer(e.target.getAttribute("data-id"));
    }
})


function deleteTaskFromServer(taskId) {
    let req = new XMLHttpRequest()
    req.onload = function () {
        if (req.responseText == '1') {
            arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
            document.querySelector('[data-id="' + taskId + '"]').remove();
        }
    }
    req.open('GET', '/task/' + taskId + "/delete")
    req.send()
}
function updateStatusInServer(taskId) {
    let req = new XMLHttpRequest()
    req.onload = function () {
        document.querySelector('[data-id="' + taskId + '"]').classList.toggle("done");
    }
    req.open('GET', '/task/' + taskId + '/change-status')
    req.send()
}

deleteAll.onclick = function (e) {
    deleteAllFromServer()
}

function deleteAllFromServer() {
    fetch('/task/delete-all').then(()=>{
        arrayOfTasks = [];
        addElementsToPageFromServer(arrayOfTasks);
    })
}



