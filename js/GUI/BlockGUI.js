export class BlockGUI {

    #column;
    #row;

    #element;

    #boardGUI;

    constructor(col, row, boardGUI) {
        this.#column = col;
        this.#row = row;

        this.#boardGUI = boardGUI;

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
        this.#element.dataset.col = this.#column;
        this.#element.dataset.row = this.#row;
        this.setText(" ");
    }

    addEventListeners() {
        this.#element.addEventListener("click", eve => {
            this.#boardGUI.clicked(this);
        })
    }

    getColumn() {
        return this.#column;
    }

    getRow() {
        return this.#row;
    }

    setText(text) {
        this.#element.textContent = text;
    }


    getElement() {
        return this.#element;
    }
}