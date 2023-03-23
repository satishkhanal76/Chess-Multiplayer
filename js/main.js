import { PieceFactory } from "./classes/pieces/PieceFactory.js";
import { Board } from "./classes/Board.js";
import { Piece } from "./classes/pieces/Piece.js";

import { BoardGUI } from "./GUI/BoardGUI.js";


let board = new Board();

let boardGUI = new BoardGUI(board);

let blackPawn = PieceFactory.getPiece("pawn", Piece.COLOUR.BLACK);
let whiteKing = PieceFactory.getPiece("king", Piece.COLOUR.WHITE);
let whiteQueen = PieceFactory.getPiece("queen", Piece.COLOUR.WHITE);


board.placePiece(blackPawn, 4, 6);
board.placePiece(whiteKing, 4, 7);
board.placePiece(whiteQueen, 5, 7);

boardGUI.showBoardOnConsole();

boardGUI.updateBoard();
