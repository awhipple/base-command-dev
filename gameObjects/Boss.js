import Enemy from "./Enemy.js";

export default class Boss extends Enemy {
  constructor(engine, hp) {
    super(engine, engine.window.width/2, -100, hp, "purple");
  }
  
  draw(ctx) {
    super.draw(ctx);
  }
}