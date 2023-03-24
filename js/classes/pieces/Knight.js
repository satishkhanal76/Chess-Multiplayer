import { Movement } from "../Movement.js";
import { Piece } from "./Piece.js";

export class Knight extends Piece {
    constructor(character, colour) {
        super(Piece.TYPE.KNIGHT, character, colour);
        this.configureMoves();
    }

    configureMoves() {
        this.addMoves(Movement.getKnightMovement);
    }
}