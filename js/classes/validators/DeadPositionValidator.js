import GameValidator from "./GameValidator.js";

export default class DeadPositionValidator extends GameValidator {
  constructor() {
    super(GameValidator.TYPES.DRAW_BY_STALEMATE);
  }

  validate(game) {
    const players = game.getPlayers();
  }
}
