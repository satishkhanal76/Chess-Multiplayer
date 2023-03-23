import { Movement } from "../Movement.js";
import { Piece } from "./Piece.js";

export class Knight extends Piece {
    constructor(character, colour) {
        super(Piece.TYPE.KNIGHT, character, colour);
        this.configureMoves();
    }

    configureMoves() {
        if(this.getColour() === Piece.COLOUR.WHITE) {
            this.addMoves(Movement.getForwardToTop);
        }else {
            this.addMoves(Movement.getForwardToBottom);
        }
    }
}