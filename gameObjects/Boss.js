import Enemy from "./Enemy.js";
import { BoundingRect } from "../engine/GameMath.js";

export default class Boss extends Enemy {
  constructor(engine, hp) {
    super(engine, engine.window.width/2, -100, hp, "purple");
    this.rect.x = this.rect.x - 30;
    this.rect.y = this.rect.y - 30;
    this.rect.w = this.rect.w + 60;
    this.rect.h = this.rect.h + 60;
    this.img = engine.images.get("dragon-green");

    this.sizeBoost = 30;
  }
  
  draw(ctx) {
    
    this.img.draw(
      ctx, 
      this.rect.x - this.sizeBoost, this.rect.y - this.sizeBoost,
      this.rect.w + this.sizeBoost*2, this.rect.h + this.sizeBoost*2);
  }
}