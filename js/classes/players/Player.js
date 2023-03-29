import { Piece } from "../pieces/Piece.js";

export class Player {

    #board;
    #color;
    #pieces;
    
    constructor(board, color) {
        this.#board = board;

        this.#color = color;
        this.#pieces = [];
    }

    isInCheck() {
        const allPiecesOnTheBoard = this.#board.getAllPieces();
        const enemyPieces = Player.filterOutColouredPieces(allPiecesOnTheBoard, this.getColour());
        let spotsAttackedByEnemeyPieces = [];

        enemyPieces.forEach(piece => {
            spotsAttackedByEnemeyPieces = spotsAttackedByEnemeyPieces.concat(piece.getAvailableMoves(this.#board));
        });

        const kingPosition = this.#board.getPiecePosition(this.getKing());
        const kingOnAttakedSpots = spotsAttackedByEnemeyPieces.filter(spot => spot.col == kingPosition.col && spot.row == kingPosition.row);
        if(kingOnAttakedSpots.length >= 1) return true;
        return false;
    }

    /**
     * Someone is at checkmate when there is no legal move for any pieces and the king is in check
     * @returns if the player is at checkmate
     */
    isInCheckMate() {
        let legalMoves = this.getAttackingSpots();

        if(legalMoves.length < 1 && this.isInCheck()) return true;
        return false;
    }

    /**
     * Someone is at staleMate when there is no legal move for any pieces
     * @returns if the player is at checkmate
     */
    isInStaleMate() {
        let legalMoves = this.getAttackingSpots();

        if(legalMoves.length < 1 && !this.isInCheck()) return true;
        return false;
    }

    getKing() {
        return this.getPiece(Piece.TYPE.KING);
    }

    getAttackingSpots() {
        this.getPieces(); //get all coloured the pieces from the board

        let moves = [];
        //get attaking spots for all pieces
        this.#pieces.forEach(piece => {
            moves = moves.concat(piece.getValidMoves(this.#board));
        })
        return moves;
    }

    /**
     * Finds and returns all of the pieces that do not match the colour passed in
     * @param {*} pieces 
     * @param {*} colour 
     */
    static filterOutColouredPieces(pieces, colour) {
        return pieces.filter(piece => piece.getColour() !== colour);
    }

    /**
     * Finds a piece of the type
     * @param {*} pieceType 
     * @returns 
     */
    getPiece(pieceType) {
        this.getPieces();
        return this.#pieces.find(p => p.getType() === pieceType);
    }

    /**
     * Returns all pieces that are on the board
     */
    getPieces() {
        this.#pieces = this.#board.getAllColouredPieces(this.#color);
        return this.#pieces;
    }

    getColour() {
        return this.#color;
    }

}