import { Game } from "./classes/Game.js";
import ClassicalVariant from "./classes/variants/ClassicalVariant.js";
import TwoQueenVariant from "./classes/variants/TwoQueenVariant.js";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { BoardGUI } from "./GUI/BoardGUI.js";
import { Piece } from "./classes/pieces/Piece.js";

const socket = io("http://localhost:3000/");

let socketId;
let roomId;

const roomIdForm = document.getElementById("room-id-container");

roomIdForm.addEventListener("submit", (eve) => {
  eve.preventDefault();

  const value = document.getElementById("room-id").value;
  if (socketId) {
    socket.emit("join-room", {
      roomId: value,
    });
  }
});

let game;
let boardGUI;

socket.on("connectionSuccess", (payload) => {
  socketId = payload.id;
  console.log(payload);
});

socket.on("join-success", (payload) => {
  roomId = payload.roomId;
  if (payload.newRoom) {
    alert("ROOM CREATED");
    socket.emit("createGame", {
      roomId: roomId,
      socketId: socketId,
    });
  } else {
    alert("ROOM JOINED");
  }
  roomIdForm.remove();
});

socket.on("error", (payload) => {
  console.log(payload);
});

socket.on("game-creation-success", (payload) => {
  const color = payload.color;
  game = new Game(new ClassicalVariant());
  boardGUI = new BoardGUI(game, socket, modal, color, {
    roomId,
    socketId,
  });
  if (color === Piece.COLOUR.BLACK) {
    boardGUI.flipBoard();
  }
});
