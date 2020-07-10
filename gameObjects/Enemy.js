import GameObject from "../engine/objects/GameObject.js";
import { getDirectionFrom } from "../engine/GameMath.js";
import Text from "../engine/gfx/Text.js";
import Cash from "./Cash.js";

export default class Enemy extends GameObject {
  constructor(engine, x, hp) {
    super(engine, {
      x: x,
      y: -50,
      radius: 35,
    });

    this.dir = getDirectionFrom(this.pos, engine.globals.base.pos);
    this.xv = Math.cos(this.dir);
    this.yv = Math.sin(this.dir);

    this.hp = this.cash = hp;
  }

  damage(dmg) {
    this.hp -= dmg;
    if ( this.hp <= 0 ) {
      for ( var i = 0; i < this.cash; i++ ) {
        this.engine.register(new Cash(this.engine, this.x, this.y));
      }
      this.engine.unregister(this);
    }
  }

  update() {
    this.x += this.xv;
    this.y += this.yv;
  }

  draw(ctx) {
    this.rect.draw(ctx);
    Text.draw(ctx, this.hp, this.x, this.y - 25, {center: true, fontColor: "#fff", fontSize: 40})
  }
}