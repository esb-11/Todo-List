import "./styles/styles.css";
import { pubSub } from "./scripts/pubSub.js";
import "./scripts/todoFactory.js";

pubSub.emit("init");
