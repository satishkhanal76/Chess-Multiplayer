import { Movement } from "./Movement.js";
import { Piece } from "./Piece.js";

export class Bishop extends Piece {
    constructor(character, colour) {
        super(Piece.TYPE.BISHOP, character, colour);
        this.configureMoves();
    }

    configureMoves() {
        this.addMoves(Movement.getDiagnolToTopLeft);
        this.addMoves(Movement.getDiagnolToTopRight);
        this.addMoves(Movement.getDiagnolToBottomLeft);
        this.addMoves(Movement.getDiagnolToBottomRight);
    }
}