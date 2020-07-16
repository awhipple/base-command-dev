export default class Item {
  static list = {
    "shot": {type: "weapon"},
    "base": {type: "weapon"},
    "dragon-green": {type: "weapon"},
  }
  static ICON_SIZE = 40;

  constructor(engine, name) {
    this.name = name;
    this.icon = engine.images.get(Item.list[name].icon ?? name);
  }

  get type() {
    return Item[this.name].type;
  }
}