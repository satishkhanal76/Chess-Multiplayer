import { Command } from "./Command.js";

export class MoveCommand extends Command {

    #board;

    #from;
    #to;

    //keeps track of the piece that this move captures if any
    #movingPiece;
    #takingPiece;

    constructor(board, from, to) {
        super();

        this.#board = board;
        this.#from = from;
        this.#to = to;

        this.#movingPiece = null;
        this.#takingPiece = null;

    }

    execute() {
        this.#movingPiece = this.#board.getPiece(this.#from);
        this.#takingPiece = this.#board.getPiece(this.#to);

        if(!this.#movingPiece) return false;

        if(!this.#movingPiece.isValidMove(this, this.#board)) return false;

        //remove pieces from their place
        this.#board.removePiece(this.#from);
        this.#board.removePiece(this.#to);

        //place the moving piece to new location
        this.#board.placePiece(this.#movingPiece, this.#to);

        this.#movingPiece.moved(this.#from, this.#to);
        return true;
    }


    undo() {
        this.#board.removePiece(this.#to);
        this.#board.removePiece(this.#from);

        this.#board.placePiece(this.#takingPiece, this.#to);
        this.#board.placePiece(this.#movingPiece, this.#from);

    }

    redo() {
        //remove pieces from their place
        this.#board.removePiece(this.#from);
        this.#board.removePiece(this.#to);

        //place the moving piece to new location
        this.#board.placePiece(this.#movingPiece, this.#to);
    }


    getFrom() {
        return this.#from;
    }

    getTo() {
        return this.#to;
    }
}