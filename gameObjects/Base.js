import GameObject from "../engine/objects/GameObject.js";
import Sprite from "../engine/gfx/Sprite.js";
import { getDirectionFrom, Coord } from "../engine/GameMath.js";
import Projectile from "./Projectile.js";

export default class Base extends GameObject {
  z = 5;
  firePos = new Coord(0, 0);
  on = false;

  constructor(engine) {
    super(engine, {
      w: 200,
      h: 300,
    });
    this.x = engine.window.width/2;
    this.y = engine.window.height;

    this.fireIn = engine.globals.stats.speed.val;

    this.sprite = new Sprite(this.engine.images.get("base").img, this.x, this.y, 1);
    this.pointTo({x: engine.window.width/2, y: 0});
  }

  update() {
    this.fireIn -= 1/60;
    if ( this.fireIn < 0 ) {
      this.fireIn += this.engine.globals.stats.speed.val;

      this.engine.sounds.play("shot", {volume: 0.5});
      setTimeout(() => 
        this.engine.register(new Projectile(
          this.engine, this.firePos.x, this.firePos.y, this.sprite.rad, 
          this.engine.globals.stats.power.val, 300
        ), "projectile"),
      150);
    }
  }

  pointTo(pointPos) {
    this.sprite.rad = getDirectionFrom(this.pos, pointPos);
    this.firePos.x = this.x + Math.cos(this.sprite.rad)*150;
    this.firePos.y = this.y + Math.sin(this.sprite.rad)*150;
  }

  draw(ctx) {
    this.sprite.draw(ctx);
  }
}