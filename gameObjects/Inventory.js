import Item from "./Item.js";

export default class Inventory {
  constructor(engine) {
    this.engine = engine;

    this.items = [];

    if ( engine.dev ) {
      for ( var i = 0; i < 6; i++ ) {
        this.items.push(new Item(engine, "whiteGem"));
        this.items.push(new Item(engine, "blueGem"));
      }
      this.sort();
    }

    this.equipment = {
      primary: null,
    };
  }

  sort() {
    this.items = this.items.filter(item => item);
    this.items.sort((a, b) => a.type === b.type ? (a.name < b.name ? 1 : -1) : (a.type < b.type ? 1 : -1));
    this.engine.trigger("openInventory"); // Clear the inv menu and refreshes it
  }

  add(item) {
    var index = this.items.findIndex(item => !item);
    if ( index !== -1 ) {
      this.items[index] = item;
    } else {
      this.items.push(item);
    }
  }

  remove(item) {
    var index = this.items.indexOf(item);
    if ( index !== -1 ) {
      this.items[index] = null;
    }
  }

  equip(slot, item) {
    this.remove(item);
    this.unequip(slot);
    this.equipment[slot] = item;
  }

  unequip(slot) {
    if ( this.equipment[slot]) {
      this.add(this.equipment[slot]);
    }
    this.equipment[slot] = null;
  }

  attemptMerge(first, second) {
    if ( first !== second && first.stats.craft?.[second.name]) {
      var mergeIndex = this.items.indexOf(second);
      if ( mergeIndex >= 0) {
        this.remove(first);
        this.remove(second);
        return this.items[mergeIndex] = new Item(this.engine, first.stats.craft[second.name]);
      }
    }
    return null;
  }
}