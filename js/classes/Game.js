import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";
import { Player } from "./players/Player.js";
import { PieceFactory } from "./pieces/PieceFactory.js";
import GameValidator from "./validators/GameValidator.js";
import CheckmateValidator from "./validators/CheckmateValidator.js";
import StalemateValidator from "./validators/StalemateValidator.js";
import FileRankFactory from "./FileRankFactory.js";

export class Game {
  #board;

  #players = [];
  #currentPlayer;
  #currentPlayerIndex;

  #isOver = false;

  #winner;

  #validators = [];

  constructor() {
    this.createBoard();

    this.createPlayers();
    this.changeTurn();

    this.resetGame();

    this.addValidators();

    this.#board.getMoveEventListener().addListener((event) => {
      this.changeTurn();
      this.validateGame();

      const command = event.command;

      try {
        console.log(
          command.getFrom().toString(),
          "->",
          command.getTo().toString()
        );
      } catch (err) {}
    });
  }

  addValidators() {
    this.#validators.push(new CheckmateValidator());
    this.#validators.push(new StalemateValidator());
  }

  validateGame() {
    for (let i = 0; i < this.#validators.length; i++) {
      const validator = this.#validators[i];
      validator.validate(this);

      const isGameOver = validator.getIsOver();
      if (!isGameOver) continue;

      this.#isOver = true;
      const type = validator.getType();

      if (type === GameValidator.TYPES.CHECKMATE) {
        this.#winner = this.getPreviousPlayer();
      }
    }
  }

  resetGame() {
    this.#isOver = false;
    this.#winner = null;
  }

  createBoard() {
    this.#board = new Board(
      FileRankFactory.NUM_OF_COLUMNS,
      FileRankFactory.NUM_OF_ROWS
    );
    this.setupBoard();
  }

  setupBoard() {
    let fenString = "rnbqkbnr/pPpppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    let lines = fenString.split("/");

    for (let i = 0; i < lines.length; i++) {
      let piece, character;
      let line = lines[i];

      if (line.length == 1) continue;

      for (let j = 0; j < line.length; j++) {
        character = line.charAt(j);
        piece = PieceFactory.getPieceFen(character);
        this.#board.placePiece(piece, FileRankFactory.getFileRank(j, i));
      }
    }
  }

  getPlayer(colour) {
    return this.#players.find((player) => player.getColour() === colour);
  }

  getPlayers() {
    return this.#players;
  }

  createPlayers() {
    this.#players.push(new Player(this.#board, Piece.COLOUR.WHITE));
    this.#players.push(new Player(this.#board, Piece.COLOUR.BLACK));
  }

  changeTurn() {
    if (isNaN(this.#currentPlayerIndex)) {
      this.#currentPlayerIndex = 0;
    } else {
      this.#currentPlayerIndex += 1;
    }
    if (this.#currentPlayerIndex >= this.#players.length)
      this.#currentPlayerIndex = 0;
    this.#currentPlayer = this.#players[this.#currentPlayerIndex];
  }

  checkForOver() {
    this.#checkForStalemate();
  }

  #checkForStalemate() {
    const staleMate = this.#players.find((player) => player.isInStaleMate());
    if (!staleMate) return;
    this.#isOver = true;
    this.#winner = null;
  }

  getCurrentPlayer() {
    return this.#currentPlayer;
  }

  getNextPlayer() {
    let nextTurnIndex = this.#currentPlayerIndex + 1;
    if (nextTurnIndex >= this.#players.length) nextTurnIndex = 0;
    return this.#players[nextTurnIndex];
  }

  getPreviousPlayer() {
    let previousTurnIndex = this.#currentPlayerIndex - 1;
    if (previousTurnIndex < 0) previousTurnIndex = 0;
    return this.#players[previousTurnIndex];
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
