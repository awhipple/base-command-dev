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
  list = [
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
      reward: 275,
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
      reward: 2000,
    },
  ];
  _selected = 0;
  current = this.list[this._selected];

  get selected() {
    return this._selected + 1;
  }

  set selected(val) {
    val = val - 1;
    if ( val >= 0 && val <= this.list.length - 1 ) {
      this._selected = val;
      this.current = this.list[val];
    }
  }
}