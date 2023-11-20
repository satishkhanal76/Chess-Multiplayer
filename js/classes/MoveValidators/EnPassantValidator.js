import { Command } from "../commands/Command.js";
import { Piece } from "../pieces/Piece.js";
import ParentMoveValidator from "./ParentMoveValidator.js";

/**
 * Validates the EnPassant Rule in chess
 */

export default class EnPassantValidator extends ParentMoveValidator {
  constructor(board) {
    super(board);
  }

  getValidMoves(piece, moves) {
    if (piece.getType() !== Piece.TYPE.PAWN) return moves;

    const board = this.getBoard();

    // En passant Logic

    //Might think to get the current command but the enpassant command has already been added so get the previous command
    const previousCommand = board.getCommandHandler().getCurrentCommand();

    // previous commad is not a move or does not exists
    if (
      !previousCommand ||
      previousCommand.getType() !== Command.TYPES.MOVE_COMMAND
    )
      return moves;

    const previousMovingPiece = previousCommand.getMovingPiece();

    // if the "assumed jumping piece" is an ally piece, En Passant not possible
    if (previousMovingPiece.getColour() == piece.getColour()) return moves;

    // if the "assumed jumping piece" is not a pawn, En Passant not possible
    if (previousMovingPiece.getType() !== Piece.TYPE.PAWN) return moves;

    // if the "assumed jumping piece" is actually didn't jump, En Passant not possible
    if (!previousMovingPiece.getJumpedFileRank()) return moves;

    /* this is an redundant if statement but
       this makes it so that if the pawn can jump multiple times in a game then checks to see if the latest jump was the last move */
    const previousMovingPieceFileRank = previousMovingPiece.getJumpedFileRank();
    if (previousMovingPieceFileRank !== previousCommand.getTo()) return moves;

    const thisPiecePosition = board.getPiecePosition(piece);

    // if the jumping enemy piece does not land on the same row as ally piece, En Passant not possible
    if (previousMovingPieceFileRank.getRow() !== thisPiecePosition.getRow())
      return moves;

    // if the enemy pawn is not on either side, En Passant not possible
    if (
      !(
        previousMovingPieceFileRank.getCol() ===
          thisPiecePosition.getCol() - 1 ||
        previousMovingPieceFileRank.getCol() === thisPiecePosition.getCol() + 1
      )
    )
      return moves;

    if (piece.getColour() === Piece.COLOUR.WHITE) {
      moves.push({
        col: previousMovingPieceFileRank.getCol(),
        row: previousMovingPieceFileRank.getRow() - 1,
      });
    } else {
      moves.push({
        col: previousMovingPieceFileRank.getCol(),
        row: previousMovingPieceFileRank.getRow() + 1,
      });
    }

    return moves;
  }
}
