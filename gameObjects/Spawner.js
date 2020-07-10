import Enemy from "./Enemy.js";

export default class Spawner {
  spawnRate = 1;
  nextSpawn = this.spawnRate;

  enemyHp = 1;

  constructor(engine) {
    this.engine = engine;
  }

  update() {
    this.nextSpawn -= 1/60;
    if ( this.nextSpawn < 0 ) {
      this.nextSpawn += this.spawnRate;

      this.engine.register(new Enemy(
        this.engine, 
        Math.random()*(this.engine.window.width+200)-100,
        this.enemyHp), 
      "enemy");

      this.enemyHp++;
    }
  }
}