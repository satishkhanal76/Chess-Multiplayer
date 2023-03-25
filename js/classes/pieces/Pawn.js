import { Movement } from "../Movement.js";
import { Piece } from "./Piece.js";

export class Pawn extends Piece {
    #moved;
    constructor(character, colour) {
        super(Piece.TYPE.PAWN, character, colour);
        this.#moved = false;

        this.configureMoves();
    }

    configureMoves() {
        if(this.getColour() === Piece.COLOUR.WHITE) {
            this.addMoves(Movement.getForwardToTop);
        }else {
            this.addMoves(Movement.getForwardToBottom);
        }
    }

    getAvailableMoves(board) {
        let availableMoves = super.getAvailableMoves(board);

        //if there is an opponent's piece at front then it's an invalid position
        availableMoves = this.validateTheMove(board, availableMoves);

        //if there is an opponent's piece on the diagonal then its a valid move
        let piecePosition = board.getPiecePosition(this);
        let moves = [];

        //if not moved allow 2 positions
        if(!this.#moved) {
            
        }


        if(this.getColour() === Piece.COLOUR.WHITE) {
            moves = moves.concat(Movement.getOneDiagnolToTopLeft(board, piecePosition.col, piecePosition.row));
            moves = moves.concat(Movement.getOneDiagnolToTopRight(board, piecePosition.col, piecePosition.row));
        }else {
            moves = moves.concat(Movement.getOneDiagnolToBottomLeft(board, piecePosition.col, piecePosition.row));
            moves = moves.concat(Movement.getOneDiagnolToBottomRight(board, piecePosition.col, piecePosition.row));
        }
        
        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];
            if(!move) continue;
            
            let piece = board.getPiece(move.col, move.row);
            if(piece && (piece.getColour() != this.getColour())) {
                availableMoves.push(move);
            }
        }

        return availableMoves;

    }

    /**
     * This method is called whenever a piece is moved
     */
    moved(board) {
        this.#moved = true;
    }

    validateTheMove(board, availableMoves) {
        for (let i = 0; i < availableMoves.length; i++) {
            let move = availableMoves[i];
            let piece = board.getPiece(move.col, move.row);
            if(piece && (piece.getColour() != this.getColour())) {
                availableMoves.splice(i, 1);
            }
        }
        return availableMoves;
    }
}