import { pubSub } from "./pubSub.js";

const todoContainer = document.querySelector("#todo-container");
const todoTemplate = document.querySelector("#todo-template");

const openTodoDialogButton = document.querySelector(".open-todo-dialog");
const addTodoDialog = document.querySelector("#add-todo-dialog");
const addTodoForm = addTodoDialog.querySelector("form");
const addTodoButton = addTodoDialog.querySelector(".add-todo");


pubSub.on("init", init);

function init() {
  pubSub.on("todoListUpdated", renderTodoList);

  startEventListeners();
}

function startEventListeners() {
  openTodoDialogButton.addEventListener("click", showAddTodoModal);

  addTodoButton.addEventListener("click", submitTodo);
}

function showAddTodoModal() {
  addTodoDialog.showModal();
}

function submitTodo(eventTriggered) {
  eventTriggered.preventDefault();

  const data = getTodoFormInfo();

  if (data.length === 0) return;

  pubSub.emit("todoSubmitted", ...data);
}

function getTodoFormInfo() {
  const title = addTodoForm.querySelector("#title").value;
  const description = addTodoForm.querySelector("#description").value;
  const dueDate = addTodoForm.querySelector("#due-date").value;
  const priority = addTodoForm.querySelector("#priority").value;

  return [title, description, dueDate, priority];
}

function renderTodoList(todoList) {
  todoContainer.innerHTML = "";
  todoList.forEach(renderTodo);
}

function renderTodo(todo) {
  const clone = todoTemplate.content.cloneNode(true);
  const todoElement = clone.querySelector(".todo-card");

  todoElement.dataset.id = todo.id;
  todoElement.querySelector(".todo-title").innerText = todo.title;
  todoElement.querySelector(".todo-due-date").innerText = todo.dueDate;
  todoElement.querySelector(".todo-priority").innerText = todo.priority;

  todoContainer.appendChild(todoElement);
}
