import { pubSub } from "./pubSub.js";

const todoContainer = document.querySelector("#todo-container");
const todoTemplate = todoContainer.querySelector("#todo-template");

pubSub.on("init", init);

function init() {
  pubSub.on("todoListUpdated", renderTodoList);
}

function renderTodoList(todoList) {
  todoList.forEach(renderTodo);
}

function renderTodo(todo) {
  const todoElement = todoTemplate.content.cloneNode(true);
  todoElement.querySelector(".todo-title").innerText = todo.title;
  todoElement.querySelector(".todo-due-date").innerText = todo.dueDate;
  todoElement.querySelector(".todo-priority").innerText = todo.priority;
  todoElement.dataset.id = todo.id;

  todoContainer.appendChild(todoElement)
}
