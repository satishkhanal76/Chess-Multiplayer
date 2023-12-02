import express from "express";
import { Server } from "socket.io";
import { Game } from "./public/js/classes/Game.js";
import ClassicalVariant from "./public/js/classes/variants/ClassicalVariant.js";
import TwoQueenVariant from "./public/js/classes/variants/TwoQueenVariant.js";
import FileRankFactory from "./public/js/classes/FileRankFactory.js";
import { Piece } from "./public/js/classes/pieces/Piece.js";
import GameRoom from "./server/GameRoom.js";

const app = express();

const players = [];
const rooms = [];

app.use(express.static("./public"));

const server = app.listen(3000);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  players.push(socket.id);

  const connectionSuccessPayload = {
    success: true,
    id: socket.id,
  };
  socket.emit("connectionSuccess", connectionSuccessPayload);

  socket.on("disconnect", () => {
    const socketIndex = players.findIndex((player) => player === socket.id);
    players.splice(socket, 1);

    rooms.forEach((room) => {
      room.removePlayer(socket);
      if (room.getPlayerSockets().length < 1) {
        const roomIndex = rooms.findIndex((r) => r.getId() === room.getId());
        if (roomIndex >= 0) {
          rooms.splice(roomIndex, 1);
        }
      }
    });
  });

  socket.on("join-room", (payload) => {
    const roomId = payload.roomId;
    const gameRoomIndex = rooms.findIndex((room) => room.getId() === roomId);
    let responsePayload = {
      roomId,
    };

    let gameRoom;

    if (gameRoomIndex < 0) {
      responsePayload.newRoom = true;
      gameRoom = new GameRoom(roomId);
      rooms.push(gameRoom);
    } else {
      responsePayload.newRoom = false;

      gameRoom = rooms[gameRoomIndex];
    }
    gameRoom.addPlayerSocket(socket);

    socket.emit("join-success", responsePayload);
    //if this is the second player make the player play black
    if (gameRoom.getPlayerSockets().length === 2) {
      console.log("SECOND PLAYER");
      const blackPlayer = gameRoom
        .getGame()
        .getPlayers()
        .find((player) => player.getColour() === Piece.COLOUR.BLACK);
      gameRoom.setPlayerSocket(blackPlayer, socket);
      socket.emit("game-creation-success", {
        variant: "CLASSICAL",
        color: Piece.COLOUR.BLACK,
      });
    } else if (gameRoom.getPlayerSockets().length > 2) {
      socket.emit("spectateGame", {
        variant: "CLASSICAL",
      });
    }

    gameRoom.emitAllMoves(socket);
  });

  socket.on("createGame", (payload) => {
    const gameRoomId = payload.roomId;
    const socketId = payload.socketId;

    const gameRoom = rooms.find((room) => room.getId() === gameRoomId);
    if (!gameRoom) return socket.emit("error", { msg: "NO ROOM FOUND" });

    if (!gameRoom.getPlayerSockets().find((s) => s.id === socketId))
      socket.emit("error", {
        msg: "This socket was not found in that game room.",
      });

    const game = new Game(new ClassicalVariant());
    gameRoom.setGame(game);
    const whitePlayer = game
      .getPlayers()
      .find((player) => player.getColour() === Piece.COLOUR.WHITE);
    gameRoom.setPlayerSocket(whitePlayer, socket);

    socket.emit("game-creation-success", {
      variant: "CLASSICAL",
      color: Piece.COLOUR.WHITE,
    });
  });

  socket.on("pieceMove", (payload) => {
    const gameRoom = rooms.find((room) => room.getId() === payload.roomId);
    if (!gameRoom) return socket.emit("error", { msg: "NO ROOM FOUND" });
    const playerSocket = gameRoom
      .getPlayerSockets()
      .find((s) => s.id === payload.socketId);
    if (!playerSocket)
      return playerSocket.emit("error", {
        msg: "This socket was not found in that game room.",
      });

    gameRoom.makeMove(socket, payload);
    // socket.broadcast.emit("pieceMove", payload);
  });
});
