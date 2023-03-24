import { Game } from "./classes/Game.js";

import { BoardGUI } from "./GUI/BoardGUI.js";


let game = new Game();

let boardGUI = new BoardGUI(game);
boardGUI.showBoardOnConsole();

boardGUI.updateBoard();

/**
 * "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
 */