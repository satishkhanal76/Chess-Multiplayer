import { Movement } from "../Movement.js";
import { Piece } from "./Piece.js";

export class Queen extends Piece {
    constructor(character, colour) {
        super(Piece.TYPE.QUEEN, character, colour);
        this.configureMoves();
    }

    configureMoves() {
        this.addMoves(Movement.getVerticalToTop);
        this.addMoves(Movement.getVerticalToBottom);
        this.addMoves(Movement.getHorizontalToLeft);
        this.addMoves(Movement.getHorizontalToRight);
        this.addMoves(Movement.getDiagnolToTopLeft);
        this.addMoves(Movement.getDiagnolToTopRight);
        this.addMoves(Movement.getDiagnolToBottomLeft);
        this.addMoves(Movement.getDiagnolToBottomRight);
    }
}