import { pubSub } from "./pubSub.js";

const todoContainer = document.querySelector("#todo-container");
const projectContainer = document.querySelector("#projects-container");
const todoTemplate = document.querySelector("#todo-template");

// Add Todo Dialog variables
const openTodoDialogButton = document.querySelector(".open-todo-dialog");
const addTodoDialog = document.querySelector("#add-todo-dialog");
const addTodoForm = addTodoDialog.querySelector("form");
const addTodoButton = addTodoDialog.querySelector(".add-todo");
const closeAddTodoDialog = addTodoDialog.querySelector(".close-todo-dialog");

pubSub.on("init", init);

function init() {
  pubSub.on("todoListUpdated", updatePage);

  startEventListeners();
}

function startEventListeners() {
  openTodoDialogButton.addEventListener("click", showAddTodoModal);

  addTodoButton.addEventListener("click", submitTodo);

  closeAddTodoDialog.addEventListener("click", closeDialog);
}

// Add Todo Dialog functions
function closeDialog(e) {
  e.preventDefault();
  resetTodoDialog();
  addTodoDialog.close();
}

function showAddTodoModal() {
  addTodoDialog.showModal();
}

function submitTodo(eventTriggered) {
  eventTriggered.preventDefault();

  const data = getTodoFormInfo();
  console.log(data);

  pubSub.emit("todoSubmitted", ...data);
  resetTodoDialog();
  addTodoDialog.close();
}

function getTodoFormInfo() {
  const title = addTodoForm.querySelector("#title").value;
  const description = addTodoForm.querySelector("#description").value;
  const dueDate = addTodoForm.querySelector("#due-date").value;
  const priority = addTodoForm.querySelector("#priority").value;
  const project = addTodoForm.querySelector("#project").value;

  return [title, description, dueDate, priority, project];
}

function resetTodoDialog() {
  addTodoForm.querySelector("#title").value = "";
  addTodoForm.querySelector("#description").value = "";
  addTodoForm.querySelector("#due-date").value = "";
  addTodoForm.querySelector("#priority").value = "medium";
  addTodoForm.querySelector("#project").value = "";
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

  todoContainer.appendChild(todoElement);
}

function renderProject(project) {
  const projectElement = document.createElement("div");
  projectElement.innerText = project;
  projectContainer.appendChild(projectElement);
}
