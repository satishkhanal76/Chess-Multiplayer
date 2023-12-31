import { Command } from "./Command.js";

export class PromotionCommand extends Command {
  #board;

  #from;
  #to;

  #isValidCommand;

  //keeps track of the piece that this move captures if any
  #movingPiece;
  #takingPiece;
  #promotionPiece;

  constructor(board, from, to, promotionPiece) {
    super(Command.TYPES.PROMOTION_COMMAND);

    this.#board = board;
    this.#from = from;
    this.#to = to;

    this.#movingPiece = null;
    this.#takingPiece = null;
    this.#promotionPiece = promotionPiece;

    this.#isValidCommand = true;
  }

  execute() {
    this.setExecuted(true);

    this.#movingPiece = this.#board.getPiece(this.#from);
    this.#takingPiece = this.#board.getPiece(this.#to);

    if (!this.#movingPiece) {
      return (this.#isValidCommand = false);
    }

    if (!this.#board.isValidMove(this.#from, this.#to)) {
      return (this.#isValidCommand = false);
    }

    //remove pieces from their place
    this.#board.removePiece(this.#from);
    this.#board.removePiece(this.#to);

    //place the promotion piece to new location
    this.#board.placePiece(this.#promotionPiece, this.#to);

    this.#movingPiece.moved(this.#from, this.#to);

    this.emit();

    return (this.#isValidCommand = true);
  }

  undo() {
    this.#board.removePiece(this.#to);
    this.#board.removePiece(this.#from);

    this.#board.placePiece(this.#takingPiece, this.#to);
    this.#board.placePiece(this.#movingPiece, this.#from);
  }

  redo() {
    //remove pieces from their place
    this.#board.removePiece(this.#from);
    this.#board.removePiece(this.#to);

    //place the moving piece to new location
    this.#board.placePiece(this.#promotionPiece, this.#to);
  }

  emit() {
    this.#board.getMoveEventListener().emit({
      command: this,
    });
  }

  getFrom() {
    return this.#from;
  }

  getTo() {
    return this.#to;
  }

  getTakingPiece() {
    return this.#takingPiece;
  }

  getMovingPiece() {
    return this.#movingPiece;
  }

  getPromotionPiece() {
    return this.#promotionPiece;
  }

  isAValidCommand() {
    return this.#isValidCommand;
  }
}
