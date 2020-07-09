import GameObject from "../engine/objects/GameObject.js";
import Sprite from "../engine/gfx/Sprite.js";
import { getDirectionFrom } from "../engine/GameMath.js";

export default class Base extends GameObject {
  constructor(engine) {
    super(engine, {
      w: 200,
      h: 300,
    });
    this.x = engine.window.width/2;
    this.y = engine.window.height;

    this.sprite = new Sprite(this.engine.images.get("base").img, this.x, this.y, 1);
    this.sprite.rad = 3*Math.PI/2;
  }

  pointTo(pointPos) {
    this.sprite.rad = getDirectionFrom(this.pos, pointPos);
  }

  draw(ctx) {
    this.sprite.draw(ctx);
  }
}