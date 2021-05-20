document.addEventListener("DOMContentLoaded", main);

//add a new list to user account
async function addNewList(evt){
    // console.log('clicked')
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
            resolve(jsonData.addedList)
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

async function taskComplete(evt){
    // console.log(evt.target.parentNode)
    let taskContainer = evt.target.parentNode.parentNode
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'taskId': evt.target.id,
            'taskListId': taskContainer.id.slice(0, 24)
        })
    }
    let response = await fetch('/api/complete_task', config);
    let jsonData = await response.json();
    console.log(jsonData)
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject()
        }
        else{
            resolve(jsonData.result)
        }
    });
    // evt.target.classList.toggle('fly-off')
    evt.target.parentNode.remove();
    data
        .then(addCompletedTasks)
        .then(checkCompletion(null,jsonData.checkComplete, jsonData.result.taskList))
        .catch(console.log)
    
    // console.log("completed")

}

async function undoTask(evt){
    let completedTaskContainer = evt.target.parentNode
    // console.log(completedTaskContainer)
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'taskId': evt.target.id,
            'taskListId': completedTaskContainer.id.slice(0, 24)
        })
    }
    let response = await fetch('/api/undo_task', config);
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.result)
        }
    })
    evt.target.remove();
    data
        .then(addNewTaskNode)
        .then(checkCompletion(null, false, jsonData.result.taskList))
        .catch(console.log)
}

async function editListName(listId){
    // console.log("list")
    let newName = document.querySelector("#edit-text").value.trim();
    if(!newName){
        alert("enter a new name");
        return;
    }
    // console.log(newName)
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `taskListId=${listId}&newName=${newName}`
    }
    let response = await fetch('/api/edit_list_name', config);
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.result)
        }
    })
    console.log(jsonData);
    document.querySelector("#edit-text").value = ""
    data
        .then(updateListName)
        .catch(console.log);
}

async function editTask(listId, taskId){
    // console.log("list")
    let newTask = document.querySelector("#edit-text").value.trim();
    if(!newTask){
        alert("enter a new name");
        return;
    }
    // console.log(newName)
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `taskId=${taskId}&taskListId=${listId}&newTask=${newTask}`
    }
    let response = await fetch('/api/edit_task', config);
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject();
        }
        else{
            resolve(jsonData.result)
        }
    })
    console.log(jsonData);
    document.querySelector("#edit-text").value = ""
    data
        .then(updateTask)
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
    .then(changeTag)
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


async function editContent(itemType, listId, taskId){
    // console.log(document.querySelector('#edit-item-id').value, " is a ", document.querySelector('#item-type').value);
    if(itemType === "list"){
        editListName(listId);
    }
    else if(itemType === "task"){
        editTask(listId, taskId);
    }
}

//create a new element for a new list item
async function addNewListNode(newList){
    // select needed elements 
    let taskList = document.querySelector("#task-list");
    let currentTaskDisplay = document.querySelector("#current-task-display");
    let completedTaskDisplay = document.querySelector('#completed-task-display');

    // div that will hold the tasks created along side the list
    let taskContainer = document.createElement('div');
    taskContainer.id = `${newList._id}-container`;
    taskContainer.className = "container"
    
    // row will hold the list name, complete tag and edit button
    let row = document.createElement('div');
    let name = document.createElement('div');
    name.style.display = 'inline-block';
    name.id = `${newList._id}`;
    name.className = 'list-item';
    let nameText = document.createTextNode(newList.listName);
    let completeTag = document.createElement('span');
    completeTag.textContent = "incomplete";
    completeTag.id = `${newList._id}-tag`
    completeTag.className = "complete-tag"
    let editListBtn = document.createElement('div');
    editListBtn.style.display = 'inline-block';
    editListBtn.id = `${newList._id}-edit`
    editListBtn.className = "edit-list-button"
    let editBtnText = document.createTextNode("Edit");
    editListBtn.appendChild(editBtnText);

    //div that will contain the completed taks for this list
    let completedTaskContainer = document.createElement('div');
    completedTaskContainer.id = `${newList._id}-completed`
    completedTaskContainer.className = "container"
    name.appendChild(nameText);
    row.appendChild(name);
    row.appendChild(completeTag);
    row.appendChild(editListBtn);
    taskList.appendChild(row);
    currentTaskDisplay.appendChild(taskContainer);
    completedTaskDisplay.appendChild(completedTaskContainer);
    
    let addTaskDoneBtn = document.querySelector("#done-adding-task");
    addTaskDoneBtn.before(taskContainer);

    let completeTaskDoneBtn = document.querySelector("#done-undoing-task");
    completeTaskDoneBtn.before(completedTaskContainer)

    taskContainer.style.display = "none";
    completedTaskContainer.style.display = "none";

    await loadTasks(newList._id);
    await loadCompletedTasks(newList._id);
}

