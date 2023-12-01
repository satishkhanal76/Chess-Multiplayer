import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";
import { Player } from "./players/Player.js";
import GameValidator from "./validators/GameValidator.js";
import CheckmateValidator from "./validators/CheckmateValidator.js";
import StalemateValidator from "./validators/StalemateValidator.js";
import ClassicalSet from "./board-sets/ClassicalSet.js";
import ClassicalVariant from "./variants/ClassicalVariant.js";
import TwoQueenVariant from "./variants/TwoQueenVariant.js";
import FileRankFactory from "./FileRankFactory.js";

export class Game {
  #variant;

  #board;

  #players = [];
  #currentPlayer;
  #currentPlayerIndex;

  #isOver = false;

  #winner;

  #validators = [];

  constructor(variant) {
    this.#variant = variant || new ClassicalVariant();

    this.createBoard();

    this.createPlayers();
    this.changeTurn();

    this.resetGame();

    this.addValidators();

    this.#board.getMoveEventListener().addListener((event) => {
      this.changeTurn();
      this.validateGame();
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
    return (this.#board = this.#variant.getPopulatedBoard());
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
