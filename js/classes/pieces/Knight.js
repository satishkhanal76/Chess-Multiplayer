import { Movement } from "./Movement.js";
import { Piece } from "./Piece.js";

export class Knight extends Piece {
    constructor(piece, colour) {
        super(piece.type, piece.character, colour);
        this.configureMoves();
    }

    configureMoves() {
        this.addMoves(Movement.getKnightMovement);
    }
}