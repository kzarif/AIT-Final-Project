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
    let response = await fetch("/api/create_new_list", config);
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

//open the modal window for adding new tasks
async function expandList(evt){
    document.querySelector("#list-title").textContent = evt.target.id.slice(25);
    toggleModalTask();
    
}

//open/close the modal window
async function toggleModalTask(){
    document.getElementById("modal-task").classList.toggle("open");
}

//load content on page
async function loadContent(){
    let response = await fetch("/api/get_task_lists");
    let jsonData = await response.json();
    console.log(jsonData);
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

//create a new element for a new list item
async function addNewListNode(newList){
    let taskList = document.querySelector("#task-list");
    let taskContainer = document.createElement('div');
    taskContainer.id = newList._id;
    let name = document.createElement('div');
    name.id = `${newList._id}-${newList.listName}`;
    name.className = 'list-item';
    let nameText = document.createTextNode(newList.listName);
    name.appendChild(nameText);
    taskContainer.appendChild(name);
    taskList.appendChild(taskContainer);
}

async function generateLists(lists){
    let taskList = document.querySelector("#task-list");
    lists.map(addNewListNode);
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

        }
        else if(currEvt.id === "done-adding-task"){
            toggleModalTask();
        }
    })

    loadContent();
}