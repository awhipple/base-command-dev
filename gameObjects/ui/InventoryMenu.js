import UIWindow from "../../engine/gfx/ui/window/index.js";
import Text from "../../engine/gfx/Text.js";
import { BoundingRect } from "../../engine/GameMath.js";
import { UIComponent } from "../../engine/gfx/ui/window/UIComponent.js";
import Item from "../Item.js";
import Sprite from "../../engine/gfx/Sprite.js";

export default class InventoryMenu extends UIWindow {
  constructor(engine, inventory) {
    super(engine, {
      x: engine.window.width, y: 0,
      // x: 0, y: 0,
      w: engine.window.width, h: engine.window.height,
    }, [
      {
        type: "button",
        text: {
          button: "Close >",
        },
        fontColor: "#0f0",
        fontSize: 20,
        callback: () => engine.trigger("closeInventory"),
      },
      {
        type: "title",
        text: "Items",
        fontSize: 40,
        fontColor: "white",
        center: true
      },
      {
        type: Items,
        inventory: inventory,
        text: {
          cash: () => '$' + engine.globals.cash,
        }
      },
      {
        type: "spacer",
        height: 1,
      },
      {
        type: "title",
        text: "Crafting",
        fontSize: 40,
        fontColor: "white",
        center: true
      },
      {
        type: Crafting,
        inventory: inventory,
      },
      {
        type: "spacer",
        height: 1,
      },
      {
        type: Equipment,
      },
    ], {
      bgColor: "#000",
      borderColor: "#fff",
      outerPadding: 3,
      z: 101,
    });

    this.invText = new Text("Inventory ^", 0, 0, { fontColor: "white", fontSize: 22 }).asImage(150, 30).rotate("up");
    this.invOpenRect = new BoundingRect(this.originX-48, 310, 48, 170);
    this.invOpenClick = new BoundingRect(this.engine.window.width-48, 310, 48, 170);

    this.engine.onMouseMove(event => {
      if ( 
        !this.hide && 
        this.originX === this.engine.window.width && 
        this.invOpenClick.contains(event.pos) 
      ) {
        this.hoverInv = true;
      } else {
        this.hoverInv = false;
      }
    });

    this.engine.onMouseDown(event => {
      if ( event.button === "left" && this.hoverInv ) {
        this.engine.trigger("openInventory");
      }
    });
  }

  update() {
    super.update();

    if ( this.hoverInv ) {
      this.engine.cursor = "pointer";
    }
  }

  draw(ctx) {
    super.draw(ctx);
    this.invOpenRect.x = this.originX-48;
    this.invOpenRect.draw(ctx, "white", "black");
    this.invText.draw(ctx, this.originX-40, 320);
  }
}

class Items extends UIComponent {
  iconSize = Item.ICON_SIZE;
  iconPadding = 5;
  iconRows = 3.3;
  iconColumns = 8;
  
  menuWidth = this.iconColumns * (this.iconSize + this.iconPadding) + this.iconPadding + 6;
  height = this.iconRows * (this.iconSize + this.iconPadding) + this.iconPadding + 6;

  initialize() {
    super.initialize();

    var itemIndexes = [];
    for ( var i = 0; i < 4; i++ ) {
      itemIndexes.push(i*this.iconColumns);
    }

    this.menu = new UIWindow(
      this.engine, 
      {x: this.width/2 - this.menuWidth/2, y: 0, w: this.menuWidth, h: this.height},
      itemIndexes.map(val => { return {
        type: ItemRow,
        inventory: this.options.inventory,
        iconSize: this.iconSize,
        iconPadding: this.iconPadding,
        itemCount: this.iconColumns,
        index: val,
      }}),
      {
        bgColor: "#000",
        borderColor: "#fff",
        outerPadding: 3,
        innerPadding: this.iconPadding,
      },
    );

    this.cashText = this.options.textObj.cash;
    this.cashText.fontSize = 15;
    this.cashText.fontColor = "#0f0";
    this.cashText.x = 480;

    this.sellRect = new BoundingRect(480, 50, 50, 109);
    this.dollarText = new Text('$', 489, 69, {
      fontColor: "#0f0",
    });
    this.sellValueText = new Text('', 480, 20, {fontColor: "#0f0", fontSize: 12});

    this.engine.on("stopDragItem", item => {
      if ( this.hoverSell ) {
        this.engine.globals.cash += item.value;
        this.options.inventory.remove(item);
        this.sellValueText.setText('');
      }
    });
  }

  onMouseMove(event) {
    this.hoverSell = this.sellRect.contains(event.pos);
    if ( this.hoverSell && this.engine.globals.dragItem ) {
      this.sellValueText.setText("+$" + this.engine.globals.dragItem.value);
    } else {
      this.sellValueText.setText('');
    }
    event.relPos = event.pos;
    event.relPos.x -= this.menu.originX;
    this.menu.onMouseMove(event);
  }

