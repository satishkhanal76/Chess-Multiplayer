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
    this.#playerSocketDictionary = { player, socket };
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
    const otherSockets = this.#playerSockets.filter(
      (soc) => soc.id !== socket.id
    );

    otherSockets.forEach((otherSoc) => otherSoc.emit("pieceMove", payload));
  }
}
