import GameEngine from "./engine/GameEngine.js";
import Base from "./gameObjects/Base.js";
import Enemy from "./gameObjects/Enemy.js";
import Spawner from "./gameObjects/Spawner.js";
import Text from "./engine/gfx/Text.js";
import GameUI from "./gameObjects/GameUI.js";

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
    this.engine.globals.cash = 0;

    this.engine.load().then(() => {
      this.engine.register(this.engine.globals.base = new Base(engine), "base");
      this.engine.onMouseMove(event => {
        this.engine.globals.base.pointTo(event.pos);
      });
      
      this.engine.register(new Spawner(this.engine));

      this.engine.register(new GameUI(this.engine));
    });
  }
}