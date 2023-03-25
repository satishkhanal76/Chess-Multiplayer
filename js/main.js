import { Game } from "./classes/Game.js";

import { BoardGUI } from "./GUI/BoardGUI.js";


let game = new Game();

let modal = document.getElementById("modal");
modal.style.display = "none";

let boardGUI = new BoardGUI(game, modal);
