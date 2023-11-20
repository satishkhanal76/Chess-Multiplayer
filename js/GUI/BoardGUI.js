import { Piece } from "../classes/pieces/Piece.js";
import { BlockGUI } from "./BlockGUI.js";
import FileRankFactory from "../classes/FileRankFactory.js";

export class BoardGUI {
  #game;
  #board;

  #blocks = [];

  #element;

  #clickedPiece;

  #modal;

  constructor(game, modal) {
    this.#game = game;
    this.#board = game.getBoard();

    this.#modal = modal;

    this.#element = document.getElementById("board");

    this.#createBlocks();
    this.updateBoard();

    this.setupButtons();
  }

  setupButtons() {
    let prev = document.getElementById("previous");
    let next = document.getElementById("next");
    let current = document.getElementById("current");

    prev.addEventListener("click", () => {
      this.#board.getCommandHandler().undoCommand();
      this.updateBoard();
      this.updateButtons();
    });

    next.addEventListener("click", () => {
      this.#board.getCommandHandler().redoCommand();
      this.updateBoard();
      this.updateButtons();
    });

    current.addEventListener("click", () => {
      this.#board.getCommandHandler().executeCommands();
      this.updateBoard();
      this.updateButtons();
    });

    this.updateButtons();

    document.addEventListener("keypress", (eve) => {
      console.log(
        this.#board.getPiecesAtRank(FileRankFactory.getFileRank("a8"))
      );

      this.#board.findPinAndChecks(Piece.COLOUR.BLACK);
    });
  }

