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

export let levels = [
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