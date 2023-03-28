import { Piece } from "../pieces/Piece.js";
import { Command } from "./Command.js";

export class CastleCommand extends Command {

    #kingPosition;
    #rookPosition;

    #kingNewPosition;
    #rookNewPosition;

    #king;
    #rook;

    constructor(kingPosition, rookPosition) {
        super();

        this.#kingPosition = kingPosition;
        this.#rookPosition = rookPosition;

        this.#kingNewPosition = null;
        this.#rookNewPosition = null;
    }


    execute(board) {

        this.#king = board.getPiece(this.#kingPosition);
        this.#rook = board.getPiece(this.#rookPosition);
    


        let pathToKing = board.canBeCastled(this.#king, this.#rook);
        if(!pathToKing) return null;
        
        
        //castling can be done
        let kingNewIndex = pathToKing.length - 2;
        let rookNewIndex = kingNewIndex + 1;

        this.#kingNewPosition = pathToKing[kingNewIndex];
        this.#rookNewPosition = pathToKing[rookNewIndex];


        board.removePiece(this.#kingPosition);
        board.removePiece(this.#rookPosition);

        board.placePiece(this.#king, this.#kingNewPosition);
        board.placePiece(this.#rook, this.#rookNewPosition);

        this.#king.moved(this.#kingPosition, this.#kingNewPosition);
        this.#king.moved(this.#rookPosition, this.#rookNewPosition);

        return true;
    }


    undo(board) {
        board.removePiece(this.#kingNewPosition);
        board.removePiece(this.#rookNewPosition);

        board.placePiece(this.#king, this.#kingPosition);
        board.placePiece(this.#rook, this.#rookPosition);
    }

    redo(board) {
        board.removePiece(this.#kingPosition);
        board.removePiece(this.#rookPosition);

        board.placePiece(this.#king, this.#kingNewPosition);
        board.placePiece(this.#rook, this.#rookNewPosition);
    }

}