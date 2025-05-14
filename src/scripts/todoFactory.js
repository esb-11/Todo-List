import { pubSub } from "./pubSub.js";

const PRIORITIES = ["low", "medium", "high"];

pubSub.on("init", init);

function init() {
  pubSub.on("createTodo", createTodo);
}

function createTodo() {
  const todo = todoFactory();
  pubSub.emit("todoCreated", todo);
}

function todoFactory() {
  const title = "Title";
  const description = "Description";
  const dueDate = new Date();

  const index = parseInt(PRIORITIES.length / 2);
  const priority = PRIORITIES[index];

  const id = crypto.randomUUID();

  return { title, description, dueDate, priority, id };
}
