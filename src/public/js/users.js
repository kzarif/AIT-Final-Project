document.addEventListener("DOMContentLoaded", main);

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

async function expandList(evt){
    if(evt.target.className === "list-item"){
        toggleModalTask();
    }
}

async function toggleModalTask(){
    document.getElementById("modal-task").classList.toggle("open");
}

async function loadContent(){
    let response = await fetch("/api/get_task_lists");
    let jsonData = await response.json();
    let data = new Promise((resolve, reject) => {
        if(jsonData.err){
            reject()
        }
        else{
            resolve(jsonData.results);
        }
    })
    data
        .then(generateLists)
        .catch(console.log)

}

async function addNewListNode(newList){
    let taskList = document.querySelector("#task-list");
    let name = document.createElement('li');
    name.id = `${newList.user}-${newList.name}`;
    name.className = 'list-item';
    let nameText = document.createTextNode(newList.listName);
    name.appendChild(nameText);
    taskList.appendChild(name);
}

async function generateLists(lists){
    let taskList = document.querySelector("#task-list");
    lists.map(addNewListNode);
}

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