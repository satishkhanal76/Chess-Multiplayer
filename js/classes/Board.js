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
        let availableMoves;
        let piece = this.#grid[col][row];
        if(!piece) return [];

        availableMoves = piece.getAvailableMoves(this);

        for(let i = 0; i < availableMoves.length; i++) {
            let pieceAtTheSpot = this.getPiece(availableMoves[i].col, availableMoves[i].row);
            if(!pieceAtTheSpot) continue;

            if(pieceAtTheSpot.getType() === Piece.TYPE.KING) {
                availableMoves.splice(i, 0);
            };
        };

        return availableMoves;
    }

    placePiece(piece, col, row) {
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

    printGrid() {
        console.table(this.#grid);
    }

    getColumn() {
        return this.#col;
    }

    getRow() {
        return this.#row;
    }
}