//create a new element for a new task
async function addNewTaskNode(newTask){
    // let inputBar = document.querySelector("#add-task-label");
    // console.log(newTask, Object.keys(newTask));
    let taskContainer = document.getElementById(`${newTask.taskList}-container`);
    let row = document.createElement('div');
    let task = document.createElement('div');
    task.style.display = "inline-block"
    let taskText = document.createTextNode(newTask.content);
    let editTaskText= document.createElement('div');
    editTaskText.style.display = 'inline-block';
    editTaskText.id = `${newTask._id}-edit`
    editTaskText.className = "edit-task-button"
    let editBtnText = document.createTextNode("Edit");
    editTaskText.appendChild(editBtnText);
    task.id = newTask._id;
    task.className = 'task-item';
    task.appendChild(taskText)
    row.appendChild(task);
    row.appendChild(editTaskText);
    taskContainer.appendChild(row);
    // inputBar.before(taskContainer);
    
}

async function addCompletedTasks(newCompletedTask, checkComplete){
    // console.log(params[0], params[1])
    // let newCompletedTask = params[0];
    // let checkComplete = params[1];
    // if(checkComplete){

    // }
    // console.log(newCompletedTask)
    // console.log(`${newCompletedTask.taskList}-completed`)
    let completedTaskContainer = document.getElementById(`${newCompletedTask.taskList}-completed`);
    let completedTask = document.createElement('div');
    let completedTaskText = document.createTextNode(newCompletedTask.content);
    completedTask.id = newCompletedTask._id;
    completedTask.className = 'completed-task-item';
    // completedTask.style.display = "block";
    completedTask.appendChild(completedTaskText)
    completedTaskContainer.appendChild(completedTask);
}

async function updateListName(list){
    document.getElementById(list._id).textContent = list.listName;
}

async function updateTask(task){
    document.getElementById(task._id).textContent = task.content;
}

//wrapper to create and display all lists referenced by a user
async function generateLists(lists){
    // let taskList = document.querySelector("#task-list");
    lists.map(await addNewListNode);
    return lists;
}

//wrapper to create all tasks referenced by a taskList
async function generateTasks(tasks){
    tasks.map(await addNewTaskNode);
}

async function generateCompletedTasks(completedTasks){
    completedTasks.map(addCompletedTasks);
}

//open the modal window for adding new tasks
async function expandList(evt){
    let currId = evt.target.id
    document.getElementsByClassName("list-title")[0].textContent = evt.target.textContent;
    document.getElementsByClassName("list-title")[1].textContent = `${evt.target.textContent} - completed tasks`;
    await setListId(evt);
    let containerId = document.querySelector("#task-list-id").value;
    
    document.getElementById(`${containerId}-container`).style.display = "block";
    document.getElementById(`${containerId}-completed`).style.display = "block";
    toggleModalTask(evt);
    
}

