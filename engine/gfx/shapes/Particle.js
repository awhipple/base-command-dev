import Image from "../Image.js";
import GameObject from "../../objects/GameObject.js";

export default class Particle extends GameObject {
  z = 1000;

  constructor(engine, options = {start:{}}) {
    super(engine, {x: 50, y: 50, radius: 50});

    this.part = generateParticle();
    this.ctx = this.part.img.getContext("2d");
    this.ctx.globalCompositeOperation = "source-in";
    this._changeColor("red");

    this.time = 0;
    this.lifeSpan = options.lifeSpan ?? 1;

    this.initial = options.start;
    this._setState(this.initial);
    
    this.stateDelta = {};
    for(var key in options.start) {
      if ( typeof options.start[key] === "number" && typeof options.end[key] === "number" ) {
        this.stateDelta[key] = options.end[key] - options.start[key];
      }
    }
  }

  update(ctx) {
    this.time += 1/60;
    if ( this.time > this.lifeSpan ) {
      this.engine.unregister(this);
    }
    this._setState(this._generateDeltaState(this.time / this.lifeSpan));
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.col;
    this.ctx.fillRect(0, 0, 100, 100);
    this.part.draw(ctx, this.rect);
    ctx.restore();
  }

  get r() {
    return this._r;
  }

  set r(val) {
    this._r = val;
    this._changeColor(this.r, this.g, this.b);
  }
  
  get g() {
    return this._g;
  }

  set g(val) {
    this._g = val;
    this._changeColor(this.r, this.g, this.b);
  }

  get b() {
    return this._b;
  }

  set b(val) {
    this._b = val;
    this._changeColor(this.r, this.g, this.b);
  }

  _changeColor() {
    this.col = "rgb("+this.r+","+this.g+","+this.b+")";
  }

  _setState(state) {
    for ( var key in state ) {
      this[key] = state[key];
    }
  }

  _generateDeltaState(delta) {
    var newDeltaState = {};
    for ( var key in this.stateDelta ) {
      newDeltaState[key] = this.initial[key] + this.stateDelta[key] * delta;
    }
    return newDeltaState;
  }
}

function generateParticle(size = 100) {
  if ( generateParticle.particle ) {
    return generateParticle.particle;
  }

  var can = document.createElement("canvas");
  can.width = can.height = size;
  var ctx = can.getContext("2d");
  var iData = ctx.getImageData(0, 0, size, size);
  var data = iData.data;

  var i = 0, center = size / 2;
  for ( var y = 0; y < size; y++ ) {
    for ( var x = 0; x < size; x++ ) {
      var dist = Math.sqrt(Math.pow(x-center, 2) + Math.pow(y-center, 2));
      
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.max((center - dist) / center, 0) * 255;

      i += 4;
    }
  }

  ctx.putImageData(iData, 0, 0);
  return generateParticle.particle = new Image(can);
}