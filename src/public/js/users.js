document.addEventListener("DOMContentLoaded", main);

//add a new list to user account
async function addNewList(evt){
    console.log('clicked')
    let listName = document.querySelector('#list-name').value.trim();
    if(!listName){
        alert("please enter a name for your new list");
        return;
    }
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `listName=${listName}`
    }
    let response = await fetch("/api/add_new_list", config);
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.newList)
        }
    })
    document.querySelector('#list-name').value = "";
    data
        .then(addNewListNode)
        .catch(console.log);
}

//add a new task to the list
async function addNewTask(evt){
    let task = document.querySelector('#task-text').value.trim();
    let listId = document.querySelector('#task-list-id').value;
    if(!task){
        alert("please enter a task to add to your list")
        return;
    }

    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `task=${task}&listId=${listId}`
    }

    let response = await fetch("/api/add_new_task", config);
    let jsonData = await response.json();
    // console.log(jsonData);
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.newTask);
        }
    });
    document.querySelector('#task-text').value = "";
    data
        .then(addNewTaskNode)
        .catch(console.log);
}


//load content on page
async function loadContent(){
    let response = await fetch("/api/get_task_lists");
    let jsonData = await response.json();
    // console.log(jsonData);
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject()
        }
        else{
            resolve(jsonData.taskLists);
        }
    })
    data
    .then(generateLists)
    .catch(console.log)
    
}

//load tasks and hide them
async function loadTasks(id){
    let response = await fetch("/api/get_tasks/" + `?id=${id}`);
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.currentTasks);
        }
    })
    data
        .then(generateTasks)
        .catch(console.log);
}

async function loadCompletedTasks(id){
    let response = await fetch("/api/get_completed_tasks/" + `?id=${id}`);
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.completedTasks);
        }
    })
    data
        .then(generateCompletedTasks)
        .catch(console.log);

}

//create a new element for a new list item
async function addNewListNode(newList){
    // console.log(newList);
    let taskList = document.querySelector("#task-list");
    let name = document.createElement('div');
    let modalDisplay = document.querySelector("#modal-display");
    let taskContainer = document.createElement('div');
    taskContainer.id = newList._id;
    name.id = `${newList._id}-${newList.listName}`;
    name.className = 'list-item';
    let nameText = document.createTextNode(newList.listName);
    name.appendChild(nameText);
    taskList.appendChild(name);
    modalDisplay.appendChild(taskContainer);

    document.getElementById(taskContainer.id).style.display = "none";

    await loadTasks(newList._id);
    await loadCompletedTasks(newList._id);
}

//create a new element for a new task
async function addNewTaskNode(newTask){
    let inputBar = document.querySelector("#add-task-label");
    // console.log(newTask.taskList);
    let taskContainer = document.getElementById(newTask.taskList);
    let task = document.createElement('li');
    let taskText = document.createTextNode(newTask.content);
    task.id = newTask._id;
    task.className = 'task-item';
    task.appendChild(taskText)
    taskContainer.appendChild(task);
    inputBar.before(taskContainer);
    
}

async function addCompletedTasks(newCompletedTask){
    let completedTaskContainer = document.querySelector('#completed');
    let completedTask = document.createElement('li');
    let completedTaskText = document.createTextNode(newCompletedTask.content);
    completedTask.id = newCompletedTask._id;
    completedTask.className = 'completed-task-item';
    completedTask.appendChild(completedTaskText)
    completedTaskContainer.appendChild(completedTask);
}

//wrapper to create and display all lists referenced by a user
async function generateLists(lists){
    // let taskList = document.querySelector("#task-list");
    lists.map(addNewListNode);
}

//wrapper to create all tasks referenced by a taskList
async function generateTasks(tasks){
    tasks.map(addNewTaskNode);
}

async function generateCompletedTasks(completedTasks){
    completedTasks.map(addCompletedTasks);
}

//open the modal window for adding new tasks
async function expandList(evt){
    let currId = evt.target.id
    document.querySelector("#list-title").textContent = currId.slice(25);
    let containerId = currId.slice(0, 24);
    document.querySelector('#task-list-id').value = containerId;
    document.getElementById(containerId).style.display = "block";
    toggleModalTask(evt);
    
}

async function taskComplete(evt){
    // console.log(evt.target.parentNode)
    let taskContainer = evt.target.parentNode
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'taskId': evt.target.id,
            'taskListId': taskContainer.id
        })
    }
    let response = await fetch('/api/complete_task', config);
    let jsonData = await response.json();
    let data;
    taskContainer.removeChild(evt.target);
    updateCompletedTasks(evt);
    // console.log("completed")

}

async function updateCompletedTasks(evt){
    let completedTasks = document.querySelector('#completed');
    evt.target.className = "completed-task-item";
    completedTasks.appendChild(evt.target);
}


//open/close the modal window
async function toggleModalTask(evt){

    let currListId = document.querySelector('#task-list-id').value
    // console.log(currListId);
    if(evt.target.id === "done-adding-task"){
        document.querySelector('#task-list-id').value = ""
        document.getElementById(currListId).style.display = "none";
    }
    document.getElementById("modal-task").classList.toggle("open");
}

//event handler calls
function main(){
    console.log('test')
    const addTaskBtn = document.querySelector("#create-new-list");
    addTaskBtn.addEventListener("click", addNewList);

    document.addEventListener("click", function(evt) {
        let currEvt = evt.target;
        if(currEvt.className === "list-item"){
            expandList(evt);
        }
        else if(currEvt.id === "add-task"){
            addNewTask(evt);
        }
        else if(currEvt.id === "done-adding-task"){
            toggleModalTask(evt);
        }
        else if(currEvt.className === "task-item"){
            taskComplete(evt);
        }
    })

    loadContent();
}