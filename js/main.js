import { PieceFactory } from "./classes/pieces/PieceFactory.js";
import { Board } from "./classes/Board.js";
import { Piece } from "./classes/pieces/Piece.js";

import { BoardGUI } from "./GUI/BoardGUI.js";


let board = new Board();

let boardGUI = new BoardGUI(board);



let fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

let lines = fenString.split("/");

console.log(lines);

for (let i = 0; i < lines.length; i++) {
    let piece, character;
    let line = lines[i];

    if(line.length == 1) continue;

    for (let j = 0; j < line.length; j++) {
        character = line.charAt(j);
        piece = PieceFactory.getPieceFen(character);
        board.placePiece(piece, j, i);
        
    }

}


boardGUI.showBoardOnConsole();

boardGUI.updateBoard();

/**
 * "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
 */