import { UIComponent } from "../UIComponent.js";
import Text from "../../../Text.js";
import { BoundingRect } from "../../../../GameMath.js";

export default class Button extends UIComponent{
  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.bgColor = options.bgColor;
    this.center = options.center;
    this.padding = options.padding ?? 15;
    this.callback = options.callback ?? (() => {});

    this.text = new Text(
      options.text ?? '', 
      this.center ? this.suggestedWidth/2 : this.padding, 2, 
      options,
    );

    this.height = this.text.fontSize * 1.4;

    this.rect = new BoundingRect(0, 0, 0, this.height);
  }

  onMouseMove(event) {
    this.hover = this.rect.contains(event.pos);
  }

  onMouseClick(event) {
    if ( this.hover ) {
      this.callback();
    }
  }

  update() {
    if ( this.hover ) {
      this.engine.cursor = "pointer";
    }
  }

  drawComponent() {
    if ( this.bgColor ) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if ( this.rect.w === 0 ) {
      this.rect.w = this.text.getWidth(this.ctx) + this.padding*2;
      this.rect.x = this.center ? this.canvas.width/2 - this.rect.w/2 : 0; 
    }
    this.rect.draw(this.ctx);
    
    this.text.draw(this.ctx);
  }
}
