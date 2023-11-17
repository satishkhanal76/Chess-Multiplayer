import GameValidator from "./GameValidator.js";

export default class CheckmateValidator extends GameValidator {
  constructor() {
    super(GameValidator.TYPES.CHECKMATE);
  }

  validate(game) {
    this.setIsOver(false);

    const players = game.getPlayers();
    const board = game.getBoard();

    // probably a good idea to implement board.isInCheckmate() logic here rather than calling it
    let leftPlayer = players.filter(
      (player) => !board.isInCheckmate(player.getColour())
    );
    if (leftPlayer.length <= 1) this.setIsOver(true);
  }
}