//open/close the modal window
async function toggleModalTask(evt){
    let currListId = document.querySelector('#task-list-id').value
    if(evt.target.className === "close"){
        // console.log(`${currListId}-completed`+" in list");
        document.getElementById(`${currListId}-container`).style.display = "none";
        document.getElementById(`${currListId}-completed`).style.display = "none";
        document.querySelector('#task-list-id').value = ""
        if(evt.target.parentNode.id === "completed-task-display"){
            switchWindow(evt);
        }
    }
    document.getElementById("modal-task").classList.toggle("open");
}

async function toggleEditWindow(evt){
    // console.log(document.querySelector('#task-list-id').value+" in edit")
    document.getElementById("modal-edit").classList.toggle("open");
}

async function setListId(evt){
    document.querySelector('#task-list-id').value = evt.target.id.slice(0,24);
    // return document.querySelector('#task-list-id').value;
}

async function setEditId(evt, itemType){
    document.querySelector('#edit-item-id').value = evt.target.id.slice(0,24);
    document.querySelector('#item-type').value = itemType;
}

async function switchWindow(evt){
    let currWindow = evt.target.parentNode;
    let otherWindowId = ""
    currWindow.style.display = "none";
    if(currWindow.id === "current-task-display"){
        otherWindowId = "completed-task-display"
    }
    else{
        otherWindowId = "current-task-display"
    }
    // console.log(otherWindowId)
    let otherWindow = document.getElementById(otherWindowId)
    otherWindow.style.display = "block"
}

async function changeTag(lists){
    lists.map(await checkCompletion)
}

async function checkCompletion(list, check, listId){
    // console.log(list.currentTasks.length)
    if(!list && check){
        let tag = document.getElementById(`${listId}-tag`);
        tag.textContent = "complete"
        tag.classList.toggle("complete")
    }
    else if(check === false){
        let tag = document.getElementById(`${listId}-tag`);
        if(tag.textContent === "complete"){
            tag.classList.toggle("complete");
        }
        tag.textContent = "incomplete"
    }
    else if(list.currentTasks.length === 0 && list.completedTasks.length === 0){
        let tag = document.getElementById(`${list._id}-tag`);
        tag.textContent = "incomplete"
    }
    else if(list.currentTasks.length === 0){
        let tag = document.getElementById(`${list._id}-tag`);
        // console.log("test");
        tag.textContent = "complete"
        tag.classList.toggle("complete")
    }
}

//event handler calls
function main(){
    // console.log('test')
    const addTaskBtn = document.querySelector("#create-new-list");
    addTaskBtn.addEventListener("click", addNewList);

    document.addEventListener("click", function(evt) {
        let currEvt = evt.target;
        if(currEvt.className === "list-item"){
            setListId(evt);
            expandList(evt);
        }
        else if(currEvt.className === "switch"){
            switchWindow(evt);
        }
        else if(currEvt.id === "add-task"){
            addNewTask(evt);
        }
        else if(currEvt.className === "close"){
            toggleModalTask(evt);
        }
        else if(currEvt.className === "task-item"){
            // console.log(evt, evt.target)
            taskComplete(evt);
        }
        else if(currEvt.className === "completed-task-item"){
            undoTask(evt);
        }
        else if(currEvt.className === "edit-list-button"){
            document.querySelector("#edit-item").textContent = "Change List Name"
            setListId(evt);
            setEditId(evt, "list");
            toggleEditWindow(evt);
        }
        else if(currEvt.className === "edit-task-button"){
            document.querySelector("#edit-item").textContent = "Change Task"
            setEditId(evt, 'task');
            toggleEditWindow(evt);
        }
        else if(currEvt.id === "confirm-edit"){
            let itemType = document.querySelector('#item-type').value
            let listId = document.querySelector('#task-list-id').value
            let taskId = document.querySelector('#edit-item-id').value
            toggleEditWindow(evt);
            editContent(itemType, listId, taskId);
        }
    })

    loadContent();
}