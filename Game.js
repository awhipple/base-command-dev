import GameEngine from "./engine/GameEngine.js";
import Base from "./gameObjects/Base.js";
import Spawner from "./gameObjects/Spawner.js";
import GameUI from "./gameObjects/ui/GameUI.js";
import TitleScreen from "./gameObjects/ui/TitleScreen.js";
import { stats, Levels } from "./gameObjects/Stats.js";
import Inventory from "./gameObjects/ui/Inventory.js";
import { constrain } from "./engine/GameMath.js";

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
    this.engine.sounds.preload(["shot", "spark", "explosion", "chime", "lakitunes_chilled-beat.mp3"]);
    this.engine.sounds.alias("music", "lakitunes_chilled-beat");

    this.engine.globals.cash = this.engine.prod ? 10000 : 50000;
    this.engine.globals.stats = stats;
    this.engine.globals.levels = new Levels(this.engine);

    this.engine.load().then(() => {
      if ( this.engine.prod ) {
        this.engine.on("firstInteraction", () => this.engine.sounds.play("music", {loop: true, volume: 0.3}));
      }
      this.engine.register(this.engine.globals.base = new Base(engine), "base");
      this.engine.onMouseMove(event => {
        this.engine.globals.base.pointTo(event.pos);
      });
      
      this.engine.register(this.engine.globals.spawner = new Spawner(
        this.engine, 
      ));

      this.menu = new TitleScreen(this.engine);
      this.engine.register(this.menu);

      this.inventory = new Inventory(this.engine);
      // this.engine.register(this.inventory);
      this.invSlide = 0;

      this.engine.register(new GameUI(this.engine));

      this.engine.on("enemyCollide", () => {
        this.menu.hide = false;
        this.engine.unregister("enemy");
        this.engine.unregister("projectile");
        this.engine.globals.base.on = false;
        this.engine.globals.spawner.reset();
      });

      this.engine.on("levelWin", () => {
        this.menu.hide = false;
      });

      this.engine.on("closeInventory", () => {
        this.invSlide = 20;
      });

      this.engine.onUpdate(() => {
        this.inventory.originX = constrain(this.inventory.originX + this.invSlide, 0, this.engine.window.width);
      });
    });
  }
}