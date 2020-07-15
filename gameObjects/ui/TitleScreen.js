import UIWindow from "../../engine/gfx/ui/window/index.js";
import Upgrade from "./Upgrade.js";
import LevelSelect from "./LevelSelect.js";

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
        text: {
          level: () => "Level " + (levels.selected),
          enemies: () => "Enemies: " + (levels.current.enemies),
          reward: () => "Reward: " + (typeof levels.current.reward === "string" ? "" : "$") + (levels.current.reward),
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
          this.hide = true;
          this.engine.globals.base.on = true;
          this.engine.globals.spawner.start();
        },
      },
    ], {
      bgColor: "#000",
    })
  }
}