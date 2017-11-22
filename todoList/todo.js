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
  //TODO list of all string and have the http loop on all of them
  let keyName = document.getElementById('save-key').value
  Object.keys(taskList).forEach(function(key){
    //addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
    var xhttp = new XMLHttpRequest();
    var params = 'name=' + taskList[key].name + '&isDone=' + taskList[key.isDone] + '&listId=' + keyName;
    xhttp.open("POST", 'http://localhost:8080/api/todoInstances', true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
  });
  document.getElementById('user-message').innerText = "Save Completed";
}

function deleteTodo(){
  let keyName = document.getElementById('save-key').value;
  if (keyName != ''){
    let xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', 'http://localhost:8080/api/todoInstances/listId/' + keyName, true);
    xhttp.send();
    document.getElementById('user-message').innerText = "Delete Completed";
  }else{
    document.getElementById('user-message').innerText = "Please enter a key to delete your Todo List form the database.";
  }
}

function loadTodo(){
  let keyName = document.getElementById('save-key').value;
  if(keyName != ''){
    taskList = {};
    emptyCurrentList();
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
    xhttp.open('GET', 'http://localhost:8080/api/todoInstances/listId/' + keyName, true);
    xhttp.send();
    document.getElementById('user-message').innerText = "Load Completed";
  }else{
    document.getElementById('user-message').innerText = "Please enter a key to save your Todo List.";
  }
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
  document.getElementById('user-message').innerText = "";
}

function showIncompletedTasks() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(!taskList[key].isDone){
      addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
    }
  });
  document.getElementById('user-message').innerText = "";
}

function showCompletedTasks() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(taskList[key].isDone){
      addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
    }
  });
  document.getElementById('user-message').innerText = "";
}

function clearCompleted() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(taskList[key].isDone){
      delete taskList[key];
    }
  });
  showAllTasks();
  document.getElementById('user-message').innerText = "";
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
document.getElementById('delete-todo').addEventListener('click', deleteTodo);
