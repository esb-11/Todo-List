import { pubSub } from "./pubSub.js";

const todoList = [];

pubSub.on("init", init);

function init() {
  pubSub.on("todoCreated", addTodo);
}

function addTodo(todo) {
  todoList.push(todo);
  pubSub.emit("todoListUpdated", todoList.slice());
}
