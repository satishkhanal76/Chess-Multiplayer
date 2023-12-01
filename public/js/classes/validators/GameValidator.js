export default class GameValidator {
  static TYPES = {
    CHECKMATE: "WIN_BY_CHECKMATE",
    DRAW_BY_STALEMATE: "DRAW_BY_STALEMATE",
    DRAW_BY_DEADPOSITION: "DRAW_BY_DEADPOSITION",
  };

  #isOver;

  #type;

  constructor(type) {
    this.#type = type;
  }

  validate(game) {
    throw new Error("Not Implemented");
  }

  getType() {
    return this.#type;
  }

  setIsOver(isOver) {
    this.#isOver = isOver;
  }

  getIsOver() {
    return this.#isOver;
  }
}
