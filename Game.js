import GameEngine from "./engine/GameEngine.js";
import Base from "./gameObjects/Base.js";
import Spawner from "./gameObjects/Spawner.js";
import GameUI from "./gameObjects/ui/GameUI.js";
import TitleScreen from "./gameObjects/ui/TitleScreen.js";
import stats from "./gameObjects/Stats.js";
import Levels from "./gameObjects/Levels.js";
import { constrain } from "./engine/GameMath.js";
import InventoryMenu from "./gameObjects/ui/InventoryMenu.js";
import Inventory from "./gameObjects/Inventory.js";
import Cursor from "./gameObjects/Cursor.js";
import Reward from "./gameObjects/Reward.js";
import Circle from "./engine/gfx/shapes/Circle.js";
import Item from "./gameObjects/Item.js";

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
    this.engine.images.preload([
      "base", "dragon-green",
      "blue-gem", "green-gem", "red-gem", "white-gem",
    ]);
    this.engine.sounds.preload([
      "shot", "spark", "explosion", "chime",
      "lakitunes_chilled-beat.mp3",
      "tsuwami_generic-fighting-game-music.mp3"
    ]);
    this.engine.sounds.alias("music", "tsuwami_generic-fighting-game-music");

    ["white", "blue"].forEach(color => {
      this.engine.images.save(this.generateCircleImage(10, color), color + "-circle");
      this.engine.images.save(this.generateTriangleImage(15, color), color + "-triangle");
      this.engine.images.save(this.generateRapidIcon(color), color + "-rapid-icon");
    });
    
    this.engine.globals.cash = this.engine.prod ? 0 : 50000;
    this.engine.globals.stats = stats;
    this.engine.globals.levels = new Levels(this.engine);

    this.engine.load().then(() => {
      if ( this.engine.prod ) {
        this.engine.on("firstInteraction", () => this.engine.sounds.play("music", {loop: true, volume: 0.6}));
      }
      
      this.inventory = this.engine.globals.inventory = new Inventory(engine);
      Item.NONE.engine = this.engine;
      
      this.engine.register(this.engine.globals.base = new Base(engine), "base");
      
      this.engine.register(this.engine.globals.spawner = new Spawner(
        this.engine, 
      ));

      this.menu = new TitleScreen(this.engine);
      this.engine.register(this.menu);

      this.engine.register(new Cursor(this.engine));

      this.inventoryMenu = new InventoryMenu(this.engine, this.inventory);
      this.engine.register(this.inventoryMenu);
      this.invSlide = this.engine.prod ? 20 : -20;

      this.engine.register(new GameUI(this.engine));

      this.engine.on("enemyCollide", () => {
        this.menu.hide = false;
        this.inventoryMenu.hide = false;
        this.engine.unregister("enemy");
        this.engine.unregister("projectile");
        this.engine.globals.base.on = false;
        this.engine.globals.spawner.reset();
      });

      this.engine.on("startGame", () => {
        this.menu.hide = true;
        this.inventoryMenu.hide = true;
        this.engine.globals.base.on = true;
        this.engine.globals.spawner.start();
      });

      this.engine.on("levelWin", () => {
        this.menu.hide = false;
        this.inventoryMenu.hide = false;
        this.engine.unregister("projectile");
      });

      this.engine.on("closeInventory", () => {
        this.invSlide = 20;
        this.invHide = true;
      });

      this.engine.on("openInventory", () => {
        this.invSlide = -20;
      });

      this.engine.on("displayReward", (item) => {
        this.engine.register(new Reward(this.engine, item));
      });

      this.engine.onUpdate(() => {
        this.inventoryMenu.originX = constrain(this.inventoryMenu.originX + this.invSlide, 0, this.engine.window.width);
        if ( this.invHide && this.inventoryMenu.originX === this.engine.window.width ) {
          this.inventoryMenu.hideComponents();
          this.invHide = false;
        }
      });
    });
  }

  generateCircleImage(radius, color = "white") {
    var img = document.createElement("canvas");
    img.width = img.height = radius*2;
    var ctx = img.getContext("2d");

    Circle.draw(ctx, radius, radius, radius, {
      color: color,
    });

    return img;
  }

  generateTriangleImage(size, color = "white") {
    var img = document.createElement("canvas");
    img.width = img.height = size;
    var ctx = img.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size/2);
    ctx.lineTo(0, size);
    ctx.lineTo(0, 0);
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fill();

    return img;
  }

  generateRapidIcon(color = "white") {
    var img = document.createElement("canvas");
    img.width = img.height = 100;
    var ctx = img.getContext("2d");

    ctx.beginPath();
    [{x: 30, y: 16}, {x: 70, y: 56}].forEach(pos => {
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + 12, pos.y + 24);
      ctx.lineTo(pos.x - 12, pos.y + 24);
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();
  
      ctx.fillStyle = color;
      ctx.fill();
    });

    return img;
  }
}