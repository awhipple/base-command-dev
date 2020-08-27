import Text from "../../node_modules/avocado2d/gfx/Text.js";

export default class GameUI {
  z = 5;

  constructor(engine) {
    this.engine = engine;
  }

  draw(ctx) {
    Text.draw(ctx, "$" + this.engine.globals.cash, 10, 0, {
      fontColor: "#5b5",
    });
  }
}