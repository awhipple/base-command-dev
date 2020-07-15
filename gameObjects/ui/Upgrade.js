import Button from "../../engine/gfx/ui/window/components/Button.js";

export default class Upgrade extends Button {
  initialize() {
    super.initialize();
    
    this.nameText = this.options.textObj.name;
    this.nameText.x = 80;
    this.nameText.y = 0;
    this.nameText.fontSize = 20;

    this.lvlText = this.options.textObj.lvl;
    this.lvlText.x = 90 + this.ctx.measureText(this.nameText).width;
    this.lvlText.y = 8;
    this.lvlText.fontSize = 12;

    this.costText = this.options.textObj.cost;
    this.costText.x = 220;
    this.costText.y = 5;
    this.costText.fontSize = 15;
    
    this.statText = this.options.textObj.stat;
    this.statText.x = 80;
    this.statText.y = 40;
    this.statText.fontSize = 15;
  }
  
  drawComponent() {
    super.drawComponent();

    this.nameText.draw(this.ctx);
    this.lvlText.draw(this.ctx);

    this.costText.draw(this.ctx);

    this.statText.draw(this.ctx);
  }
}