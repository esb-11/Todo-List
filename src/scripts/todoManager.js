import { pubSub } from "./pubSub.js";

const todoList = [];

pubSub.on("init", init);

function init() {
  pubSub.on("todoCreated", addTodo);
  pubSub.on("todoEdited", editTodo);
  pubSub.on("todoDeleted", deleteTodo);
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
      todo.dueDate = (newDueDate == "" ? todo.dueDate : new Date(newDueDate.concat("T00:00")));
      todo.priority = (newPriority == "" ? todo.priority : newPriority);
      todo.project = (newProject == "" ? todo.project : newProject);
    }
  });
  pubSub.emit("todoListUpdated", todoList.slice());
}

function deleteTodo(id) {
  todoList.forEach((todo, index) => {
    if (todo.id == id) {
      todoList.splice(index, 1);
    }
  });

  pubSub.emit("todoListUpdated", todoList.slice());
}
