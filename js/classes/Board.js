import { Piece } from "./pieces/Piece.js";

export class Board {

    #col;
    #row;

    #grid;


    constructor() {
        this.#col = 8;
        this.#row = 8;

        this.#createBoard();
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
            let pieceAtTheSpot = this.getPiece(availableMoves[i].col, availableMoves[i].row);
            if(!pieceAtTheSpot) continue;

            if(pieceAtTheSpot.getType() === Piece.TYPE.KING) {
                return true;
            };
        };

        return false;
    }

    movePiece(from, to) {

        let fromPiece = this.#grid[from.col][from.row];
        let toPiece = this.#grid[to.col][to.row];

        if(!fromPiece) return null;
        

        if(this.isValidPosition(from, to)) {
            this.#grid[from.col][from.row] = null;
            this.#grid[to.col][to.row] = fromPiece;
            fromPiece.moved(from, to);
            return fromPiece;
        }

        return null;
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
                    validMoves = validMoves.concat(this.getValidMoves(i, j));
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

    getValidMoves(col, row) {
        let from, to;
        from = {
            col, row
        };

        let availableMoves;
        let piece = this.#grid[col][row];
        if(!piece) return [];

        availableMoves = piece.getAvailableMoves(this);

        for(let i = availableMoves.length - 1; i >= 0; i--) {
            to = {
                col: availableMoves[i].col,
                row: availableMoves[i].row
            }
            
            let pieceAtTheSpot = this.getPiece(to.col, to.row);
            if(pieceAtTheSpot && pieceAtTheSpot.getType() === Piece.TYPE.KING) {
                availableMoves.splice(i, 1);
                continue;
            };
            
            //if this move puts king at risk than its not valid
            if(this.willKingBeCheckedAfterMove(from, to)) {
                availableMoves.splice(i, 1);
            }

        };
        return availableMoves;
    }

    placePiece(piece, col, row) {
        if(this.#grid[col][row]) return;
        this.#grid[col][row] = piece;
    }

    removePiece(col, row) {
        let piece = this.#grid[col][row];
        this.#grid[col][row] = null;
        return piece;
    }

    getPiece(col, row) {
        return this.#grid[col][row];
    }

    getPiecePosition(piece) {
        for (let i = 0; i < this.#grid.length; i++) {
            for(let j = 0; j < this.#grid[i].length; j++) {
                if(this.#grid[i][j] === piece) return {col: i, row: j};
            }
        }
        return null;
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