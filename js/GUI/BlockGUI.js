export class BlockGUI {

    #column;
    #row;

    #element;

    #boardGUI;

    #colour;

    constructor(col, row, boardGUI, colour) {
        this.#column = col;
        this.#row = row;

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