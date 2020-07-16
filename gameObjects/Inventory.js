import Item from "./Item.js";

export default class Inventory {
  constructor(engine) {
    this.engine = engine;

    this.items = [];

    this.equipment = {
      primary: new Item(engine, "shot"),
    };

    this.items.push(new Item(engine, "rapid"));
  }

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  equip(slot, item) {
    this.remove(item);
    this.add(this.equipment[slot]);
    this.equipment[slot] = item;
  }
}