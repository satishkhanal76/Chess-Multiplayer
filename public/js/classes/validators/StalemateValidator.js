import GameValidator from "./GameValidator.js";

export default class StalemateValidator extends GameValidator {
  constructor() {
    super(GameValidator.TYPES.DRAW_BY_STALEMATE);
  }

  validate(game) {
    this.setIsOver(false);

    const currentPlayer = game.getCurrentPlayer();
    const board = game.getBoard();

    const isKingInCheck = board.isKingInCheck(currentPlayer.getColour());

    if (isKingInCheck) return;

    const allValidPlayerMoves = board.getAllValidMoves(
      currentPlayer.getColour()
    );

    if (allValidPlayerMoves.length <= 0) this.setIsOver(true);
  }
}
