import GameEngine from "./engine/GameEngine.js";
import Base from "./gameObjects/Base.js";
import Spawner from "./gameObjects/Spawner.js";
import GameUI from "./gameObjects/GameUI.js";
import TitleScreen from "./gameObjects/ui/TitleScreen.js";
import { stats, Levels } from "./gameObjects/Stats.js";

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
    this.engine.globals.cash = 0;
    this.engine.globals.stats = stats;
    this.engine.globals.levels = new Levels();

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
        this.engine.globals.levels[this.engine.globals.selectedLevel]
      ));

      this.menu = new TitleScreen(this.engine);
      this.engine.register(this.menu);

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
    });
  }
}