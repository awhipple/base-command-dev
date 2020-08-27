import GameObject from "../node_modules/avocado2d/objects/GameObject.js"
import { getDirectionFrom, slideDirectionTowards } from "../node_modules/avocado2d/engine/GameMath.js";
import DamageText from "./effects/DamageText.js";
import Lightning from "../node_modules/avocado2d/gfx/effects/Lightning.js";
import Particle from "../node_modules/avocado2d/gfx/shapes/Particle.js";

export default class Projectile extends GameObject {
  z = 1;

  constructor(engine, x, y, dir, damage = 1, speed = 60, options = {}) {
    super(engine, {
      x: x,
      y: y,
      radius: 10,
    });

    this.damage = damage;
    this.speed = speed;
    this.dir = dir;

    this.scaleDown = options.scaleDown ?? false;

    this.homing = options.homing ?? false;
    this.target = null;
    this.targetRecompute = 0;

    this.trail = options.trail;

    this.img = options.image;

    this.onCollision(target => {
      this.hit = true;
      target.damage(this.damage);
      this.engine.register(new DamageText(this.engine, this.damage, this.x, this.y));
      this.engine.unregister(this);
    }, "enemy");

    this.options = options;

    this.ray = options.ray;
    if ( this.ray ) {
      this.hide = true;
      var target = null, point = null;
      engine.getObjects("enemy").forEach(enemy => {
        var inter = enemy.lineIntercept(x, y, dir);
        if ( inter && (!point || inter.y > point.y) ) {
          target = enemy;
          point = inter;
        }
      });
      if ( point ) {
        this.hit = true;
        this.engine.register(new Lightning(engine, {
          x1: this.x, y1: this.y,
          x2: point.x, y2: point.y,
          fade: 0.5,
          innerCol: options.innerCol ?? "yellow",
          outerCol: options.outerCol ?? "orange",
        }));
        target.damage(this.damage, {type: "lightning", chain: options.chain ?? 2, weaken: 0.5, innerCol: options.innerCol, outerCol: options.outerCol});
        engine.register(new DamageText(this.engine, this.damage, point.x, point.y));
      }
    }
  }

  update() {
    if ( this.ray ) {
      this.engine.unregister(this);
      return;
    }

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
        this.engine.getObjects("enemy").forEach(enemy => {
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
    
    if ( this.trail ) {
      this.nextTrail = this.nextTrail ?? 0;
      this.nextTrail -= 1/60;
      if ( this.nextTrail <= 0 ) {
        this.nextTrail += 1/30;
        this.engine.register(new Particle(
          {
            start: {
              x: this.x, y: this.y,
              radius: 17,
              alpha: 0.6,
              ...Projectile.TRAIL[this.trail],
            },
            end: {
              radius: 5,
              alpha: 0,
            },
            lifeSpan: 0.5,
          }
        ));
      }
    }

  }

  draw(ctx) {
    if ( this.sprite ) {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }
    this.img.draw(ctx, this.rect.grow(this.scaleDown ? 0 : 15));
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

  static TRAIL = {
    white: {r: 255, g: 255, b: 255},
    smallWhite: {r: 255, g: 255, b: 255, radius: 8},
    
    blue: {r: 0, g: 128, b: 255},
    smallBlue: {r: 0, g: 128, b: 255, radius: 8},
  };
}