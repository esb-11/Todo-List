import "./styles/styles.css";
import { pubSub } from "./scripts/pubSub.js";
import "./scripts/todoFactory.js";
import "./scripts/todoManager.js";
import "./scripts/render.js"

pubSub.emit("init");
