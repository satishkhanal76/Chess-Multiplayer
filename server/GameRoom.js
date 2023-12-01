import FileRankFactory from "../public/js/classes/FileRankFactory.js";
import { Piece } from "../public/js/classes/pieces/Piece.js";

export default class GameRoom {
  #roomId;
  #game;

  #playerSockets = [];

  #playerSocketDictionary = [];

  constructor(roomId) {
    this.#roomId = roomId;
  }

  addPlayerSocket(socket) {
    this.#playerSockets.push(socket);
  }

  setPlayerSocket(player, socket) {
    this.#playerSocketDictionary.push({ player, socket });
  }

  getGame() {
    return this.#game;
  }
  setGame(game) {
    this.#game = game;
  }
  getId() {
    return this.#roomId;
  }

  getPlayerSockets() {
    return this.#playerSockets;
  }

  removePlayer(playerSocket) {
    const socketIndex = this.#playerSockets.findIndex(
      (socket) => socket.id === playerSocket.id
    );
    if (socketIndex >= 0) {
      this.#playerSockets.splice(socketIndex, 1);
    }
  }

  makeMove(socket, payload) {
    if (socket.id !== payload.socketId) return null;
    const playerSocketToMakeMove = this.#playerSocketDictionary.find(
      (playerSocketObject) => playerSocketObject.socket.id === socket.id
    );
    if (playerSocketToMakeMove?.player !== this.#game.getCurrentPlayer()) {
      return socket.emit("error", { msg: "Not your turn to make the move." });
    }

    const move = this.movePiece(
      FileRankFactory.getFileRank(payload.from.col, payload.from.row),
      FileRankFactory.getFileRank(payload.to.col, payload.to.row)
    );
    if (!move) return socket.emit("error", { msg: "Not Your move." });

    this.#playerSockets.forEach((s) => {
      if (s.id !== socket.id) {
        s.emit("pieceMove", payload);
      }
    });

    // otherSockets.forEach((otherSoc) => otherSoc.emit("pieceMove", payload));
  }

  movePiece(from, to) {
    const currentPlayer = this.#game.getCurrentPlayer();
    const board = this.#game.getBoard();

    let fromPiece = board.getPiece(from);
    let toPiece = board.getPiece(to);
    let move;

    if (
      board.getCommandHandler().getCurrentCommandIndex() <
      board.getCommandHandler().getCommandIndex()
    ) {
      this.executeAllCommands();
    }

    if (
      fromPiece?.getColour() === toPiece?.getColour() &&
      fromPiece?.getType() === Piece.TYPE.KING &&
      toPiece?.getType() === Piece.TYPE.ROOK
    ) {
      move = currentPlayer.castle(from, to);
    } else if (
      fromPiece.getType() === Piece.TYPE.PAWN &&
      fromPiece.getPromotionRow() === to.getRow()
    ) {
      move = currentPlayer.promotePiece(
        board.getPiece(from),
        to,
        Piece.TYPE.QUEEN
      );
    } else {
      try {
        move = currentPlayer.movePiece(board.getPiece(from), to);
      } catch (error) {
        move = null;
      }
    }
    return move;
  }

  emitAllMoves(socket) {
    const moves = [];

    if (!this.#game) return null;

    const commands = this.#game.getBoard().getCommandHandler().getAllCommands();

    commands.forEach((command) => {
      moves.push({
        from: {
          col: command.getFrom().getCol(),
          row: command.getFrom().getRow(),
        },
        to: {
          col: command.getTo().getCol(),
          row: command.getTo().getRow(),
        },
      });
    });

    if (moves.length > 0) {
      socket.emit("previousMoves", moves);
    }
  }
}
