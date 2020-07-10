import { UIComponent } from "../UIComponent.js";

export default class Spacer extends UIComponent{
  constructor(engine, suggestedWidth, options = {}) {
    super(engine, suggestedWidth);

    this.height = options.height ?? 100;
  }

  drawComponent() {
    
  }
}
