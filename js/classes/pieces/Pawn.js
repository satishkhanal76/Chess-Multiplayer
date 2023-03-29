import { Movement } from "../Movement.js";
import { Piece } from "./Piece.js";

export class Pawn extends Piece {
    constructor(character, colour) {
        super(Piece.TYPE.PAWN, character, colour);

        this.configureMoves();
    }

    configureMoves() {
        if(this.getColour() === Piece.COLOUR.WHITE) {
            this.addMoves(Movement.getTwoForwardToTop);
        }else {
            this.addMoves(Movement.getTwoForwardToBottom);
        }
    }

    getAvailableMoves(board) {
        let dimension = {
            col: board.getColumn(),
            row: board.getRow()
        };

        //if not moved allow 2 positions
        if(this.hasMoved()) {
            this.clearMoves();
            if(this.getColour() === Piece.COLOUR.WHITE) {
                this.addMoves(Movement.getForwardToTop);
            }else {
                this.addMoves(Movement.getForwardToBottom);
            }
        }

        let availableMoves = super.getAvailableMoves(board);

        //if there is an opponent's piece at front then it's an invalid position
        availableMoves = this.validateTheMove(board, availableMoves);

        //if there is an opponent's piece on the diagonal then its a valid move
        let piecePosition = board.getPiecePosition(this);
        let moves = [];

        

        if(this.getColour() === Piece.COLOUR.WHITE) {
            moves = moves.concat(Movement.getOneDiagnolToTopLeft(dimension, {...piecePosition}));
            moves = moves.concat(Movement.getOneDiagnolToTopRight(dimension, {...piecePosition}));
        }else {
            moves = moves.concat(Movement.getOneDiagnolToBottomLeft(dimension, {...piecePosition}));
            moves = moves.concat(Movement.getOneDiagnolToBottomRight(dimension, {...piecePosition}));
        }
        
        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];
            if(!move) continue;
            
            let piece = board.getPiece(move);
            if(piece && (piece.getColour() != this.getColour())) {
                availableMoves.push(move);
            }
        }

        return availableMoves;
    }

    validateTheMove(board, availableMoves) {
        for (let i = 0; i < availableMoves.length; i++) {
            let move = availableMoves[i];
            let piece = board.getPiece(move);
            if(piece && (piece.getColour() != this.getColour())) {
                availableMoves.splice(i, 1);
            }
        }
        return availableMoves;
    }
}