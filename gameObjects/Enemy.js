import GameObject from "../engine/objects/GameObject.js";
import { getDirectionFrom } from "../engine/GameMath.js";
import Text from "../engine/gfx/Text.js";
import Cash from "./Cash.js";

export default class Enemy extends GameObject {
  constructor(engine, x, y, hp) {
    super(engine, {
      x: x,
      y: y,
      radius: 35,
    });

    if ( engine.globals.base ) {
      this.dir = getDirectionFrom(this.pos, engine.globals.base.pos);
    }
    this.xv = Math.cos(this.dir);
    this.yv = Math.sin(this.dir);

    this.hp = this.cash = hp;
  }

  damage(dmg) {
    this.hp -= dmg;
    if ( this.hp <= 0 ) {
      this._createCash();
      this.engine.sounds.play("spark");
      this.engine.unregister(this);
    }
  }

  update() {
    this.x += this.xv;
    this.y += this.yv;

    if ( this.rect.y + this.rect.h > this.engine.window.height - 100 ) {
      this.engine.sounds.play("explosion");
      this.engine.trigger("enemyCollide");
    }
  }

  draw(ctx) {
    this.rect.draw(ctx);
    Text.draw(ctx, this.hp, this.x, this.y - 25, {center: true, fontColor: "#fff", fontSize: 40});
  }

  _createCash() {
    var color = "purple", amount = 500;
    while ( this.cash > 0 ) {
      if ( this.cash < 500 ) {
        color = "yellow";
        amount = 100;
      }
      if ( this.cash < 100 ) {
        color = "red";
        amount = 25;
      }
      if ( this.cash < 25 ) {
        color = "blue";
        amount = 5;
      }
      if ( this.cash < 5 ) {
        color = "green";
        amount = 1;
      }
      this.engine.register(new Cash(this.engine, this.x, this.y, amount, color), "cash");
      this.cash -= amount;
    }
  }
}