  onMouseWheel(event) {
    if ( 
      event.pos.x > this.menu.rect.x && event.pos.x < this.menu.rect.x + this.menu.rect.w &&
      event.pos.y > 0 && event.pos.y < this.height
    ) {
      event.relPos = event.pos;
      event.relPos.x -= this.menu.originX;
      this.menu.onMouseWheel(event);
    }
  }

  onMouseClick(event) {
    event.relPos = event.pos;
    event.relPos.x -= this.menu.originX;
    this.menu.onMouseClick(event);
  }

  onMouseUp(event) {
    event.relPos = event.pos;
    event.relPos.x -= this.menu.originX;
    this.menu.onMouseUp(event);
  }

  drawComponent() {
    this.menu.draw(this.ctx);
    this.cashText.draw(this.ctx);
    this.sellValueText.draw(this.ctx);
    this.sellRect.draw(this.ctx, this.hoverSell && this.engine.globals.dragItem ? "yellow" : "white");
    this.dollarText.draw(this.ctx);
  }
}

class ItemRow extends UIComponent {
  constructor(engine) {
    super(engine);
  }

  initialize() {
    this.height = this.options.iconSize;
    super.initialize();

    this.iconRects = [];
  }

  onMouseClick(event) {
    for ( var i = 0; i < this.iconRects.length; i++ ) {
      if ( this.iconRects[i].contains(event.pos) ) {
        this.engine.globals.dragItem = this.options.inventory.items[i + this.options.index];
      }
    }
  }

  onMouseMove(event) {
    var drag = this.engine.globals.dragItem;
    if ( drag ) {
      this.iconRects.forEach((rect, i) => {
        if ( rect.contains(event.pos) ) {
          var target = this.options.inventory.items[i + this.options.index];
          if ( target && drag !== target ) {
            this.dropTarget = target;
            this.dropRect = rect;
            return;
          }
        }
      });
    }
  }

  onMouseUp(event) {
    var drag = this.engine.globals.dragItem;
    if ( drag && this.dropTarget ) {
      this.engine.globals.inventory.attemptMerge(drag, this.dropTarget);
    }
  }

  drawComponent() {
    for ( var i = 0; i < this.options.itemCount && i + this.options.index < this.options.inventory.items.length; i++ ) {
      var item = this.options.inventory.items[i + this.options.index];
      
      if ( !this.iconRects[i] ) {
        var x = i * (this.options.iconSize + this.options.iconPadding);
        var size = this.options.iconSize;
        this.iconRects[i] = new BoundingRect(x, 0, size, size);
      }
      var alpha = item === this.engine.globals.dragItem ? 0.3 : 1.0;
      var borderColor = {weapon: "orange", gem: "white"}[item.type];
      item.icon.draw(this.ctx, this.iconRects[i], {alpha});
      this.iconRects[i].draw(this.ctx, borderColor, undefined, alpha);
    }
  }
}

class Crafting extends UIComponent {
  height = 159;

  initialize() {
    super.initialize();

    var w = 370;
    this.borderRect = new BoundingRect(this.suggestedWidth/2-w/2, 0, w, this.height);
  }

  drawComponent() {
    this.borderRect.draw(this.ctx);
  }
}

class Equipment extends UIComponent {
  height = 215;

  initialize() {
    super.initialize();
    
    this.borderRect = new BoundingRect(0, 0, this.width, this.height);

    this.base = new Sprite(this.engine.images.get("base").img, this.width/2, this.height);
    this.base.rad = 3*Math.PI/2;

    this.equipment = this.engine.globals.inventory.equipment;

    this.equipSlots = {
      primary: new BoundingRect(this.width/2-Item.ICON_SIZE/2+2, 15, Item.ICON_SIZE, Item.ICON_SIZE),
    };

    this.engine.on("stopDragItem", (item) => {
      if ( this.equipHover && item.type === "weapon" ) {
        this.engine.globals.inventory.equip(this.equipHover, item);
      }
    });
  }

  onMouseMove(event) {
    for ( var key in this.equipment ) {
      var slot = this.equipSlots[key];
      slot.hover = slot.contains(event.pos);
      if ( slot.hover ) {
        this.equipHover = key;
        return;
      }
      this.equipHover = null;
    }
  }
  
  drawComponent() {
    this.base.draw(this.ctx);
    this.borderRect.draw(this.ctx);
    for ( var key in this.equipment ) {
      var equip = this.equipment[key];
      var slot = this.equipSlots[key];
      equip.icon.draw(this.ctx, slot);
      slot.draw(
        this.ctx, equip.borderColor,
      );
    }
  }
}