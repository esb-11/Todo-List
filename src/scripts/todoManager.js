import { pubSub } from "./pubSub.js";

const todoList = [];

pubSub.on("init", init);

function init() {
  pubSub.on("todoCreated", addTodo);
  pubSub.on("todoEdited", editTodo);
}

function addTodo(todo) {
  todoList.push(todo);
  pubSub.emit("todoListUpdated", todoList.slice());
}

function editTodo(id, newTitle, newDescription, newDueDate, newPriority, newProject) {
  todoList.forEach((todo) => {
    if (id === todo.id) {
      todo.title = (newTitle == "" ? todo.title : newTitle);
      todo.description = (newDescription == "" ? todo.description : newDescription);
      todo.dueDate = (newDueDate == "" ? todo.dueDate : newDueDate);
      todo.priority = (newPriority == "" ? todo.priority : newPriority);
      todo.project = (newProject == "" ? todo.project : newProject);
    }
  });
  pubSub.emit("todoListUpdated", todoList.slice());
}
