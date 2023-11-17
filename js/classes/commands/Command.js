export class Command {
  static TYPES = {
    MOVE_COMMAND: "MOVE_COMMAND",
    CASTLE_COMMAND: "CASTLE_COMMAND",
  };

  #type;

  constructor(type) {
    this.#type = type;
  }

  execute(board) {
    console.error("Not Implemented!");
  }

  undo(board) {
    console.error("Not Implemented!");
  }

  getType() {
    return this.#type;
  }
}
