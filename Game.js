import GameEngine from "./engine/GameEngine.js";
import Base from "./gameObjects/Base.js";

export default class Game {
  constructor() {
    this.engine = new GameEngine({
      width: 600,
      height: 800,
      bgColor: "#000",
    });

    // Debug
    window.engine = this.engine;
    // this.engine.setProd();
  }

  start() {
    this.engine.images.preload("base");

    this.engine.load().then(() => {
      this.base = new Base(engine);
      this.engine.register(this.base);

      this.engine.onMouseMove(event => {
        this.base.pointTo(event.pos);
      });
    });
  }
}