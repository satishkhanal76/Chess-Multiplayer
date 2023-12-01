import FileRankFactory from "../FileRankFactory.js";
import { PieceFactory } from "../pieces/PieceFactory.js";

export default class ClassicalSet {
  #FEN_STRING = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  #board;
  constructor(board) {
    this.#board = board;
  }

  populateBoard() {
    const ranks = this.#FEN_STRING.split("/");

    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      if (i >= this.#board.getRow()) continue;

      let col = 0;
      for (let j = 0; j < rank.length; j++) {
        const character = rank.charAt(j);

        const numberOfSkips = parseInt(character);

        if (col >= this.#board.getColumn()) continue;

        const piece = PieceFactory.getPieceFen(character);
        const fileRank = FileRankFactory.getFileRank(col, i);

        this.#board.placePiece(piece, fileRank);

        if (!isNaN(numberOfSkips)) {
          col = col + numberOfSkips;
        } else {
          col = col + 1;
        }
      }
    }
  }

  setFenString(fenString) {
    this.#FEN_STRING = fenString;
  }
}
