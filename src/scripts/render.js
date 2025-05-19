import { pubSub } from "./pubSub.js";

const todoContainer = document.querySelector("#todo-container");
const projectContainer = document.querySelector("#projects-container");
const todoTemplate = document.querySelector("#todo-template");
const projectTitle = document.querySelector("#current-project");
const allButton = document.querySelector(".show-all-button");
const thisWeekButton = document.querySelector(".show-this-week-button");

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
let currentProject = "";
let showThisWeekOnly = false;

pubSub.on("init", init);

function init() {
  pubSub.on("todoListUpdated", updatePage);

  startEventListeners();
}

function startEventListeners() {
  openTodoDialogButton.addEventListener("click", (e) => {
    showDialog(e, addTodoDialog);
  });
  addTodoButton.addEventListener("click", emitSubmitEvent);
  closeAddTodoDialog.addEventListener("click", (e) => {
    closeDialog(e, addTodoDialog);
  });

  closeEditTodoDialog.addEventListener("click", (e) => {
    closeDialog(e, editTodoDialog);
  });
  editTodoButton.addEventListener("click", emitEditEvent);

  allButton.addEventListener("click", (e) => {
    projectTitle.innerText = "All";
    currentProject = "";
    pubSub.emit("projectChanged", "");
  });
  thisWeekButton.addEventListener("click", (e) => {
    projectTitle.innerText = "This Week";
    showThisWeekOnly = !showThisWeekOnly;
    pubSub.emit("projectChanged", "");
  });
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
  if (todo.project != currentProject && currentProject != "") {
    return;
  }

  if (showThisWeekOnly && !isTodoDueThisWeek(todo)) {
    return;
  }

  const clone = todoTemplate.content.cloneNode(true);
  const todoElement = clone.querySelector(".todo-card");

  todoElement.dataset.id = todo.id;
  todoElement.querySelector(".todo-title").innerText = todo.title;
  todoElement.querySelector(".todo-due-date").innerText = createTodoDate(
    todo.dueDate
  );
  // todoElement.querySelector(".todo-priority").innerText = todo.priority;
  // todoElement.querySelector(".todo-project").innerText = todo.project;

  const editTodoButton = todoElement.querySelector(".edit-todo");
  editTodoButton.addEventListener("click", (e) => {
    editTodoDialog.dataset.currentId = todo.id;
    showDialog(e, editTodoDialog);
  });

  const deleteTodoButton = todoElement.querySelector(".delete-todo");
  deleteTodoButton.addEventListener("click", (e) => {
    emitDeleteEvent(todo.id);
  });

  todoContainer.appendChild(todoElement);
}

function createTodoDate(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("pt-BR", options);
}

function renderProject(project) {
  if (project == "") {
    return;
  }
  const projectElement = document.createElement("button");
  projectElement.innerText = project;
  projectElement.dataset.projectName = project;

  projectElement.addEventListener("click", (e) => {
    changeProject(project);
  });

  projectContainer.appendChild(projectElement);
}

function changeProject(project) {
  projectTitle.innerText = project;
  currentProject = project;
  pubSub.emit("projectChanged", project);
}

// Todo functions
function emitSubmitEvent(eventTriggered) {
  eventTriggered.preventDefault();

  const data = getTodoFormInfo(addTodoForm);
  console.log(data);

  pubSub.emit("todoSubmitted", ...data);
  resetTodoForm(addTodoForm);
  addTodoDialog.close();
}

function emitEditEvent(eventTriggered) {
  eventTriggered.preventDefault();
  const id = editTodoDialog.dataset.currentId;
  const data = getTodoFormInfo(editTodoForm);
  pubSub.emit("todoEdited", id, ...data);
  resetTodoForm(editTodoForm);
  editTodoDialog.close();
}

function emitDeleteEvent(id) {
  pubSub.emit("todoDeleted", id);
}

function isTodoDueThisWeek(todo) {
  const lastDay = new Date();
  lastDay.setDate(lastDay.getDate() + 6);
  const limit = lastDay.valueOf();

  if (todo.dueDate.valueOf() < limit) {
    return true;
  }

  return false;
}
