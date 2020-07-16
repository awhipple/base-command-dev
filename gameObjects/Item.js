export default class Item {
  static list = {
    "shot": {type: "weapon", value: 100},
    "rapid": {type: "weapon", value: 100},
  }
  static ICON_SIZE = 40;

  constructor(engine, name) {
    this.name = name;
    this.icon = engine.images.get(Item.list[name].icon ?? name);
    this.value = Item.list[name].value;
  }

  get type() {
    return Item[this.name].type;
  }
}