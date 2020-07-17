import Item from "./Item.js";

export default class Inventory {
  constructor(engine) {
    this.engine = engine;

    this.items = [];

    this.equipment = {
      primary: new Item(engine, "basic"),
    };
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

  attemptMerge(first, second) {
    if ( first !== second && first.stats.craft?.[second.name]) {
      this.remove(first);
      this.remove(second);
      this.add(new Item(this.engine, first.stats.craft[second.name]));
    }
  }
}