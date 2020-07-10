import GameObject from "../engine/objects/GameObject.js"
import Circle from "../engine/gfx/shapes/Circle.js";

export default class Projectile extends GameObject {
  z = 1;
  damage = 1;

  constructor(engine, x, y, dir, speed = 60) {
    super(engine, {
      x: x,
      y: y,
      radius: 10,
    });

    this.dir = dir;
    this.xv = Math.cos(dir) * (speed / 60);
    this.yv = Math.sin(dir) * (speed / 60);

    this.circle = new Circle(this.pos, 10, {color: "#fff"});

    this.onCollision(target => {
      target.damage(this.damage);
      this.engine.unregister(this);
    }, "enemy");
  }

  update() {
    this.x += this.xv;
    this.y += this.yv;

    if ( this.offScreen() ) {
      this.engine.unregister(this);
    }
  }

  draw(ctx) {
    this.circle.draw(ctx);
  }
}