import { Piece } from "../pieces/Piece.js";
import { Command } from "./Command.js";

export class CastleCommand extends Command {

    #board;
    #kingPosition;
    #rookPosition;

    #kingNewPosition;
    #rookNewPosition;

    #king;
    #rook;

    constructor(board, kingPosition, rookPosition) {
        super();

        this.#board = board;
        this.#kingPosition = kingPosition;
        this.#rookPosition = rookPosition;

        this.#kingNewPosition = null;
        this.#rookNewPosition = null;
    }


    execute() {

        this.#king = this.#board.getPiece(this.#kingPosition);
        this.#rook = this.#board.getPiece(this.#rookPosition);
    


        let pathToKing = this.#rook.pathToKing(this.#board);
        
        let kingNewIndex = pathToKing.length - 2;
        let rookNewIndex = kingNewIndex + 1;

        this.#kingNewPosition = pathToKing[kingNewIndex];
        this.#rookNewPosition = pathToKing[rookNewIndex];


        this.#board.removePiece(this.#kingPosition);
        this.#board.removePiece(this.#rookPosition);

        this.#board.placePiece(this.#king, this.#kingNewPosition);
        this.#board.placePiece(this.#rook, this.#rookNewPosition);

        this.#king.moved(this.#kingPosition, this.#kingNewPosition);
        this.#king.moved(this.#rookPosition, this.#rookNewPosition);

        return true;
    }


    undo() {
        this.#board.removePiece(this.#kingNewPosition);
        this.#board.removePiece(this.#rookNewPosition);

        this.#board.placePiece(this.#king, this.#kingPosition);
        this.#board.placePiece(this.#rook, this.#rookPosition);
    }

    redo() {
        this.#board.removePiece(this.#kingPosition);
        this.#board.removePiece(this.#rookPosition);

        this.#board.placePiece(this.#king, this.#kingNewPosition);
        this.#board.placePiece(this.#rook, this.#rookNewPosition);
    }

}