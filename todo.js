var taskList = {};
var uniqueId = 0;

class Task {
  constructor(name, uniqueId){
    this.name = name;
    this.uniqueId = uniqueId;
    this.isDone = false;
  }
}

function addTask () {
  let newTaskString = document.getElementById('todo-input').value;
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
    addTask();
  }
});
document.getElementById('all').addEventListener('click', showAllTasks);
document.getElementById('incompleted').addEventListener('click', showIncompletedTasks);
document.getElementById('completed').addEventListener('click', showCompletedTasks);
document.getElementById('clear-completed').addEventListener('click', clearCompleted);
