export class Command {
  static TYPES = {
    MOVE_COMMAND: "MOVE_COMMAND",
    CASTLE_COMMAND: "CASTLE_COMMAND",
    EN_PASSANT_COMMAND: "EN_PASSANT_COMMAND",
    PROMOTION_COMMAND: "PROMOTION_COMMAND",
  };

  #executed;
  #type;

  constructor(type) {
    this.#type = type;
    this.#executed = false;
  }

  execute() {
    console.error("Not Implemented!");
  }

  undo(board) {
    console.error("Not Implemented!");
  }

  getType() {
    return this.#type;
  }

  emit() {
    console.error("Not Implemented");
  }

  isExecuted() {
    return this.#executed;
  }

  setExecuted(executed) {
    this.#executed = executed;
  }
}
