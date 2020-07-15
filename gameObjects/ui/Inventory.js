import UIWindow from "../../engine/gfx/ui/window/index.js";

export default class Inventory extends UIWindow {
  constructor(engine) {
    super(engine, {
      x: 0, y: 0,
      w: engine.window.width, h: engine.window.height,
    }, [
      {
        type: "button",
        text: {
          button: "Close >",
        },
        fontColor: "#0f0",
        fontSize: 25,
        callback: () => engine.trigger("closeInventory"),
      },
    ], {
      bgColor: "#000",
      z: 101,
    })
  }
}