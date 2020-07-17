import GameObject from "../engine/objects/GameObject.js";
import Item from "./Item.js";
import { BoundingRect, constrain } from "../engine/GameMath.js";

export default class Reward extends GameObject {
  z = 110;
  time = 3.5;
  alpha = 0;
  pulseRate = 0.3;
  nextPulse = 0;
  pulses = [];

  constructor(engine, item) {
    super(engine, {x: engine.window.width/2, y: engine.window.height/2, radius: Item.ICON_SIZE/2});
    this.item = item;
  }

  update() {
    this.alpha = Math.min(this.alpha + 0.01, 1);
    
    this.nextPulse -= 1/60;
    if ( this.nextPulse <= 0 ) {
      this.nextPulse += this.pulseRate;
      this.pulses.push(new BoundingRect(this.rect.x, this.rect.y, this.rect.h, this.rect.w));
      this.pulses[this.pulses.length-1].alpha = 1;
    }
    this.pulses.forEach(pulse => {
      pulse.x--;
      pulse.y--;
      pulse.w += 2;
      pulse.h += 2;
    });
    this.pulses = this.pulses.filter(pulse => pulse.alpha > 0);

    this.time -= 1/60;
    this.alpha = constrain(this.time, 0, 1);

    if ( this.time < 1.5 ) {
      this.xv = this.xv ?? 0;
      this.xv += 0.15;
      this.x += this.xv;
    }

    if ( this.time <= 0 ) {
      this.engine.unregister(this);
    }
  }

  draw(ctx) {
    this.rect.draw(ctx, this.item.borderColor, "black", this.alpha);
    this.item.icon.draw(ctx, this.rect, { alpha: this.alpha });

    this.pulses.forEach(pulse => {
      pulse.alpha = Math.max((100-pulse.w) / 100, 0);
      pulse.draw(ctx, "yellow", undefined, pulse.alpha * this.alpha);
    });
  }
}