import UIWindow from "../../node_modules/avocado2d/gfx/ui/window/index.js";
import Upgrade from "./Upgrade.js";
import { UIComponent } from "../../node_modules/avocado2d/gfx/ui/window/UIComponent.js";
import { BoundingRect } from "../../node_modules/avocado2d/engine/GameMath.js";
import Text from "../../node_modules/avocado2d/gfx/Text.js";
import Item from "../Item.js";

function upgradeStat(stat, globals) {
  return () => {
    if ( globals.cash >= stat.cost(stat.lvl) ) {
      stat.val = stat.next(stat.lvl);
      globals.cash -= stat.cost(stat.lvl);
      stat.lvl++;
    }
  }
}

function makeUpgradeUI(name, stat, globals) {
  return {
    type: Upgrade,
    text: {
      button: "+",
      name: name,
      lvl: () => "lvl " + stat.lvl,
      cost: () => "Cost: " + stat.cost(stat.lvl),
      stat: () => stat.val + " -> " + stat.next(stat.lvl),
    },
    callback: upgradeStat(stat, globals),
    left: 130,
    fontColor: "#0f0",
  };
}

export default class TitleScreen extends UIWindow {
  constructor(engine) {
    var stats = engine.globals.stats;
    var levels = engine.globals.levels;
    var rewardText = () => {
      var rewardText = "Reward: ";
      if ( levels.current.reward ) {
        rewardText += "   ";
        if ( levels.current.reward && (levels.current.qty ?? 0) === 0 && (levels.current.chance ?? 100) !== 100) {
          rewardText += "(" + levels.current.chance + "%)";
        }
        rewardText += " + ";
      }
      rewardText += "$" + levels.current.cash;
      return rewardText;
    }
    super(engine, {
      x: 0, y: 0,
      w: engine.window.width, h: engine.window.height,
    }, [
      {
        type: "spacer",
        height: 20,
      },
      {
        type: "title",
        text: "Base Command",
        fontColor: "#0f0",
        center: true,
      },
      {
        type: "spacer",
        height: 80,
      },
      {
        type: "title",
        text: () => "$" + engine.globals.cash,
        fontSize: 35,
        fontColor: "#0f0",
        center: true,
      },
      {
        type: "spacer",
        height: 20,
      },
      makeUpgradeUI("Power", stats.power, engine.globals),
      makeUpgradeUI("Speed", stats.speed, engine.globals),
      {
        type: "spacer",
        height: 60,
      },
      {
        type: LevelSelect,
        levels: levels,
        text: {
          level: () => "Level " + (levels.selected),
          enemies: () => "Enemies: " + (levels.current.enemies),
          reward: rewardText,
        }
      },
      {
        type: "spacer",
        height: 1,
      },
      {
        type: "button",
        text: {
          button: "Start",
        },
        fontColor: "#0f0",
        center: true,
        callback: () => {
          engine.trigger("startGame");
        },
      },
    ], {
      bgColor: "#000",
    })
  }
}

class LevelSelect extends UIComponent {
  height = 90;

  initialize() {
    super.initialize();

    this.iconRect = new BoundingRect(160, 42, 44, 44);

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
    this.enemiesText.x = 220;
    this.enemiesText.y = 40;
    this.enemiesText.fontColor = "white";
    this.enemiesText.fontSize = 15;
    
    this.rewardText = this.options.textObj.reward;
    this.rewardText.x = 220;
    this.rewardText.y = 70;
    this.rewardText.fontColor = "white";
    this.rewardText.fontSize = 15;

    this.levels = this.options.levels;
    this.rewardRect = new BoundingRect(290, 65, 25, 25);
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
    this.engine.globals.levels.current.icon.draw(this.ctx, this.iconRect);

    this.levelText.draw(this.ctx);
    this.leftArrow.draw(this.ctx);
    this.rightArrow.draw(this.ctx);

    this.enemiesText.draw(this.ctx);
    this.rewardText.draw(this.ctx);

    if ( this.levels.selectedReward ) {
      this.levels.selectedReward.draw(this.ctx, this.rewardRect);
      this.rewardRect.draw(this.ctx, Item.list[this.levels.current.reward].borderColor);
    }
  }
}