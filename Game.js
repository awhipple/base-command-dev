import GameEngine from "./engine/GameEngine.js";
import Base from "./gameObjects/Base.js";
import Spawner from "./gameObjects/Spawner.js";
import GameUI from "./gameObjects/GameUI.js";
import UIWindow from "./engine/gfx/ui/window/index.js";

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
    this.engine.sounds.preload(["shot", "spark", "explosion", "lakitunes_chilled-beat.mp3"]);
    this.engine.sounds.alias("music", "lakitunes_chilled-beat");
    this.engine.globals.cash = 0;

    this.engine.load().then(() => {
      this.engine.on("firstInteraction", () => this.engine.sounds.play("music", {loop: true, volume: 0.3}));

      this.engine.register(this.engine.globals.base = new Base(engine), "base");
      this.engine.onMouseMove(event => {
        this.engine.globals.base.pointTo(event.pos);
      });
      
      this.engine.register(this.engine.globals.spawner = new Spawner(this.engine));

      this.menu = new UIWindow(this.engine, {
        x: 0, y: 0,
        w: this.engine.window.width, h: this.engine.window.height,
      }, [
        {
          type: "spacer",
          height: 20,
        },
        {
          type: "title",
          text: "Base Command",
          fontColor: "#0f0",
          center: true,
        },
        {
          type: "spacer",
          height: 500,
        },
        {
          type: "button",
          text: "Start",
          fontColor: "#0f0",
          center: true,
          callback: () => {
            this.menu.hide = true;
            this.engine.globals.base.on = true;
            this.engine.globals.spawner.on = true;
          },
        },
      ], {
        bgColor: "#000",
      });
      this.engine.register(this.menu);

      this.engine.register(new GameUI(this.engine));

      this.engine.on("enemyCollide", () => {
        this.menu.hide = false;
        this.engine.unregister("enemy");
        this.engine.unregister("cash");
        this.engine.unregister("projectile");
        this.engine.globals.base.on = false;
        this.engine.globals.spawner.reset();
      });
    });
  }
}