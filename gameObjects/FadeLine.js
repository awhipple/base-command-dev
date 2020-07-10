import GameObject from "../engine/objects/GameObject.js";

export default class FadeLine {
  z = 4;
  alpha = 0.5;
  
  constructor(engine, line) {
    this.engine = engine;
    this.line = line;
  }

  update() {
    this.alpha -= 1/15;
    if ( this.alpha < 0 ) {
      this.engine.unregister(this);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#0f0";
    ctx.moveTo(this.line.x1, this.line.y1);
    ctx.lineTo(this.line.x2, this.line.y2);
    ctx.stroke();
    ctx.restore();
  }
}