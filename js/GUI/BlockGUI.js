export class BlockGUI {
  #fileRank;

  #element;

  #boardGUI;

  #colour;

  #text;

  constructor(fileRank, boardGUI, colour) {
    this.#fileRank = fileRank;

    this.#boardGUI = boardGUI;

    this.#colour = colour;
    this.#text = "";

    this.createElement();
    this.addEventListeners();
  }

  getText() {
    return this.#text;
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
    this.#text = text;
    this.#element.textContent = this.#text;
  }

  getElement() {
    return this.#element;
  }

  getColour() {
    return this.#colour;
  }
}
