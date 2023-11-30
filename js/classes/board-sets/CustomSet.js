import ClassicalSet from "./ClassicalSet.js";

export default class CustomSet extends ClassicalSet {
  constructor(board, fenString) {
    super(board);

    super.setFenString(fenString);
  }
}
