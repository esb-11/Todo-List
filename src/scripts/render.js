import { pubSub } from "./pubSub.js";

const todoContainer = document.querySelector("#todo-container");
const todoTemplate = document.querySelector("#todo-template");

pubSub.on("init", init);

function init() {
  pubSub.on("todoListUpdated", renderTodoList);
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

  todoContainer.appendChild(todoElement)
}
