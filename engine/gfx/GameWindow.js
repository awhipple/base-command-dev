import Text from "./Text.js";

export default class GameWindow {
  fpsUpdateNext = (new Date()).getTime() + 1000;
  frames = 0;
  fps = 0;

  constructor(engine, canvasId, gameObjects) {
    this.engine = engine;
    this.objects = gameObjects;
    
    this.canvas = document.getElementById(canvasId);
    this.canvas.oncontextmenu = () => false;
    this.canvas.style = "width: 100%; height: 100%;"
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");

    this.fpsText = new Text("", 15, 0, {fontColor: "#050"});
    engine.onKeyPress(evt => {
      if ( evt.key === "f" ) {
        this.showFps = !this.showFps;
      }
    });

    requestAnimationFrame(() => this.draw());
  }

  draw() {
    this.frames++;
    var time = (new Date()).getTime();
    if ( time > this.fpsUpdateNext ) {
      this.fps = this.frames;
      this.fpsText.setText(this.fps);
      this.frames = 0;
      this.fpsUpdateNext = time + 1000;
    }

    requestAnimationFrame(() => this.draw());

    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects.sort((a, b) => (a.z || 0) - (b.z || 0))
    for(var i = 0; i < this.objects.length; i++) {
      if ( !this.objects[i].hide ) {
        this.objects[i].updateScreenRect?.();
        this.objects[i].draw?.(this.ctx, this.engine);
      }
    }
    if ( this.showFps ) {
      this.fpsText.draw(this.ctx);
    }
    if ( this.debugImage ) {
      this.debugImage.debug(this.ctx);
      this.debugImage = null;
    }
    this.ctx.restore();
  }
}