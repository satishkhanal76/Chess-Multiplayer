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

        this.#commandHandler = new CommandHandler();
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

    getAllPieces() {
        let pieces = [];
        for (let i = 0; i < this.#grid.length; i++) {
            for (let j = 0; j < this.#grid[i].length; j++) {
                if(this.#grid[i][j]) pieces.push(this.#grid[i][j]);   
            }
        }
        return pieces;
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

    /**
     * Moves a piece from its location to the location passed in 
     * @param {*} piece 
     * @param {*} to 
     * @returns the piece that was replaced/taken if any
     */
    movePiece(piece, to) {
        let piecePosition = this.getPiecePosition(piece);
        let takingPiece = this.removePiece(to);

        this.removePiece(piecePosition);
        this.placePiece(piece, to);

        return takingPiece;
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