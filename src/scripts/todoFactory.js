import { pubSub } from "./pubSub.js";

const PRIORITIES = ["low", "medium", "high"];

pubSub.on("init", init);

function init() {
  pubSub.on("todoSubmitted", createTodo);
}

function createTodo(inputTitle, inputDescription, inputDueDate, inputPriority, inputProject) {
  const todo = todoFactory(inputTitle, inputDescription, inputDueDate, inputPriority, inputProject);
  pubSub.emit("todoCreated", todo);
}

function todoFactory(inputTitle, inputDescription, inputDueDate, inputPriority, inputProject) {
  const title = inputTitle || "Title";
  const description = inputDescription || "Description";
  const dueDate = inputDueDate ? new Date(inputDueDate): new Date();
  const priority = PRIORITIES.includes(inputPriority) ? inputPriority : PRIORITIES[1];
  const project = inputProject || "";

  const id = crypto.randomUUID();

  return { title, description, dueDate, priority, project, id };
}
