export class BlockGUI {
  #fileRank;

  #element;

  #boardGUI;

  #colour;

  constructor(fileRank, boardGUI, colour) {
    this.#fileRank = fileRank;

    this.#boardGUI = boardGUI;

    this.#colour = colour;

    this.createElement();
    this.addEventListeners();
  }

  showAsValidBlock() {
    this.#element.classList.add("valid-spot");
  }

  hideAsValidBlock() {
    this.#element.classList.remove("valid-spot");
  }

  createElement() {
    this.#element = document.createElement("div");
    this.#element.classList.add("block");
    this.#element.classList.add(this.#colour);

    this.#element.dataset.col = this.#fileRank.getCol();
    this.#element.dataset.row = this.#fileRank.getRow();
    this.setText(" ");
  }

  addEventListeners() {
    this.#element.addEventListener("click", (eve) => {
      this.#boardGUI.clicked(this);
    });
  }

  getFileRank() {
    return this.#fileRank;
  }
  setText(text) {
    this.#element.textContent = text;
  }

  getElement() {
    return this.#element;
  }
}
