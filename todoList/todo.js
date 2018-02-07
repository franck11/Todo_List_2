let taskList = {};
let uniqueId = 0;

class Task {
  constructor(name, uniqueId, status){
    this.name = name;
    this.uniqueId = uniqueId;
    this.isDone = status;
  }
}

const ALL_TASKS = 0;
const INCOMPLETE_TASKS = 1;
const COMPLETE_TASKS = 2;

function showTasks(type){
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(type === ALL_TASKS ||
      (type === INCOMPLETE_TASKS && !taskList[key].isDone) ||
      (type === COMPLETE_TASKS && taskList[key].isDone)){
        addTaskToList(taskList[key].name, taskList[key].uniqueId, taskList[key].isDone);
      }
  });
}

function sendUserStatus(statusString){
  document.getElementById('user-message').innerText = statusString;
}

function createXMLHttpRequest(type, path, params, onStateChangeFunction){
  let xhttp = new XMLHttpRequest();
  xhttp.open(type, path, true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(params);
  return xhttp;
}

function saveTodo(){
  let keyName = document.getElementById('save-key').value
  if (keyName != ''){
    let params = [];
    let i = 0;
    Object.keys(taskList).forEach(function(j){
      params[3*i] = taskList[j].name;
      params[3*i+1] = taskList[j].isDone;
      params[3*i+2] = keyName;
      i++;
    });
    let stringifiedParams = 'list=' + JSON.stringify(params);
    createXMLHttpRequest('POST', 'http://localhost:8080/api/todo', stringifiedParams);
    sendUserStatus('Save Completed');
  }else{
    sendUserStatus('Please enter a key to save your Todo List form to the database.');
  }
}

function deleteTodo(){
  let keyName = document.getElementById('save-key').value;
  if (keyName != ''){
    let url = 'http://localhost:8080/api/todo/' + keyName;
    createXMLHttpRequest('DELETE', url);
    sendUserStatus('Delete Completed');
  }else{
    sendUserStatus('Please enter a key to delete your Todo List form to the database.');
  }
}

function loadTodo(){
  let keyName = document.getElementById('save-key').value;
  if(keyName != ''){
    taskList = {};
    emptyCurrentList();
    let url = 'http://localhost:8080/api/todo/' + keyName;
    let xhttp = createXMLHttpRequest('GET', url);
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         let text = xhttp.responseText;
         try{
           let listOfInstance = JSON.parse(text);
           listOfInstance.forEach(function(instance,index){
              addTask(instance.name, instance.isDone);
           });
         }catch(err){
           sendUserStatus('Loading Failed: ' + err.message);
         }
      }
      sendUserStatus('Load Completed');
    };
  }else{
    sendUserStatus('Please enter a key to load your Todo List.');
  }
}

function addTask (taskString, status) {
  let newTaskString = taskString;
  if(newTaskString !== ''){
    let newTask = new Task(newTaskString, uniqueId, status);
    taskList[uniqueId] = newTask;
    addTaskToList(newTaskString, uniqueId, status);
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

function clearCompleted() {
  emptyCurrentList();
  Object.keys(taskList).forEach(function(key){
    if(taskList[key].isDone){
      delete taskList[key];
    }
  });
  showTasks(ALL_TASKS);
  sendUserStatus('Completed Tasks Removed');
}

//Add Event Listeners
document.getElementById('todo-input').addEventListener('keypress', (event) => {
  if(event.which === 13){
    addTask(document.getElementById('todo-input').value, false);
  }
});
document.getElementById('all').addEventListener('click', function() { showTasks(ALL_TASKS) });
document.getElementById('incompleted').addEventListener('click', function() { showTasks(INCOMPLETE_TASKS) });
document.getElementById('completed').addEventListener('click', function() { showTasks(COMPLETE_TASKS) });
document.getElementById('clear-completed').addEventListener('click', clearCompleted);
document.getElementById('save-todo').addEventListener('click', saveTodo);
document.getElementById('load-todo').addEventListener('click', loadTodo);
document.getElementById('delete-todo').addEventListener('click', deleteTodo);
