import { Piece } from "../classes/pieces/Piece.js";
import { BlockGUI } from "./BlockGUI.js";
import FileRankFactory from "../classes/FileRankFactory.js";
import { Command } from "../classes/commands/Command.js";

export class BoardGUI {
  #game;
  #board;

  #blocks = [];

  #element;

  #clickedPiece;

  #modal;

  #animationTime = 250;

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

    prev.addEventListener("click", async () => {
      const command = this.#board.getCommandHandler().undoCommand();

      await this.animateCommand(command, true);
      //animation updates the board
      // this.updateBoard();
      this.updateButtons();
    });

    next.addEventListener("click", async () => {
      const command = this.#board.getCommandHandler().redoCommand();

      await this.animateCommand(command);

      // this.updateBoard();
      this.updateButtons();
    });

    current.addEventListener("click", async () => {
      const commands = this.#board.getCommandHandler().executeCommands();

      Promise.all(commands.map((command) => this.animateCommand(command)));
      // this.updateBoard();
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

  async animateCommand(command, undo = false) {
    return new Promise(async (resolve, reject) => {
      if (undo) {
        if (command.getType() === Command.TYPES.CASTLE_COMMAND) {
          this.animateCasstleCommand(
            command,
            this.getBlock(command.getKingNewPosition()),
            this.getBlock(command.getRookNewPosition()),
            true
          );
        } else {
          this.animateMoveCommand(
            command,
            this.getBlock(command.getTo()),
            true
          );
        }
      } else {
        if (command.getType() === Command.TYPES.CASTLE_COMMAND) {
          this.animateCasstleCommand(
            command,
            this.getBlock(command.getKingPosition()),
            this.getBlock(command.getRookPosition())
          );
        } else {
          this.animateMoveCommand(command, this.getBlock(command.getFrom()));
        }
      }
      setTimeout(() => {
        resolve("RESOLVED");
      }, this.#animationTime);
    });
  }

  getBlock(fileRank) {
    return this.#blocks.find(
      (block) =>
        block.getFileRank().getCol() === fileRank.getCol() &&
        block.getFileRank().getRow() === fileRank.getRow()
    );
  }

  clicked(block) {
    const currentPlayer = this.#game.getCurrentPlayer();

    let piece = this.#board.getPiece(block.getFileRank());

    if (this.#clickedPiece) {
      let fromPiece = this.#board.getPiece(this.#clickedPiece.getFileRank());
      let toPiece = this.#board.getPiece(block.getFileRank());

      let from = {
        col: this.#clickedPiece.getFileRank().getCol(),
        row: this.#clickedPiece.getFileRank().getRow(),
      };
      let to = {
        col: block.getFileRank().getCol(),
        row: block.getFileRank().getRow(),
      };

      let command;

      if (
        fromPiece?.getType() === Piece.TYPE.KING &&
        toPiece?.getType() === Piece.TYPE.ROOK
      ) {
        command = currentPlayer.castle(
          this.#clickedPiece.getFileRank(),
          block.getFileRank()
        );

        this.animateCasstleCommand(command, this.#clickedPiece, block);
      } else if (
        fromPiece.getType() === Piece.TYPE.PAWN &&
        fromPiece.getPromotionRow() === block.getFileRank().getRow()
      ) {
        command = currentPlayer.promotePiece(
          this.#board.getPiece(this.#clickedPiece.getFileRank()),
          block.getFileRank(),
          Piece.TYPE.QUEEN
        );
        this.animateMoveCommand(command, this.#clickedPiece);
      } else {
        command = currentPlayer.movePiece(
          this.#board.getPiece(this.#clickedPiece.getFileRank()),
          block.getFileRank()
        );
        this.animateMoveCommand(command, this.#clickedPiece);
      }
      this.removeValidSoptsMark();

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

  animateMoveCommand(command, piece, undo = false) {
    const from = {
      col: command.getFrom().getCol(),
      row: command.getFrom().getRow(),
    };
    const to = {
      col: command.getTo().getCol(),
      row: command.getTo().getRow(),
    };
    if (!command.isAValidCommand()) return null;
    if (undo) {
      this.animateBlock(to, from, piece);
    } else {
      this.animateBlock(from, to, piece);
    }
  }

  animateCasstleCommand(command, kingBlock, rookBlock, undo = false) {
    const fromKing = {
      col: command.getKingPosition().getCol(),
      row: command.getKingPosition().getRow(),
    };
    const toKing = {
      col: command.getKingNewPosition().getCol(),
      row: command.getKingNewPosition().getRow(),
    };
    const fromRook = {
      col: command.getRookPosition().getCol(),
      row: command.getRookPosition().getRow(),
    };
    const toRook = {
      col: command.getRookNewPosition().getCol(),
      row: command.getRookNewPosition().getRow(),
    };
    if (undo) {
      Promise.all([
        this.animateBlock(toKing, fromKing, kingBlock),
        this.animateBlock(toRook, fromRook, rookBlock),
      ]);
    } else {
      Promise.all([
        this.animateBlock(fromKing, toKing, kingBlock),
        this.animateBlock(fromRook, toRook, rookBlock),
      ]);
    }
  }
  updateButtons(disable = false) {
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

    if (disable) {
      prev.disabled = false;
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

    element.style.setProperty("--from-col", offsetFrom.col + "px");
    element.style.setProperty("--from-row", offsetFrom.row + "px");
    element.style.setProperty("--to-col", offsetTo.col + "px");
    element.style.setProperty("--to-row", offsetTo.row + "px");

    this.removeValidSoptsMark();
    block.setText(" ");

    element.style.animation = `animate-move ${
      this.#animationTime
    }ms cubic-bezier( 0.215, 0.61, 0.355, 1 )`;
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

        block = this.#blocks
          .filter(
            (block) =>
              block.getFileRank().getCol() == i &&
              block.getFileRank().getRow() == j
          )
          .pop();

        block.setText(piece ? piece.getCharacter() : " ");
        block.hideAsValidBlock();
        if (!piece) continue;
        if (piece.getType() === Piece.TYPE.KING)
          this.#board.isKingInCheck(piece.getColour())
            ? block.addCheckStyle()
            : block.removeCheckStyle();
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
