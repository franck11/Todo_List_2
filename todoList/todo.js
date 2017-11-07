var taskList = {};
var uniqueId = 0;

class Task {
  constructor(name, uniqueId){
    this.name = name;
    this.uniqueId = uniqueId;
    this.isDone = false;
  }
}

function saveTodo(){
  deleteDBInfoByTodoName(document.getElementById('save-key').value);
  //add todoinstances to DB
}

function loadTodo(){
  taskList = {};
  emptyCurrentList();
  let keyName = document.getElementById('save-key').value;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       let text = xhttp.responseText;
       let listOfInstance = JSON.parse(text);
       if(listOfInstance.length <= 1){
         findTodoInstancesByListId(listOfInstance[0]._id);
       }else{
         console.log('ERROR: More than 1 Todo List with the keyId specified found.');
       }
    }
  };
  xhttp.open('GET', 'http://localhost:8080/api/todoLists/keyId/' + keyName, true);
  xhttp.send();
}

function findTodoInstancesByListId(listId){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       let text = xhttp.responseText;
       let listOfInstance = JSON.parse(text);
       listOfInstance.forEach(function(instance,index){
          addTask(instance.name);
       });
    }
  };
  xhttp.open('GET', 'http://localhost:8080/api/todoInstances/listId/' + listId, true);
  xhttp.send();
}

function deleteDBInfoByTodoName(keyName){
  let xhttp1 = new XMLHttpRequest();
  xhttp1.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       let text = xhttp1.responseText;
       let listOfInstance = JSON.parse(text);
       if(listOfInstance.length <= 1){
         let xhttp2 = new XMLHttpRequest();
         let url1 = 'http://localhost:8080/api/todoLists/keyId/' + listOfInstance[0].keyId;
         xhttp2.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
             console.log('Does this work?');
             let xhttp3 = new XMLHttpRequest();
             url2 = '/api/todoInstances/listId/' + listOfInstance[0]._id;
             xhttp3.onreadystatechange = function() {
               if (this.readyState == 4 && this.status == 200) {
                 addTodoListToDB(document.getElementById('save-key').value);
                 //TODO: get request to get the id of the new element  created above^
                 //TODO: loop of all the todoinstances and add them with a post request.
               }
             };
             xhttp3.open('DELETE', url2, true);
             xhttp3.send();
           }
         };
         xhttp2.open('DELETE', url1, true);
         xhttp2.send();
       }else{
         console.log('ERROR: More than 1 Todo List with the keyId specified found.');
       }
    }
  };
  xhttp1.open('GET', 'http://localhost:8080/api/todoLists/keyId/' + keyName, true);
  xhttp1.send();
}

function addTodoListToDB(keyName){
  let xhttp = new XMLHttpRequest();
  let params = "keyId=" + keyName;
  xhttp.open("POST", '/api/todoLists', true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);
}

function addTask (taskString) {
  let newTaskString = taskString;
  if(newTaskString !== ''){
    let newTask = new Task(newTaskString, uniqueId);
    taskList[uniqueId] = newTask;
    addTaskToList(newTaskString, uniqueId, false);
    document.getElementById('todo-input').value = '';
    uniqueId++;
  }
}

function addTaskToList(taskString, taskId, doneStatus) {
  let newCheckbox = document.createElement('input');
  newCheckbox.type = 'checkbox';
  newCheckbox.checked = doneStatus;
  newCheckbox.addEventListener('change', (event) => {
    let target = event.target || event.srcElement;
    changeTaskStatus(target);
  });

  let newButton = document.createElement('button');
  newButton.type = 'button';
  let buttonText = document.createTextNode('x');
  newButton.addEventListener('click', (event) => {
    let target = event.target || event.srcElement;
    removeTask(target);
  });
  newButton.appendChild(buttonText);

  let newNode = document.createElement('li');
  let listElement = document.getElementById('task-list');
  newNode.appendChild(newCheckbox);
  newNode.appendChild(document.createTextNode(taskString));
  newNode.appendChild(newButton);
  newNode.id = taskId;
  listElement.appendChild(newNode);
}

function changeTaskStatus(element) {
  if(taskList[element.parentElement.id]){
    taskList[element.parentElement.id].isDone = !taskList[element.parentElement.id].isDone;
  }
}

function removeTask(element) {
  if(taskList[element.parentElement.id]){
    delete taskList[element.parentElement.id];
    element.parentElement.remove();
  }
}

function emptyCurrentList() {
  let listElement = document.getElementById('task-list');
  while(listElement.firstChild){
    listElement.removeChild(listElement.firstChild);
  }
}

function showAllTasks() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
  });
}

function showIncompletedTasks() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(!taskList[key].isDone){
      addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
    }
  });
}

function showCompletedTasks() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(taskList[key].isDone){
      addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
    }
  });
}

function clearCompleted() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(taskList[key].isDone){
      delete taskList[key];
    }
  });
  showAllTasks();
}

//Add Event Listeners
document.getElementById('todo-input').addEventListener('keypress', (event) => {
  if(event.which === 13){
    addTask(document.getElementById('todo-input').value);
  }
});
document.getElementById('all').addEventListener('click', showAllTasks);
document.getElementById('incompleted').addEventListener('click', showIncompletedTasks);
document.getElementById('completed').addEventListener('click', showCompletedTasks);
document.getElementById('clear-completed').addEventListener('click', clearCompleted);
document.getElementById('save-todo').addEventListener('click', saveTodo);
document.getElementById('load-todo').addEventListener('click', loadTodo);
