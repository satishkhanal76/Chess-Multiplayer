import { Movement } from "./Movement.js";
import { Piece } from "./Piece.js";

export class Pawn extends Piece {
  #promotionRow;
  constructor(piece, colour) {
    super(piece.type, piece.character, colour);

    this.#promotionRow = piece.promotionRow;

    this.configureMoves();
  }

  configureMoves() {
    if (this.getColour() === Piece.COLOUR.WHITE) {
      this.addMoves(Movement.getTwoForwardToTop);
    } else {
      this.addMoves(Movement.getTwoForwardToBottom);
    }
  }

  getAvailableMoves(board) {
    let dimension = {
      col: board.getColumn(),
      row: board.getRow(),
    };

    let availableMoves = super.getAvailableMoves(board);

    //if there is an opponent's piece at front then it's an invalid position
    availableMoves = this.validateTheMove(board, availableMoves);

    //if there is an opponent's piece on the diagonal then its a valid move
    let piecePosition = board.getPiecePosition(this);
    let moves = [];

    if (this.getColour() === Piece.COLOUR.WHITE) {
      moves = moves.concat(
        Movement.getOneDiagnolToTopLeft(dimension, piecePosition)
      );
      moves = moves.concat(
        Movement.getOneDiagnolToTopRight(dimension, piecePosition)
      );
    } else {
      moves = moves.concat(
        Movement.getOneDiagnolToBottomLeft(dimension, piecePosition)
      );
      moves = moves.concat(
        Movement.getOneDiagnolToBottomRight(dimension, piecePosition)
      );
    }

    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      if (!move) continue;

      let piece = board.getPiece(move);
      if (piece && piece.getColour() != this.getColour()) {
        availableMoves.push(move);
      }
    }

    return availableMoves;
  }

  validateTheMove(board, availableMoves) {
    for (let i = 0; i < availableMoves.length; i++) {
      let move = availableMoves[i];
      let piece = board.getPiece(move);
      if (piece && piece.getColour() != this.getColour()) {
        availableMoves.splice(i, 1);
      }
    }
    return availableMoves;
  }

  getPromotionRow() {
    return this.#promotionRow;
  }

  moved(from, to) {
    //if it has not been moved before and is the first move than allow the pawn to only move one step
    if (!this.hasMoved()) {
      //reset the moves array so that it cannot move more than one square
      this.clearMoves();
      if (this.getColour() === Piece.COLOUR.WHITE) {
        this.addMoves(Movement.getForwardToTop);
      } else {
        this.addMoves(Movement.getForwardToBottom);
      }
    }
    super.moved(from, to);
  }
}
