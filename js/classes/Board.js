import { CommandHandler } from "./commands/CommandHandler.js";
import { Piece } from "./pieces/Piece.js";

export class Board {

    #col;
    #row;

    #grid;

    #commandHandler;


    constructor() {
        this.#col = 8;
        this.#row = 8;

        this.#createBoard();

        this.#commandHandler = new CommandHandler(this);
    }

    #createBoard() {
        this.#grid = new Array(this.#col);
        for (let i = 0; i < this.#grid.length; i++) {
            this.#grid[i] = new Array(this.#row);
            for(let j = 0; j < this.#grid[i].length; j++) {
                this.#grid[i][j] = null;
            }
        }
    }

    isCheckingTheKing(colour) {
        let colouredPieces = this.getAllColouredPieces(colour);

        let kingBeingCheked = false;

        colouredPieces.forEach(piece => {
            if(this.#isPieceCheckingTheKing(piece)) {
                kingBeingCheked = true;
            };
        });
        return kingBeingCheked;
    }

    #isPieceCheckingTheKing(piece) {
        let availableMoves = piece.getAvailableMoves(this);

        for(let i = 0; i < availableMoves.length; i++) {
            let pieceAtTheSpot = this.getPiece(availableMoves[i]);
            if(!pieceAtTheSpot) continue;

            if(pieceAtTheSpot.getType() === Piece.TYPE.KING) {
                return true;
            };
        };

        return false;
    }

    canBeCastled(king, rook) {
        if(king?.getType() !== Piece.TYPE.KING || rook?.getType() !== Piece.TYPE.ROOK) return null;

        if(king.hasMoved() || rook.hasMoved()) return null;
        if(this.isKingBeingChecked(king.getColour())) return null;

        let kingOnPath = rook.pathToKing(this);

        if(!kingOnPath) return null;
        let enemyColour = (king.getColour() === Piece.COLOUR.WHITE) ? Piece.COLOUR.BLACK: Piece.COLOUR.WHITE;

        let allValidEnemyMoves = this.getAllValidMoves(enemyColour);
        let spotUnderAttack = false;
        kingOnPath.forEach(spot => {
            let onSpot = allValidEnemyMoves.filter(move => spot.col == move.col && spot.row == move.row);
            if(onSpot.length >= 1) {
                spotUnderAttack = true;
            }
        })
        if(spotUnderAttack) return null;
        return kingOnPath;
    }

    castle(kingPos, rookPos) {
        let king = this.getPiece(kingPos);
        let rook = this.getPiece(rookPos);
        
        let kingOnPath = this.canBeCastled(king, rook);
        if(!kingOnPath) return null;
        
        
        //castling can be done
        let kingNewPos = kingOnPath.length - 2;
        let rookNewPos = kingNewPos + 1;

        this.#grid[kingPos.col][kingPos.row] = null;
        this.#grid[rookPos.col][rookPos.row] = null;

        this.#grid[kingOnPath[kingNewPos].col][kingOnPath[kingNewPos].row] = king;
        this.#grid[kingOnPath[rookNewPos].col][kingOnPath[rookNewPos].row] = rook;
        king.moved(kingPos, kingNewPos);
        rook.moved(rookPos, rookNewPos);

        return true;
    }

    willKingBeCheckedAfterMove(from, to) {
        let fromPiece = this.#grid[from.col][from.row];
        let toPiece = this.#grid[to.col][to.row];
        let willBe = false;

        if(!fromPiece) return true;
        

        //move the piece
        this.#grid[from.col][from.row] = null;
        this.#grid[to.col][to.row] = fromPiece;
        

        if(this.isKingBeingChecked(fromPiece.getColour())) {
            willBe = true;;
        }
        
        this.#grid[from.col][from.row] = fromPiece;
        this.#grid[to.col][to.row] = toPiece;
        return willBe;
    }
    

    isValidPosition(from, to) {
        let isAvalidPosition = false;

        let availableMoves = this.getValidMoves(from.col, from.row);
        for (let i = 0; i < availableMoves.length; i++) {
            let move = availableMoves[i];
            if(move.col === to.col && move.row === to.row) isAvalidPosition = true;
        }
        return isAvalidPosition;
    }

    isKingBeingChecked(colour) {
        let checksTheKing = false;
        if(colour === Piece.COLOUR.WHITE) {
            checksTheKing = this.isCheckingTheKing(Piece.COLOUR.BLACK);
        }else {
            checksTheKing = this.isCheckingTheKing(Piece.COLOUR.WHITE);
        }

        return checksTheKing;
    }

    getAllValidMoves(colour) {
        let piece, validMoves = [];
        for (let i = 0; i < this.#grid.length; i++) {
            for (let j = 0; j < this.#grid[i].length; j++) {
                piece = this.#grid[i][j];

                if(!piece) continue;

                if(piece.getColour() === colour) {
                    validMoves = validMoves.concat(piece.getValidMoves(this));
                }
            }
        }
        return validMoves;
    }


    getAllColouredPieces(colour) {
        let colouredPieces = [];
        for (let i = 0; i < this.#grid.length; i++) {
            for (let j = 0; j < this.#grid[i].length; j++) {
                if(!this.#grid[i][j]) continue;

                if(this.#grid[i][j].getColour() === colour) {
                    colouredPieces.push(this.#grid[i][j]);
                }
            }
        }
        return colouredPieces;
    }

    placePiece(piece, at) {
        if(this.#grid[at.col][at.row]) return;
        this.#grid[at.col][at.row] = piece;
    }

    removePiece(from) {
        let piece = this.#grid[from.col][from.row];
        this.#grid[from.col][from.row] = null;
        return piece;
    }

    getPiece(at) {
        return this.#grid[at.col][at.row];
    }

    getPiecePosition(piece) {
        for (let i = 0; i < this.#grid.length; i++) {
            for(let j = 0; j < this.#grid[i].length; j++) {
                if(this.#grid[i][j] === piece) return {col: i, row: j};
            }
        }
        return null;
    }

    getCommandHandler() {
        return this.#commandHandler;
    }

    getGrid() {
        return this.#grid;
    }


    getColumn() {
        return this.#col;
    }

    getRow() {
        return this.#row;
    }
}