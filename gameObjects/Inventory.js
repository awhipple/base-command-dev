import Item from "./Item.js";

export default class Inventory {
  constructor(engine) {
    this.engine = engine;

    this.items = [];

    this.equipment = {
      primary: new Item(engine, "shot"),
    };

    this.add(new Item(engine, "redGem"));
    this.add(new Item(engine, "blueGem"));
    this.add(new Item(engine, "rapid"));
    this.add(new Item(engine, "greenGem"));
    this.add(new Item(engine, "whiteGem"));
  }

  add(item) {
    this.items.push(item);
    this.items.sort((a, b) => a.type < b.type ? 1 : -1)
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