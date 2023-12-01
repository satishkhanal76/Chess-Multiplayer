import { Piece } from "../pieces/Piece.js";
import DefaultMoveValidator from "./DefaultMoveValidator.js";
import EnPassantValidator from "./EnPassantValidator.js";

export default class MoveValidator {
  #board;
  #validators;
  constructor(board) {
    this.#board = board;

    this.#validators = [];

    this.addAllValidators();
  }

  addAllValidators() {
    this.addValidator(new DefaultMoveValidator(this.#board)); //basic movements of all pieces
    this.addValidator(new EnPassantValidator(this.#board)); // adds en passant to the game
  }

  addValidator(validator) {
    this.#validators.push(validator);
  }

  /**
   * Gets the valid moves for a piece
   * @param {Piece} piece the piece to get valid moves for
   * @returns the moves validate from this object
   *
   */
  getValidMoves(piece) {
    let moves = [];
    this.#validators.forEach((validator) => {
      moves = validator.getValidMoves(piece, moves);
    });
    return moves;
  }

  getBoard() {
    return this.#board;
  }
}
