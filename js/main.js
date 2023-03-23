import { PieceFactory } from "./classes/pieces/PieceFactory.js";
import { Board } from "./classes/Board.js";
import { Piece } from "./classes/pieces/Piece.js";


let board = new Board();

let blackPawn = PieceFactory.getPiece("pawn", Piece.COLOUR.BLACK);
let blackPawn2 = PieceFactory.getPiece("pawn", Piece.COLOUR.BLACK);
let whiteKing = PieceFactory.getPiece("king", Piece.COLOUR.WHITE);
// board.placePiece(blackRook, 4, 0);


board.placePiece(blackPawn, 4, 6);
// board.placePiece(blackPawn2, 4, 5);
board.placePiece(whiteKing, 4, 7);

console.log(board.isCheckingTheKing(Piece.COLOUR.BLACK))

console.log(board.getPiece(4, 6));
console.log(board.getValidMoves(4, 6));


board.printGrid();
