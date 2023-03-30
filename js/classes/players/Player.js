import { CastleCommand } from "../commands/CastleCommand.js";
import { MoveCommand } from "../commands/MoveCommand.js";
import { PromotionCommand } from "../commands/PromotionCommand.js";
import { Piece } from "../pieces/Piece.js";
import { PieceFactory } from "../pieces/PieceFactory.js";

export class Player {

    #board;


    #color;
    #pieces;

    #takenPieces;
    
    constructor(board, color) {
        this.#board = board;

        this.#color = color;
        this.#pieces = [];
        this.#takenPieces = [];
    }

    getValidMoves(piece) {
        if(piece.getColour() !== this.getColour()) return [];

        return piece.getValidMoves(this, this.#board);
    }

    /**
     * Moves the piece on the board
     */
    movePiece(piece, at) {
        //if not our piece then return
        if(piece.getColour() !== this.getColour()) return false;

        let from = this.#board.getPiecePosition(piece);

        const command = new MoveCommand(this, this.#board, from, at);

        this.#board.getCommandHandler().addCommand(command);
        this.#board.getCommandHandler().executeNextCommand();

        let takenPiece;
        takenPiece = command.getTakingPiece()
        if(command.isAValidCommand() && takenPiece) {
            this.#takenPieces.push(takenPiece);
        }

        return command.isAValidCommand();
    }

    promotePiece(piece, to, pieceType) {
        //if not our piece then return
        if(piece.getColour() !== this.getColour()) return false;
        let from = this.#board.getPiecePosition(piece);

        if(to.row != piece.getPromotionRow()) return false;

        let promotionPiece = PieceFactory.getPiece(pieceType, this.getColour());
        const command = new PromotionCommand(this, this.#board, from, to, promotionPiece);


        this.#board.getCommandHandler().addCommand(command);
        this.#board.getCommandHandler().executeNextCommand();

        let takenPiece;
        takenPiece = command.getTakingPiece();
        if(command.isAValidCommand() && takenPiece) {
            this.#takenPieces.push(takenPiece);
        }

        return command.isAValidCommand();

    }

    castle(kingPos, rookPos) {
        let rook = this.#board.getPiece(rookPos);
        if(!rook) return false;

        let legalRooksThatCanCastle = this.rooksThatCanLegallyCastle();

        let canCastle = legalRooksThatCanCastle.find(r => r === rook);

        if(!canCastle) return false;

        let command = new CastleCommand(this.#board, kingPos, rookPos);
        
        this.#board.getCommandHandler().addCommand(command);
        this.#board.getCommandHandler().executeNextCommand();

        return true;
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
        this.#board.movePiece(fromPiece, to);
        
        
        
        let willBe = false;
        if(this.isInCheck()) {
            willBe = true;;
        }
        
        //reverse the move
        this.#board.movePiece(fromPiece, from);
        this.#board.placePiece(toPiece, to);
        return willBe;
    }

    getSpotsUnderAttackByEnemies() {
        const allPiecesOnTheBoard = this.#board.getAllPieces();
        const enemyPieces = Player.filterOutColouredPieces(allPiecesOnTheBoard, this.getColour());
        let spotsUnderAttackByEnemy = [];

        enemyPieces.forEach(piece => {
            spotsUnderAttackByEnemy = spotsUnderAttackByEnemy.concat(piece.getValidMoves(this, this.#board));
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
        this.getPieces(); //get all coloured pieces from the board

        let moves = [];
        //get attaking spots for all pieces
        this.#pieces.forEach(piece => {
            moves = moves.concat(piece.getValidMoves(this, this.#board));
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