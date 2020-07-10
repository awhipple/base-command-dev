import GameObject from "../engine/objects/GameObject.js";
import { slideDirectionTowards, getDirectionFrom } from "../engine/GameMath.js";

export default class Cash extends GameObject {
  z = 3;

  value = 1;
  maxSpeed = 300;
  accel = 5;

  constructor(engine, x, y) {
    super(engine, {x: x, y: y, radius: 3});

    this.dir = Math.random()*Math.PI*2;
    this.speed = Math.random()*200+100;

    this.base = engine.globals.base;

    this.onCollision(target => {
      if ( this.pos.distanceToLessThan(this.base.pos, 50) ) {
        this.engine.globals.cash += this.value;
        this.engine.unregister(this);
      }
    }, "base");
  }

  update() {
    this.speed = Math.min(this.speed + this.accel, this.maxSpeed);

    this.x += Math.cos(this.dir)*this.speed/60;
    this.y += Math.sin(this.dir)*this.speed/60;

    this.dir = slideDirectionTowards(this.dir, getDirectionFrom(this.pos, this.base.pos), 1/20);
  }
}