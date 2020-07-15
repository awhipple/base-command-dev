import Enemy from "./Enemy.js";
import Image from "../engine/gfx/Image.js";

export let stats = {
  power: {
    lvl: 1,
    val: 1,
    next: (lvl) => lvl + 1,
    cost: (lvl) => Math.floor(10 * Math.pow(lvl, 2.5)),
  },
  speed: {
    lvl: 1,
    val: 1,
    next: (lvl) => Math.floor((lvl * 0.1)*10)/10 + 1,
    cost: (lvl) => Math.floor(Math.pow(lvl/10+1, 4)),
  }
}

export class Levels { 
  constructor(engine) {
    this.engine = engine;
    this.list = [
      {
        enemies: 10,
        spawnRate: 0.5,
        enemyHp: 2,
        reward: 20,
      },
      {
        enemies: 10,
        spawnRate: 0.5,
        enemyHp: 6,
        reward: 60,
      },
      {
        enemies: 20,
        spawnRate: 0.5,
        enemyHp: 15,
        reward: 300,
      },
      {
        enemies: 25,
        spawnRate: 0.5,
        enemyHp: 25,
        reward: 750,
      },
      {
        enemies: 30,
        spawnRate: 0.5,
        enemyHp: 60,
        reward: 1800,
      },
    ];

    this.selected = 1;
  }

  get selected() {
    return this._selected + 1;
  }

  set selected(val) {
    val = val - 1;
    if ( val >= 0 && val <= this.list.length - 1 ) {
      this._selected = val;
      this.current = this.list[val];
      if ( !this.current.icon ) {
        var icon = document.createElement("canvas");
        icon.width = 70;
        icon.height = 70;
        (new Enemy(this.engine, 35, 35, this.current.enemyHp)).draw(icon.getContext("2d"));
        this.current.icon = new Image(icon);
      }
    }
  }
}