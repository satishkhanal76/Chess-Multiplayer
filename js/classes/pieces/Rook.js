import { Movement } from "../Movement.js";
import { Piece } from "./Piece.js";

export class Rook extends Piece {
    constructor(character, colour) {
        super(Piece.TYPE.ROOK, character, colour);
        this.configureMoves();
    }

    configureMoves() {
        super.addMoves(Movement.getVerticalToTop);
        super.addMoves(Movement.getVerticalToBottom);
        super.addMoves(Movement.getHorizontalToLeft);
        super.addMoves(Movement.getHorizontalToRight);
    }
}