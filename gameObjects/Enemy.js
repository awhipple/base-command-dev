import GameObject from "../engine/objects/GameObject.js";
import { getDirectionFrom } from "../engine/GameMath.js";
import Text from "../engine/gfx/Text.js";
import Cash from "./Cash.js";
import Lightning from "../engine/gfx/effects/Lightning.js";
import DamageText from "./effects/DamageText.js";

export default class Enemy extends GameObject {
  constructor(engine, x, y, hp, type = "white", initialXv = 0) {
    super(engine, {
      x: x,
      y: y,
      radius: 35,
    });
    this.type = type;
    this.initialXv = initialXv;

    if ( engine.globals.base ) {
      this.dir = getDirectionFrom(this.pos, engine.globals.base.pos);
    }

    this.hp = this.cash = hp;
  }

  damage(dmg, type) {
    this.hp -= dmg;
    if ( this.hp <= 0 ) {
      if ( this.type === "red" ) {
        this.engine.register(new Enemy(this.engine, this.x, this.y, Math.floor(this.cash/2), "white", -10), "enemy");
        this.engine.register(new Enemy(this.engine, this.x, this.y, Math.floor(this.cash/2), "white", 10), "enemy");
      }
      this._createCash();
      this.engine.sounds.play("spark");
      this.engine.unregister(this);
    } 
    if (type?.type === "lightning") {
      this.engine.register(Lightning.rect(this.engine, this.rect, {fade: 0.5}));
      type.hit = type.hit ?? [];
      type.hit.push(this);
      if ( type.chain > 0 ) {
        var closestEnemy, closestDist;
        this.engine.getObjects("enemy").forEach(enemy => {
          var sqDist = this.pos.squaredDistanceTo(enemy.pos);
          if ( type.hit.indexOf(enemy) === -1 && (!closestEnemy || sqDist < closestDist) ) {
            closestDist = sqDist;
            closestEnemy = enemy;
          }
        });
        if ( closestEnemy ) {
          var totalDamage = dmg * (type.weaken ?? 1);
          closestEnemy.damage(totalDamage, {type: "lightning", chain: type.chain - 1, hit: type.hit});
          var enemyDir = getDirectionFrom(this.pos, closestEnemy.pos);
          var point1 = this.lineIntercept(closestEnemy.x, closestEnemy.y, enemyDir + Math.PI);
          var point2 = closestEnemy.lineIntercept(this.x, this.y, enemyDir);
          this.engine.register(new Lightning(this.engine, {
            x1: point1.x, y1: point1.y,
            x2: point2.x, y2: point2.y,
            fade: 0.5,
          }));
          engine.register(new DamageText(this.engine, totalDamage, point2.x, point2.y));
        }
      }
    }
  }

  update() {
    this.x += this.xv + this.initialXv;
    this.y += this.yv;

    this.initialXv *= 0.9;
    var absInitialXv = Math.abs(this.initialXv);
    if ( absInitialXv < 0.05 && absInitialXv > 0 ) {
      this.initialXv = 0;
      this.dir = getDirectionFrom(this.pos, engine.globals.base.pos);

    }

    if ( this.rect.y + this.rect.h > this.engine.window.height - 100 ) {
      this.engine.sounds.play("explosion");
      this.engine.trigger("enemyCollide");
    }
  }

  unregister() {
    this.dead = true;
  }

  draw(ctx) {
    this.rect.draw(ctx, this.type);
    Text.draw(ctx, Math.ceil(this.hp), this.x, this.y - 25, {center: true, fontColor: this.type, fontSize: 40});
  }

  get dir() {
    return this._dir;
  }

  set dir(val) {
    this._dir = val;
    this.xv = Math.cos(this.dir);
    this.yv = Math.sin(this.dir);
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