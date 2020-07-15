import Text from "../../engine/gfx/Text.js";

export default class GameUI {
  z = 5;

  constructor(engine) {
    this.engine = engine;
  }

  //Add comment to make it appear
  draw(ctx) {
    Text.draw(ctx, "$" + this.engine.globals.cash, 10, 0, {
      fontColor: "#5b5",
    });
  }
}