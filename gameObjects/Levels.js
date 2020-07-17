import Enemy from "./Enemy.js";
import Image from "../engine/gfx/Image.js";
import Item from "./Item.js";

export default class Levels {
  constructor(engine) {
    this.engine = engine;
    this.list = [
      {
        enemies: 10,
        spawnRate: 0.5,
        enemyHp: 2,
      },
      {
        enemies: 10,
        spawnRate: 0.5,
        enemyHp: 6,
        reward: "whiteGem",
        chance: 5,
      },
      {
        enemies: 20,
        spawnRate: 0.5,
        enemyHp: 15,
        reward: "whiteGem",
        chance: 15,
      },
      {
        enemies: 25,
        spawnRate: 0.5,
        enemyHp: 25,
        reward: "whiteGem",
        chance: 25,
      },
      {
        enemies: 25,
        enemyType: "red",
        spawnRate: 0.5,
        enemyHp: 20,
        reward: "whiteGem",
        chance: 40,
      },
      {
        icon: engine.images.get("dragon-green"),
        enemies: 25,
        spawnRate: 1,
        enemyHp: 100,
        boss: true,
        reward: "whiteGem",
        chance: 100,
      },
    ];

    this.selected = 1;
  }

  rollForReward() {
    if ( this.current.reward && Math.random() * 100 < this.current.chance) {
      var item = new Item(this.engine, this.current.reward);
      this.engine.globals.inventory.add(item);
      this.engine.trigger("displayReward", item);
    }
  }

  get selectedReward() {
    if ( this.current.reward && !this.current.rewardIcon ) {
      this.current.rewardIcon = (new Item(this.engine, this.current.reward)).icon;
    }
    return this.current.rewardIcon;
  }

  get selected() {
    return this._selected + 1;
  }

  set selected(val) {
    val = val - 1;
    if ( val >= 0 && val <= this.list.length - 1 ) {
      this._selected = val;
      this.current = this.list[val];
      this.current.cash = this.current.cash ?? this.current.enemies * this.current.enemyHp * (this.current.enemyType === "red" ? 2 : 1);
      if ( !this.current.icon ) {
        var icon = document.createElement("canvas");
        icon.width = 70;
        icon.height = 70;
        (new Enemy(this.engine, 35, 35, this.current.enemyHp, this.current.enemyType)).draw(icon.getContext("2d"));
        this.current.icon = new Image(icon);
      }
    }
  }
}