  clicked(block) {
    const currentPlayer = this.#game.getCurrentPlayer();

    let piece = this.#board.getPiece(block.getFileRank());

    if (this.#clickedPiece) {
      let fromPiece = this.#board.getPiece(this.#clickedPiece.getFileRank());
      let toPiece = this.#board.getPiece(block.getFileRank());

      const from = {
        col: this.#clickedPiece.getFileRank().getCol(),
        row: this.#clickedPiece.getFileRank().getRow(),
      };
      const to = {
        col: block.getFileRank().getCol(),
        row: block.getFileRank().getRow(),
      };

      if (
        fromPiece?.getType() === Piece.TYPE.KING &&
        toPiece?.getType() === Piece.TYPE.ROOK
      ) {
        currentPlayer.castle(
          this.#clickedPiece.getFileRank(),
          block.getFileRank()
        );
      } else if (
        fromPiece.getType() === Piece.TYPE.PAWN &&
        fromPiece.getPromotionRow() === block.getFileRank().getRow()
      ) {
        currentPlayer.promotePiece(
          this.#board.getPiece(this.#clickedPiece.getFileRank()),
          block.getFileRank(),
          Piece.TYPE.QUEEN
        );
        this.removeValidSoptsMark();
        this.animateBlock(from, to, this.#clickedPiece);
      } else {
        currentPlayer.movePiece(
          this.#board.getPiece(this.#clickedPiece.getFileRank()),
          block.getFileRank()
        );
      }

      this.removeValidSoptsMark();
      this.animateBlock(from, to, this.#clickedPiece);

      this.displayModalIfOver();
      this.updateButtons();
      this.#clickedPiece = null;
    } else {
      if (!piece) return null;

      this.#clickedPiece = block;

      let validMoves = this.#game.getCurrentPlayer().getValidMoves(piece);
      if (!validMoves || validMoves.length < 1) {
        this.#clickedPiece = null;
      } else {
        this.showValidMoves(validMoves);
      }
    }
  }

  updateButtons() {
    let prev = document.getElementById("previous");
    let next = document.getElementById("next");
    let current = document.getElementById("current");
    let commandHandler = this.#board.getCommandHandler();

    let currentCommandIndex = commandHandler.getCurrentCommandIndex();
    let commandIndex = commandHandler.getCommandIndex();

    prev.disabled = true;
    next.disabled = true;
    current.disabled = true;

    if (currentCommandIndex === -1 && commandIndex === -1) return;

    if (currentCommandIndex <= commandIndex && currentCommandIndex > -1) {
      prev.disabled = false;
    }
    if (currentCommandIndex < commandIndex) {
      next.disabled = false;
      current.disabled = false;
    }
  }

  /**
   * This method is a mess- need to refactor later
   * @returns
   */
  displayModalIfOver() {
    let isGameOver = this.#game.isOver();

    if (!isGameOver) return null;

    this.#modal.style.display = "block";

    let text = this.#modal.querySelector(".modal-title");
    let display = this.#modal.querySelector(".display");

    let avatar = document.createElement("div");
    avatar.classList.add("avatar");
    let avatar2 = document.createElement("div");
    avatar2.classList.add("avatar");

    let winner = this.#game.getWinner();
    let winnerCharacter =
      winner?.getColour() === Piece.COLOUR.WHITE ? "♔" : "♚";

    if (winner) {
      text.textContent = `${
        winner?.getColour() === Piece.COLOUR.WHITE ? "White" : "Black"
      } wins!`;
      console.log(winner);
      display.classList.add("win");
      avatar.classList.add(
        `win-${winner?.getColour() === Piece.COLOUR.WHITE ? "white" : "black"}`
      );
      avatar.textContent = winnerCharacter;
      display.appendChild(avatar);
    } else {
      text.textContent = `Stalemate!`;
      display.classList.add("stalemate");
      avatar.textContent = "♔";
      avatar2.textContent = "♚";
      display.appendChild(avatar);
      display.appendChild(avatar2);
    }
  }

  showValidMoves(validMoves) {
    validMoves.forEach((move) => {
      let block = this.#blocks.filter(
        (block) =>
          move.col == block.getFileRank().getCol() &&
          move.row == block.getFileRank().getRow()
      );
      block[0].showAsValidBlock();
    });
  }

  showBoard() {
    let grid = this.#board.getGrid();
    let piece;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        piece = grid[i][j];
        console.log(piece);
      }
    }
  }

  #createBlocks() {
    const columnLength = this.#board.getColumn();
    const rowLength = this.#board.getRow();
    let piece;

    let block;
    let lastColour = Piece.COLOUR.WHITE;

    for (let i = 0; i < columnLength; i++) {
      // this.#element.append((document.createElement("span").textContent = i));
      for (let j = 0; j < rowLength; j++) {
        piece = this.#board.getPiece(FileRankFactory.getFileRank(i, j));

        const fileRank = FileRankFactory.getFileRank(j, i);

        block = this.createBlock(fileRank, lastColour);

        this.#blocks.push(block);

        block.setText(piece ? piece.getCharacter() : " ");

        this.#element.append(block.getElement());
        lastColour =
          lastColour === Piece.COLOUR.WHITE
            ? Piece.COLOUR.BLACK
            : Piece.COLOUR.WHITE;
      }
      lastColour =
        lastColour === Piece.COLOUR.WHITE
          ? Piece.COLOUR.BLACK
          : Piece.COLOUR.WHITE;
    }
  }

  animateBlock(from, to, block) {
    const newBlock = new BlockGUI(block.getFileRank(), this);

    newBlock.setText(block.getText());
    const element = newBlock.getElement();
    element.style.position = "absolute";

    element.addEventListener("animationend", (eve) => {
      element.remove();
      this.updateBoard();
    });

    this.#element.append(element);

    const offsetFrom = {
      col: from.col * element.offsetWidth,
      row: from.row * element.offsetHeight,
    };
    const offsetTo = {
      col: to.col * element.offsetWidth,
      row: to.row * element.offsetHeight,
    };

    // element.style.left = `${offsetFrom.col}px`;
    // element.style.top = `${offsetFrom.row}px`;

    element.style.setProperty("--from-col", offsetFrom.col + "px");
    element.style.setProperty("--from-row", offsetFrom.row + "px");
    element.style.setProperty("--to-col", offsetTo.col + "px");
    element.style.setProperty("--to-row", offsetTo.row + "px");

    block.setText(" ");
    element.style.animation =
      "animate-move 0.3s cubic-bezier( 0.215, 0.61, 0.355, 1 ) ";

    // element.style.left = `${offsetTo.col}px`;
    // element.style.top = `${offsetTo.row}px`;
  }

  createBlock(fileRank, lastColour) {
    return new BlockGUI(fileRank, this, lastColour);
  }

  updateBoard() {
    const columnLength = this.#board.getColumn();
    const rowLenghth = this.#board.getRow();
    let piece;

    let block;

    for (let i = 0; i < columnLength; i++) {
      for (let j = 0; j < rowLenghth; j++) {
        piece = this.#board.getPiece(FileRankFactory.getFileRank(i, j));

        block = this.#blocks.filter(
          (block) =>
            block.getFileRank().getCol() == i &&
            block.getFileRank().getRow() == j
        );

        block[0].setText(piece ? piece.getCharacter() : " ");
        block[0].hideAsValidBlock();
      }
    }
  }

  removeValidSoptsMark() {
    const columnLength = this.#board.getColumn();
    const rowLenghth = this.#board.getRow();
    let piece;

    let block;

    for (let i = 0; i < columnLength; i++) {
      for (let j = 0; j < rowLenghth; j++) {
        piece = this.#board.getPiece(FileRankFactory.getFileRank(i, j));

        block = this.#blocks.filter(
          (block) =>
            block.getFileRank().getCol() == i &&
            block.getFileRank().getRow() == j
        );

        block[0].hideAsValidBlock();
      }
    }
  }

  showBoardOnConsole() {
    const columnLength = this.#board.getColumn();
    const rowLenghth = this.#board.getRow();

    let piece;
    let output = "";
    for (let i = 0; i < columnLength; i++) {
      for (let j = 0; j < rowLenghth; j++) {
        piece = this.#board.getPiece(FileRankFactory.getFileRank(i, j));
        output += piece ? piece.getCharacter() : " ";
      }
      output = output + "\n";
    }
    console.log(output);
  }
}
