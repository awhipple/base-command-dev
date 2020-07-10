import GameObject from "../engine/objects/GameObject.js";
import { slideDirectionTowards, getDirectionFrom } from "../engine/GameMath.js";
import FadeLine from "./FadeLine.js";

export default class Cash extends GameObject {
  z = 3;

  value = 1;
  maxSpeed = 300;
  accel = 5;

  color = "#5b5";
  hideBorder = true;

  constructor(engine, x, y) {
    super(engine, {x: x, y: y, radius: 3});

    this.dir = Math.random()*Math.PI*2;
    this.speed = Math.random()*200+100;

    this.base = engine.globals.base;

    this.onCollision(() => this._collect(), "base");
  }

  update() {
    if ( this.offScreen() ) {
      this._collect();
    }

    this.speed = Math.min(this.speed + this.accel, this.maxSpeed);

    var oldX = this.x;
    var oldY = this.y;

    this.x += Math.cos(this.dir)*this.speed/60;
    this.y += Math.sin(this.dir)*this.speed/60;

    this.engine.register(new FadeLine(this.engine, {
      x1: oldX, y1: oldY,
      x2: this.x, y2: this.y,
    }));

    this.dir = slideDirectionTowards(this.dir, getDirectionFrom(this.pos, this.base.pos), 1/20);
  }

  _collect() {
    if ( this.pos.distanceToLessThan(this.base.pos, 50) || this.offScreen()) {
      this.engine.globals.cash += this.value;
      this.engine.unregister(this);
    }
  }
}