import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";
import { Player } from "./Player.js";
import { PieceFactory } from "./pieces/PieceFactory.js";

export class Game {


    #board;

    #players = [];
    #currentTurn;
    #currentTurnIndex;


    #isOver = false;
    #winner;

    constructor() {
        this.createPlayers();
        this.changeTurn();

        this.createBoard();

        this.resetGame();
    }

    resetGame() {
        this.#isOver = false;
        this.#winner = null;
    }

    createBoard() {
        this.#board = new Board();
        this.setupBoard();
    }

    setupBoard() {
        let fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
        let lines = fenString.split("/");

        for (let i = 0; i < lines.length; i++) {
            let piece, character;
            let line = lines[i];

            if(line.length == 1) continue;

            for (let j = 0; j < line.length; j++) {
                character = line.charAt(j);
                piece = PieceFactory.getPieceFen(character);
                this.#board.placePiece(piece, j, i);
            }

        }

    }

    createPlayers() {
        this.#players.push(new Player(Piece.COLOUR.WHITE));
        this.#players.push(new Player(Piece.COLOUR.BLACK));
    }

    changeTurn() {
        if(isNaN(this.#currentTurnIndex)) {
            this.#currentTurnIndex = 0;
        } else {
            this.#currentTurnIndex += 1;
        }
        if(this.#currentTurnIndex >= this.#players.length) this.#currentTurnIndex = 0;
        this.#currentTurn = this.#players[this.#currentTurnIndex];
    }

    movePiece(fromCol, fromRow, toCol, toRow) {
        let from = {
            col: fromCol,
            row: fromRow
        }, to = {
            col: toCol,
            row: toRow
        };

        let piece = this.#board.getPiece(from.col, from.row);
        let movedPiece;
        if(piece && piece.getColour() == this.#currentTurn.getColour()) {
            movedPiece = this.#board.movePiece(from, to);
        }
        if(movedPiece) {
            this.changeTurn();
        }

        this.checkForOver();
    }

    checkForOver() {
        let moves = this.#board.getAllValidMoves(this.#currentTurn.getColour());

        if(moves.length <= 0 && this.#board.isKingBeingChecked(this.#currentTurn.getColour())) {
            this.#winner = this.getNextTurn();
            this.#isOver = true;
        }else if(moves.length <= 0) {
            this.#winner = null;
            this.#isOver = true;
        }
    }

    getCurrentTurn() {
        return this.#currentTurn;
    }

    getNextTurn() {
        let nextTurnIndex = this.#currentTurnIndex + 1;
        if(nextTurnIndex >= this.#players.length) nextTurnIndex = 0;
        return this.#players[nextTurnIndex];
    }

    getBoard() {
        return this.#board;
    }

    getWinner() {
        return this.#winner;
    }

    isOver() {
        return this.#isOver;
    }

}