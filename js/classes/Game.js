import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";
import { Player } from "./players/Player.js";
import { PieceFactory } from "./pieces/PieceFactory.js";

export class Game {


    #board;

    #players = [];
    #currentTurn;
    #currentTurnIndex;


    #isOver = false;

    #winner;

    constructor() {
        
        this.createBoard();
        
        this.createPlayers();
        this.changeTurn();

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
                this.#board.placePiece(piece, {col: j, row: i});
            }

        }

    }

    getPlayer(colour) {
        return this.#players.find(player => player.getColour() === colour);
    }

    createPlayers() {
        this.#players.push(new Player(this.#board, Piece.COLOUR.WHITE));
        this.#players.push(new Player(this.#board, Piece.COLOUR.BLACK));
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

    checkForOver() {
        this.#checkForStalemate();
        this.#checkForCheckmate();
    }
    
    #checkForCheckmate() {
        let leftPlayer = this.#players.filter(player => !player.isInCheckMate());
        if(leftPlayer.length == 1) {
            this.#isOver = true;
            this.#winner = leftPlayer[0];
        }
    }

    #checkForStalemate() {
        const staleMate = this.#players.find(player => player.isInStaleMate());
        if(!staleMate) return;
        this.#isOver = true;
        this.#winner = null;
    }

    movePiece(piece, at) {
        if(this.#currentTurn.movePiece(piece, at)) {
            this.changeTurn();
        };
    }

    castle(kingPos, rookPos) {
        if(this.#currentTurn.castle(kingPos, rookPos)) {
            this.changeTurn();
        };
    }

    promotePiece(piece, at, promotionPieceType) {
        if(!piece) return;
        if(this.#currentTurn.promotePiece(piece, at, promotionPieceType)) {
            this.changeTurn();
        };
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
        this.checkForOver();
        return this.#isOver;
    }

}