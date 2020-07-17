import Enemy from "./Enemy.js";

export default class Boss extends Enemy {
  constructor(engine, hp) {
    super(engine, engine.window.width/2, -100, hp, "purple");
    this.rect.x = this.rect.x - 50;
    this.rect.y = this.rect.y - 50;
    this.rect.w = this.rect.w + 100;
    this.rect.h = this.rect.h + 100;
    this.img = engine.images.get("dragon-green");
  }
  
  draw(ctx) {
    this.img.draw(ctx, this.rect);
  }
}