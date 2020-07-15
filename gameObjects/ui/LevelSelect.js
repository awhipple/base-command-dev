import { UIComponent } from "../../engine/gfx/ui/window/UIComponent.js";
import { BoundingRect } from "../../engine/GameMath.js";
import Text from "../../engine/gfx/Text.js";

export default class LevelSelect extends UIComponent {
  height = 80;

  initialize() {
    super.initialize();

    this.levelText = this.options.textObj.level;
    this.levelText.x = this.suggestedWidth/2;
    this.levelText.center = true;
    this.levelText.fontColor = "white";
    this.levelText.fontSize = 20;

    var boxSize = 20;
    this.leftArrowRect = new BoundingRect(this.suggestedWidth/2-boxSize/2-60, 0, boxSize, boxSize);
    this.leftArrow = new Text("<", this.leftArrowRect.x, -9, {fontColor: "white", fontSize: 30});
    this.rightArrowRect = new BoundingRect(this.suggestedWidth/2-boxSize/2+60, 0, boxSize, boxSize);
    this.rightArrow = new Text(">", this.rightArrowRect.x, -9, {fontColor: "white", fontSize: 30});

    this.enemiesText = this.options.textObj.enemies;
    this.enemiesText.x = this.suggestedWidth/2 - 70;
    this.enemiesText.y = 30;
    this.enemiesText.fontColor = "white";
    this.enemiesText.fontSize = 15;

    this.rewardText = this.options.textObj.reward;
    this.rewardText.x = this.suggestedWidth/2 - 70;
    this.rewardText.y = 60;
    this.rewardText.fontColor = "white";
    this.rewardText.fontSize = 15;
  }

  onMouseMove(event) {
    this.leftHover = this.leftArrowRect.contains(event.pos);
    this.rightHover = this.rightArrowRect.contains(event.pos);
    this.hover = this.leftHover || this.rightHover;
  }

  onMouseClick() {
    if ( this.leftHover ) {
      this.engine.globals.levels.selected--;
    }
    if ( this.rightHover ) {
      this.engine.globals.levels.selected++;
    }
  }

  update() {
    if ( this.hover ) {
      this.engine.cursor = "pointer";
    }
  }

  hide() {
    this.hover = false;
  }

  drawComponent() {
    this.levelText.draw(this.ctx);
    this.leftArrow.draw(this.ctx);
    this.rightArrow.draw(this.ctx);

    this.enemiesText.draw(this.ctx);
    this.rewardText.draw(this.ctx);
  }
}