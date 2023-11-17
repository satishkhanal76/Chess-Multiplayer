import { Game } from "./classes/Game.js";

import { BoardGUI } from "./GUI/BoardGUI.js";

const game = new Game();

const modal = document.getElementById("modal");
modal.style.display = "none";

const boardGUI = new BoardGUI(game, modal);
