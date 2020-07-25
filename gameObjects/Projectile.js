import GameObject from "../engine/objects/GameObject.js"
import Sprite from "../engine/gfx/Sprite.js";
import { getDirectionFrom, slideDirectionTowards } from "../engine/GameMath.js";

export default class Projectile extends GameObject {
  z = 1;
  alpha = 1;

  constructor(engine, x, y, dir, damage = 1, speed = 60, options = {}) {
    super(engine, {
      x: x,
      y: y,
      radius: 10,
    });

    this.damage = damage;
    this.speed = speed;
    this.dir = dir;

    this.homing = options.homing ?? false;
    this.target = null;
    this.targetRecompute = 0;

    this.lifeSpanTicks = options.lifeSpan ? options.lifeSpan * 60 : null;

    this.sprite = new Sprite(options.image.img, this.x, this.y, options.scale ?? 1);
    this.sprite.rad = dir;

    this.onCollision(target => {
      target.damage(this.damage);
      this.engine.unregister(this);
    }, "enemy");

    this.options = options;
  }

  update() {
    this.x += this.xv;
    this.y += this.yv;

    if ( this.offScreen(100) ) {
      this.engine.unregister(this);
    }

    if ( this.homing ) {
      this.recomputeTarget--;
      if ( this.recomputeTarget === 0 || !this.target ) {
        this.recomputeTarget = 10;
        if ( this.target?.dead ) {
          this.target = null;
        }
        var closest = null;
        engine.getObjects("enemy").forEach(enemy => {
          if ( closest === null || this.pos.squaredDistanceTo(enemy.pos) < closest) {
            closest = this.pos.squaredDistanceTo(enemy.pos);
            this.target = enemy;
          }
        });
      }

      if ( this.target ) {
        this.dir = slideDirectionTowards(this.dir, getDirectionFrom({x: this.x, y: this.y}, this.target.pos), 0.02);
        if ( this.sprite ) {
          this.sprite.rad = this.dir;
        }
      }
    }

    if ( this.lifeSpanTicks ) {
      this.lifeSpanTicks--;
      this.alpha = Math.min(this.lifeSpanTicks / 10, 1);
      if ( this.lifeSpanTicks === 0 ) {
        this.engine.unregister(this);
      }
    }
  }

  draw(ctx) {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    if ( this.sprite.alpha !== this.alpha ) {
      this.sprite.alpha = this.alpha;
    }
    this.sprite.draw(ctx);
  }

  get dir() {
    return this._dir;
  }

  set dir(val) {
    this._dir = val;

    if ( !this.speed ) {
      console.log("Projectile created with no speed");
      throw("Projectile created with no speed");
    }
    this.xv = Math.cos(this.dir) * (this.speed / 60);
    this.yv = Math.sin(this.dir) * (this.speed / 60);
  }
}