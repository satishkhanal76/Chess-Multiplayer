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

    /**
     * Finds and returns all rooks that can be castled with the king
     */
    rooksThatCanLegallyCastle() {
        let king = this.findKing();

        //if the king has moved or is in check(no legal castles)
        if(king.hasMoved() || this.isInCheck()) return [];

        let rooks = this.findPieces(Piece.TYPE.ROOK);
        let legalRooks = [];

        for (let i = 0; i < rooks.length; i++) {
            const rook = rooks[i];
            if(rook.hasMoved()) continue;

            const pathToKing = rook.pathToKing(this.#board);
            if(!pathToKing) continue;

            let spotsUnderAttackByEnemy = this.getSpotsUnderAttackByEnemies();

            let spotUnderAttack = false;
            pathToKing.forEach(spot => {
                let onSpot = spotsUnderAttackByEnemy.filter(move => spot.col == move.col && spot.row == move.row);
                if(onSpot.length >= 1) {
                    spotUnderAttack = true;
                }
            })
            if(spotUnderAttack) continue;

            legalRooks.push(rook);
        }
        return legalRooks;
    }

    /**
     * Determines if the move passed in will put player in check
     */
    willMovePutInCheck(from, to) {
        let fromPiece = this.#board.getPiece(from);
        let toPiece = this.#board.getPiece(to);
        if(!fromPiece) return true;
        
        
        //move the piece
        this.#board.removePiece(from);
        this.#board.placePiece(fromPiece, to);
        
        
        
        let willBe = false;
        if(this.isInCheck()) {
            willBe = true;;
        }
        
        //reverse the move
        this.#board.removePiece(to);
        this.#board.placePiece(fromPiece, from);
        this.#board.placePiece(toPiece, to);
        return willBe;
    }

    getSpotsUnderAttackByEnemies() {
        const allPiecesOnTheBoard = this.#board.getAllPieces();
        const enemyPieces = Player.filterOutColouredPieces(allPiecesOnTheBoard, this.getColour());
        let spotsUnderAttackByEnemy = [];

        enemyPieces.forEach(piece => {
            spotsUnderAttackByEnemy = spotsUnderAttackByEnemy.concat(piece.getValidMoves(this.#board));
        });
        return spotsUnderAttackByEnemy;
    }

    getPiecesUnderAttackByEnemies() {
        const allPiecesOnTheBoard = this.#board.getAllPieces();
        const enemyPieces = Player.filterOutColouredPieces(allPiecesOnTheBoard, this.getColour());
        let piecesUnderAttack= [];

        enemyPieces.forEach(piece => {
            piecesUnderAttack = piecesUnderAttack.concat(piece.getAttackingPieces(this.#board));
        });
        return piecesUnderAttack;
    }

    isInCheck() {
        let piecesUnderAttackByEnemy = this.getPiecesUnderAttackByEnemies();
        return piecesUnderAttackByEnemy.includes(this.findKing());
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

    /**
     * Finds and returns the king
     * @returns 
     */
    findKing() {
        return this.findPiece(Piece.TYPE.KING);
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
     * Finds returns the first piece that matches the type
     * @param {*} pieceType 
     * @returns 
     */
    findPiece(pieceType) {
        let pieces = this.findPieces(pieceType);
        if(pieces.length >= 1) return pieces[0];
        return null;
    }

    /**
     * Finds and returns all pieces that match the type
     */
    findPieces(pieceType) {
        this.getPieces();
        return this.#pieces.filter(piece => piece.getType() === pieceType);
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