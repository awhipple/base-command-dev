import { BoundingRect } from "../../node_modules/avocado2d/engine/GameMath.js";

export default class EffectRect extends BoundingRect {
  z = 200;
  alpha = 1;

  constructor(engine, rect, options = {}) {
    super(rect.x, rect.y, rect.w, rect.h);

    this.engine = engine;

    this.icon = options.icon;
    this.grow = options.grow ?? null;
    this.fade = options.fade ?? null;
    this.color = options.color ?? "white";
  }

  pulse(color, stepTime = 1) {
    this.mask = {
      color: color,
      stepTime: stepTime,
      alpha: 0,
      alphaDir: 1,
    }
  }

  changeStateIn(time, state) {
    this.changeStateTime = time;
    this.nextState = state;
  }

  update() {
    if ( this.grow ) {
      this.x -= this.grow;
      this.y -= this.grow;
      this.w += this.grow * 2;
      this.h += this.grow * 2;
    }

    if ( this.fade ) {
      this.alpha -= this.fade;
      if ( this.alpha <= 0 ) {
        this.engine.unregister(this);
      }
    }

    if ( this.mask ) {  
      this.mask.alpha += this.mask.alphaDir / (60.0 * this.mask.stepTime);

      if ( this.mask.alpha >= 3 ) {
        this.mask.alpha = 1;
        this.mask.alphaDir = -1;
      }

      if ( this.mask.alpha <= 0 ) {
        this.mask = null;
      }
    }

    if ( this.changeStateTime ) {
      this.changeStateTime -= 1/60;
      if ( this.changeStateTime <= 0 ) {
        this.changeStateTime = null;
        Object.assign(this, this.nextState);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    
    ctx.globalAlpha = this.alpha;
    this.icon?.draw(ctx, this);

    super.draw(ctx, this.color, undefined, this.alpha);
    
    if( this.mask ) {
      ctx.globalAlpha = this.mask.alpha;
      ctx.fillStyle = this.mask.color;
      ctx.fillRect(this.x-1, this.y-1, this.w+2, this.h+2);
    }

    ctx.restore();
  }
}