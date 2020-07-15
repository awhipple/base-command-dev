import Image from "./Image.js";

export default class Text {
  static _singleton = new Text('', 0, 0);

  alpha = 1;

  constructor(str, x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.center = options.center;


    this.fontWeight = options.fontWeight ? options.fontWeight + ' ' : '';
    this.fontSize = options.fontSize ?? 50;
    this.fontStyle = options.fontStyle ?? "Arial";
    this.fontColor = options.fontColor ?? "#000";

    this._updateStyle();
    this.setText(str);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = this.style;
    var xShow = this.x - (this.center ? ctx.measureText(this.str).width/2 : 0);
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.str, xShow, this.y + this.fontSize);
    ctx.restore();
  }

  static draw(ctx, str, x, y, options = {}) {
    this._singleton.setText(str);
    this._singleton.x = x;
    this._singleton.y = y;
    this._singleton.fontSize = options.fontSize ?? 50;
    this._singleton.fontWeight = options.fontWeight ? options.fontWeight + ' ' : '';
    this._singleton.fontColor = options.fontColor ?? "#000";
    this._singleton.center = options.center ?? false;
    this._singleton._updateStyle();
    this._singleton.draw(ctx);
  }

  getWidth(ctx) {
    ctx.font = this.style;
    return ctx.measureText(this.str).width;
  }

  setText(str) {
    this.str = str;

    this._updateImage();
  }

  asImage(width, height) {
    if ( !this.textImage ) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      this.draw(ctx);
      this.textImage = new Image(canvas);
    }

    return this.textImage;    
  }

  get fontSize() {
    return this._fontSize;
  }

  set fontSize(val) {
    this._fontSize = val;
    this._updateStyle();
  }

  get fontColor() {
    return this._fontColor;
  }

  set fontColor(val) {
    this._fontColor = val;
    this._updateStyle();
  }

  _updateStyle() {
    this.style = this.fontWeight + this.fontSize + "px " + this.fontStyle;
  }

  _updateImage() {
    if ( this.textImage ) {
      var ctx = this.textImage.img.getContext("2d");
      ctx.clearRect(0, 0, 400, 400);
      this.draw(ctx);
    }
  }
}