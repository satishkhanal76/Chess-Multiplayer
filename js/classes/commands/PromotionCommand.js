import { Command } from "./Command.js";
import { PieceFactory } from "../pieces/PieceFactory.js";


export class PromotionCommand extends Command {

    #player;
    #board;

    #from;
    #to;

    #isValidCommand;

    //keeps track of the piece that this move captures if any
    #movingPiece;
    #takingPiece;
    #promotionPiece;

    #executed;

    constructor(player, board, from, to, promotionPiece) {
        super();

        this.#player = player;
        this.#board = board;
        this.#from = from;
        this.#to = to;

        this.#movingPiece = null;
        this.#takingPiece = null;
        this.#promotionPiece = promotionPiece;


        this.#isValidCommand = true;
        this.#executed = false;
    }

    execute() {
        this.#executed = true;

        this.#movingPiece = this.#board.getPiece(this.#from);
        this.#takingPiece = this.#board.getPiece(this.#to);

        if(!this.#movingPiece) {
            return this.#isValidCommand = false;
        };

        if(!this.#movingPiece.isValidMove(this.#player, this, this.#board)) {
            return this.#isValidCommand = false;
        };

        //remove pieces from their place
        this.#board.removePiece(this.#from);
        this.#board.removePiece(this.#to);

        //place the promotion piece to new location
        this.#board.placePiece(this.#promotionPiece, this.#to);

        this.#movingPiece.moved(this.#from, this.#to);

        return this.#isValidCommand = true;
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
        this.#board.placePiece(this.#promotionPiece, this.#to);
    }


    getFrom() {
        return this.#from;
    }

    getTo() {
        return this.#to;
    }

    getTakingPiece() {
        return this.#takingPiece;
    }

    isAValidCommand() {
        return this.#isValidCommand;
    }
}