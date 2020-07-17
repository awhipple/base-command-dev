import GameObject from "../engine/objects/GameObject.js"
import Circle from "../engine/gfx/shapes/Circle.js";
import Sprite from "../engine/gfx/Sprite.js";

export default class Projectile extends GameObject {
  z = 1;

  constructor(engine, x, y, dir, damage = 1, speed = 60, options = {}) {
    super(engine, {
      x: x,
      y: y,
      radius: 10,
    });

    this.damage = damage;

    this.dir = dir;
    this.xv = Math.cos(dir) * (speed / 60);
    this.yv = Math.sin(dir) * (speed / 60);

    if ( options.image ) {
      this.sprite = new Sprite(options.image.img, this.x, this.y, 0.8);
      this.sprite.rad = dir;
    } else {
      this.circle = new Circle(this.pos, 10, {color: "#fff"});
    }

    this.onCollision(target => {
      target.damage(this.damage);
      this.engine.unregister(this);
    }, "enemy");

    this.options = options;
  }

  update() {
    this.x += this.xv;
    this.y += this.yv;

    if ( this.offScreen() ) {
      this.engine.unregister(this);
    }
  }

  draw(ctx) {
    if ( this.sprite ) {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
      this.sprite.draw(ctx);
    } else {
      this.circle.draw(ctx);
    }
  }
}