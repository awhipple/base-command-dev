import GameEngine from "./engine/GameEngine.js";

export default class Game {
  constructor() {
    this.engine = new GameEngine();

    // Debug
    window.engine = this.engine;
    // this.engine.setProd();
  }

  play() {
    this.engine.load().then(() => {
      
    });
  }
}