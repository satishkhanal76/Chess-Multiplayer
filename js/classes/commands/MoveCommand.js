import { Command } from "./Command.js";

export class MoveCommand extends Command {

    #from;
    #to;

    //keeps track of the piece that this move captures if any
    #movingPiece;
    #takingPiece;

    constructor(from, to) {
        super();

        this.#from = from;
        this.#to = to;

        this.#movingPiece = null;
        this.#takingPiece = null;

    }

    execute(board) {
        this.#movingPiece = board.getPiece(this.#from);
        this.#takingPiece = board.getPiece(this.#to);

        if(!this.#movingPiece) return false;

        if(!this.#movingPiece.isValidMove(this, board)) return false;

        //remove pieces from their place
        board.removePiece(this.#from);
        board.removePiece(this.#to);

        //place the moving piece to new location
        board.placePiece(this.#movingPiece, this.#to);

        this.#movingPiece.moved(this.#from, this.#to);
        return true;
    }


    undo(board) {

        board.removePiece(this.#to);
        board.removePiece(this.#from);

        board.placePiece(this.#takingPiece, this.#to);
        board.placePiece(this.#movingPiece, this.#from);

    }

    redo(board) {
        //remove pieces from their place
        board.removePiece(this.#from);
        board.removePiece(this.#to);

        //place the moving piece to new location
        board.placePiece(this.#movingPiece, this.#to);
    }


    getFrom() {
        return this.#from;
    }

    getTo() {
        return this.#to;
    }
}