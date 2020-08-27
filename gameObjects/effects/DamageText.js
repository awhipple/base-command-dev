import Text from "../../node_modules/avocado2d/gfx/Text.js";

export default class DamageText extends Text {
  z = 200;
  alpha = 1;

  constructor(engine, damage, x, y) {
    super(Math.floor(damage*10)/10, x + (Math.random()*20-15), y-20, {
      fontColor: "red",
      fontSize: 15,
    });

    this.engine = engine;
  }

  update() {
    this.y--;

    this.alpha -= 0.01;
    if ( this.alpha <= 0 ) {
      this.engine.unregister(this);
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }
}