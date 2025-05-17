import { pubSub } from "./pubSub.js";

const todoContainer = document.querySelector("#todo-container");
const projectContainer = document.querySelector("#projects-container");
const todoTemplate = document.querySelector("#todo-template");

// Add Todo Dialog variables
const openTodoDialogButton = document.querySelector(".open-todo-dialog");
const addTodoDialog = document.querySelector("#add-todo-dialog");
const addTodoForm = addTodoDialog.querySelector("form");
const addTodoButton = addTodoDialog.querySelector(".add-todo");
const closeAddTodoDialog = addTodoDialog.querySelector(".close-dialog");

// Edit Todo Dialog Variables
const editTodoDialog = document.querySelector("#edit-todo-dialog");
const editTodoForm = editTodoDialog.querySelector("form");
const editTodoButton = editTodoDialog.querySelector(".edit-todo");
const closeEditTodoDialog = editTodoDialog.querySelector(".close-dialog");

pubSub.on("init", init);

function init() {
  pubSub.on("todoListUpdated", updatePage);

  startEventListeners();
}

function startEventListeners() {
  openTodoDialogButton.addEventListener("click", (e) => { showDialog(e, addTodoDialog) });
  addTodoButton.addEventListener("click", submitTodo);
  closeAddTodoDialog.addEventListener("click", (e) => { closeDialog(e, addTodoDialog) });

  closeEditTodoDialog.addEventListener("click", (e) => { closeDialog(e, editTodoDialog) });
  editTodoButton.addEventListener("click", editTodo);
}

// Dialog Functions
function closeDialog(e, dialog) {
  e.preventDefault();
  resetTodoForm(addTodoForm);
  dialog.close();
}

function resetTodoForm(form) {
  form.querySelector("#title").value = "";
  form.querySelector("#description").value = "";
  form.querySelector("#due-date").value = "";
  form.querySelector("#priority").value = "medium";
  form.querySelector("#project").value = "";
}

function showDialog(e, dialog) {
  dialog.showModal();
}

function getTodoFormInfo(form) {
  const title = form.querySelector("#title").value;
  const description = form.querySelector("#description").value;
  const dueDate = form.querySelector("#due-date").value;
  const priority = form.querySelector("#priority").value;
  const project = form.querySelector("#project").value;

  return [title, description, dueDate, priority, project];
}

// Render Functions
function updatePage(todoList) {
  todoContainer.innerHTML = "";
  projectContainer.innerHTML = "";
  const projectList = [];
  todoList.forEach((todo) => {
    if (!projectList.includes(todo.project)) {
      projectList.push(todo.project);
    }

    renderTodo(todo);
  });

  projectList.sort();
  projectList.forEach(renderProject);
}

function renderTodo(todo) {
  const clone = todoTemplate.content.cloneNode(true);
  const todoElement = clone.querySelector(".todo-card");

  todoElement.dataset.id = todo.id;
  todoElement.querySelector(".todo-title").innerText = todo.title;
  todoElement.querySelector(".todo-due-date").innerText = todo.dueDate;
  todoElement.querySelector(".todo-priority").innerText = todo.priority;
  // todoElement.querySelector(".todo-project").innerText = todo.project;

  const editTodoButton = todoElement.querySelector(".edit-todo");
  editTodoButton.addEventListener("click", (e) => {
    editTodoDialog.dataset.currentId = todo.id;
    showDialog(e, editTodoDialog);
  });

  todoContainer.appendChild(todoElement);
}

function renderProject(project) {
  const projectElement = document.createElement("button");
  projectElement.innerText = project;
  projectElement.dataset.projectName = project;
  projectContainer.appendChild(projectElement);
}

// Todo functions

function submitTodo(eventTriggered) {
  eventTriggered.preventDefault();

  const data = getTodoFormInfo(addTodoForm);
  console.log(data);

  pubSub.emit("todoSubmitted", ...data);
  resetTodoForm(addTodoForm);
  addTodoDialog.close();
}

function editTodo() {
  const id = editTodoDialog.dataset.currentId;
  const data = getTodoFormInfo(editTodoForm);
  pubSub.emit("todoEdited", id, ...data);
  resetTodoForm(editTodoForm);
  editTodoDialog.close();
}
