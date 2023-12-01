export default class Listeners {
  #listeners;

  constructor() {
    this.#listeners = [];
  }

  addListener(listener) {
    this.#listeners.push(listener);
  }

  removeListener(listener) {
    this.#listeners = this.#listeners.filter((l) => l !== listener);
    return listener;
  }

  emit(payload) {
    this.#listeners.forEach((listener) => listener(payload));
  }
}
