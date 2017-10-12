var taskList = [];
var uniqueId = 0;

class Task {
  constructor(name, uniqueId){
    this._name = name;
    this._uniqueId = uniqueId;
    this._isDone = false;
  }
  get name(){
    return this._name;
  }
  get uniqueId(){
    return this._uniqueId;
  }
  get isDone(){
    return this._isDone;
  }
  set isDone(value){
    this._isDone = value;
  }
}

const addTask = function() {
  let newTaskString = document.getElementById('todoInput').value;
  if(newTaskString !== ''){
    let newTask = new Task(newTaskString, uniqueId);
    taskList.push(newTask);
    addTaskToList(newTaskString, uniqueId, false);
    document.getElementById('todoInput').value = '';
    uniqueId++;
  }
}

const addTaskToList = function(taskString,taskId,doneStatus) {
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
  let listElement = document.getElementById('taskList');
  newNode.appendChild(newCheckbox);
  newNode.appendChild(document.createTextNode(taskString));
  newNode.appendChild(newButton);
  newNode.id = taskId;
  listElement.appendChild(newNode);
}

const changeTaskStatus = function(element) {
  for(let i = 0; i < taskList.length; i++){
    if(element.parentElement.id == taskList[i].uniqueId){
      taskList[i].isDone = !taskList[i].isDone;
      element.checked ? element.checked = true : element.checked = false;
    }
  }
}

const removeTask = function(element) {
  for(let i = 0; i < taskList.length; i++){
    if(element.parentElement.id == taskList[i].uniqueId){
      taskList.splice(i,1);
      element.parentElement.remove();
    }
  }
}

const emptyCurrentList = function() {
  let listElement = document.getElementById('taskList');
  while(listElement.firstChild){
    listElement.removeChild(listElement.firstChild);
  }
}

const showAllTasks = function() {
  emptyCurrentList();
  for(let i = 0; i < taskList.length; i++){
    addTaskToList(taskList[i].name, taskList[i].uniqueId, taskList[i].isDone);
  }
}

const showIncompletedTasks = function() {
  emptyCurrentList();
  for(let i = 0; i < taskList.length; i++){
    if(!taskList[i].isDone){
      addTaskToList(taskList[i].name, taskList[i].uniqueId, taskList[i].isDone);
    }
  }
}

const showCompletedTasks = function() {
  emptyCurrentList();
  for(let i = 0; i < taskList.length; i++){
    if(taskList[i].isDone){
      addTaskToList(taskList[i].name, taskList[i].uniqueId, taskList[i].isDone);
    }
  }
}

const clearCompleted = function() {
  emptyCurrentList();
  for(let i = taskList.length-1; i >= 0; i--){
    if(taskList[i].isDone){
      taskList.splice(i,1);
    }
  }
  for(let i = 0; i < taskList.length; i++){
    addTaskToList(taskList[i].name, taskList[i].uniqueId, taskList[i].isDone);
  }
}

//Add Event Listeners
document.getElementById('todoInput').addEventListener('keypress', (event) => {
  if(event.which === 13){
    addTask();
  }
});
document.getElementById('all').addEventListener('click', showAllTasks);
document.getElementById('incompleted').addEventListener('click', showIncompletedTasks);
document.getElementById('completed').addEventListener('click', showCompletedTasks);
document.getElementById('clearCompleted').addEventListener('click', clearCompleted);
