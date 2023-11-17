export default class FileRankMaker {
  static #convertRowToRank(row) {
    const baordHeight = 7;

    let rowRank = row - baordHeight;
    if (rowRank < 0) {
      rowRank = Math.abs(rowRank);
    }
    return rowRank + 1;
  }

  static #convertColToFile(col) {
    const charCode = 97 + col;
    return String.fromCharCode(charCode);
  }

  static convertToFileRank(col, row) {
    const file = FileRankMaker.#convertColToFile(col);
    const rank = FileRankMaker.#convertRowToRank(row);

    return file.concat(rank);
  }

  static convertToColRow(fileRankString) {
    const lenghtOfString = fileRankString.length;
    if (lenghtOfString !== 2) return { col: 0, row: 0 };

    const file = fileRankString.charAt(0);
    const rank = fileRankString.charAt(1);

    return {
      col: FileRankMaker.#convertFileToCol(file),
      row: FileRankMaker.#convertRankToRow(rank),
    };
  }

  static #convertFileToCol(file) {
    const charCode = file.charCodeAt(0);
    const col = charCode - 97;
    return col;
  }

  static #convertRankToRow(rank) {
    const baordHeight = 7;
    const rankNumber = Number(rank) - 1;
    let row = rankNumber - baordHeight;
    if (row < 0) {
      row = Math.abs(row);
    }
    return row;
  }
}
