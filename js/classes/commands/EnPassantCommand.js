import FileRankFactory from "../FileRankFactory.js";
import { Command } from "./Command.js";

export class EnPassantCommand extends Command {
  #board;

  #from;
  #to;
  #takingPiecePosition;

  #isValidCommand;

  //keeps track of the piece that this move captures if any
  #movingPiece;
  #takingPiece;

  constructor(board, from, to) {
    super(Command.TYPES.EN_PASSANT_COMMAND);

    this.#board = board;
    this.#from = from;
    this.#to = to;
    this.#takingPiecePosition = FileRankFactory.getFileRank(
      this.#to.getCol(),
      this.#from.getRow()
    );

    this.#movingPiece = null;
    this.#takingPiece = null;

    this.#isValidCommand = true;
  }

  execute() {
    this.setExecuted(true);

    this.#movingPiece = this.#board.getPiece(this.#from);

    this.#takingPiece = this.#board.getPiece(this.#takingPiecePosition);

    if (!this.#movingPiece) {
      return (this.#isValidCommand = false);
    }

    if (!this.#board.isValidMove(this.#from, this.#to)) {
      return (this.#isValidCommand = false);
    }

    // console.log(this.#takingPiecePosition, this.#takingPiece);

    this.#board.movePiece(this.#movingPiece, this.#to);
    this.#board.removePiece(this.#takingPiecePosition);

    this.#movingPiece.moved(this.#from, this.#to);
    this.emit();

    return (this.#isValidCommand = true);
  }

  undo() {
    this.#board.movePiece(this.#movingPiece, this.#from);

    this.#board.placePiece(this.#takingPiece, this.#takingPiecePosition);
  }

  redo() {
    this.#board.movePiece(this.#movingPiece, this.#to);
    this.#board.removePiece(this.#takingPiecePosition);
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

  isAValidCommand() {
    return this.#isValidCommand;
  }

  getMovingPiece() {
    return this.#movingPiece;
  }
}
