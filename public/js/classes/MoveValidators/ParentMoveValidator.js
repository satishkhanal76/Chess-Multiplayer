export default class ParentMoveValidator {
  #board;
  constructor(board) {
    this.#board = board;
  }

  getValidMoves(piece, moves) {
    console.error("Move validator not Implemented!");
    return moves;
  }

  getBoard() {
    return this.#board;
  }
}
