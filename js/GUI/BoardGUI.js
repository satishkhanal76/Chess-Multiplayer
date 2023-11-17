import { CastleCommand } from "../classes/commands/CastleCommand.js";
import { Piece } from "../classes/pieces/Piece.js";
import { BlockGUI } from "./BlockGUI.js";
import { MoveCommand } from "../classes/commands/MoveCommand.js";
import FileRank from "../classes/FileRank.js";

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
        Piece.COLOUR.BLACK,
        this.#board.isInCheckmate(Piece.COLOUR.BLACK)
      );
      console.log(
        Piece.COLOUR.WHITE,
        this.#board.isInCheckmate(Piece.COLOUR.WHITE)
      );
    });
  }

  clicked(block) {
    const currentPlayer = this.#game.getCurrentPlayer();
    let from, to;

    to = {
      col: block.getFileRank().getCol(),
      row: block.getFileRank().getRow(),
    };

    let piece = this.#board.getPiece(to);

    if (this.#clickedPiece) {
      from = {
        col: this.#clickedPiece.getFileRank().getCol(),
        row: this.#clickedPiece.getFileRank().getRow(),
      };

      let fromPiece = this.#board.getPiece(from);
      let toPiece = this.#board.getPiece(to);

      if (
        fromPiece?.getType() === Piece.TYPE.KING &&
        toPiece?.getType() === Piece.TYPE.ROOK
      ) {
        currentPlayer.castle(from, to);
      } else if (
        fromPiece.getType() === Piece.TYPE.PAWN &&
        fromPiece.getPromotionRow() === to.row
      ) {
        currentPlayer.promotePiece(
          this.#board.getPiece(from),
          to,
          Piece.TYPE.QUEEN
        );
      } else {
        currentPlayer.movePiece(this.#board.getPiece(from), to);
      }

      this.#clickedPiece = null;
      this.updateBoard();
      this.displayModalIfOver();
      this.updateButtons();
    } else {
      if (!piece) return null;

      this.#clickedPiece = block;

      from = {
        col: this.#clickedPiece.getFileRank().getCol(),
        row: this.#clickedPiece.getFileRank().getRow(),
      };

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
    let grid = this.#board.getGrid();
    let piece;

    let block;
    let lastColour = Piece.COLOUR.WHITE;

    for (let i = 0; i < grid.length; i++) {
      // this.#element.append((document.createElement("span").textContent = i));
      for (let j = 0; j < grid[i].length; j++) {
        piece = grid[i][j];

        const fileRank = new FileRank({
          col: j,
          row: i,
        });

        block = new BlockGUI(fileRank, this, lastColour);

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

  updateBoard() {
    let grid = this.#board.getGrid();
    let piece;

    let block;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        piece = grid[i][j];

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

  showBoardOnConsole() {
    let grid = this.#board.getGrid();
    let piece;
    let output = "";
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        piece = grid[j][i];
        output += piece ? piece.getCharacter() : " ";
      }
      output = output + "\n";
    }
    console.log(output);
  }
}
