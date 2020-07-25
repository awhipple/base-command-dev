import Projectile from "./Projectile.js";

export default class Item {
  static borderColors = {
    weapon: "orange",
    gem: "white",
  }

  static list = {
    redGem: {type: "gem", value: 500, icon: "red-gem"},
    greenGem: {type: "gem", value: 500, icon: "green-gem"},
    blueGem: {type: "gem", value: 2000, icon: "blue-gem",
      craft: {
        basic: "homing",
      }
    },
    whiteGem: {type: "gem", value: 500, icon: "white-gem", 
      craft: {
        whiteGem: "basic",
      }
    },
    basic: {type: "weapon", value: 750, icon: "white-circle", 
      craft: {
        basic: "rapid",
        blueGem: "homing",
      }, 
      projectile: {
        imageName: "white-circle",
      }
    },
    rapid: {type: "weapon", value: 1500, icon: "white-rapid-icon",
      projectile: {
        damage: 0.6,
        speed: 2,
        imageName: "white-triangle",
        alternate: true,
      }
    },
    homing: {type: "weapon", value: 2000, icon: "blue-circle", 
      craft: {
        homing: "homingRapid",
      },
      projectile: {
        imageName: "blue-circle",
        homing : true,
      }
    },
    homingRapid: {type: "weapon", value: 3500, icon: "blue-rapid-icon",
      projectile: {
        damage: 0.6,
        speed: 2,
        imageName: "blue-triangle",
        alternate: true,
        homing: true,
      }
    },

    none: {type: "weapon", value: 0, icon: "whiteGem",
      projectile: {
        speed: 0.5,
        imageName: "white-circle",
        lifeSpan: 1,
        scale: 0.5,
      }
    },
  }

  static NONE = new Item(null, "none");

  static ICON_SIZE = 40;

  constructor(engine, name) {
    this.name = name;
    this.stats = Item.list[name];
    
    this.borderColor = this.stats.borderColor = this.stats.borderColor ?? Item.borderColors[this.stats.type];
    
    this.value = this.stats.value;
    
    this.projectile = this.stats.projectile = this.stats.projectile ?? {};
    this.projectile.speed = this.projectile.speed ?? 1;
    this.projectile.damage = this.projectile.damage ?? 1;
    
    this.engine = engine;
  }

  shoot(x, y, dir) {
    if ( this.projectile.alternate ) {
      this.alt = !this.alt;
      var dist = this.alt ? 10 : 18;
      var mod = dir + (this.alt ? -Math.PI/2 : Math.PI/2);
      x += Math.cos(mod) * dist;
      y += Math.sin(mod) * dist; 
    }
    var Type = this.projectile.class ?? Projectile;
    this.engine.register(new Type(
      this.engine,
      x, y, dir,
      this.engine.globals.stats.power.val * this.projectile.damage,
      300,
      this.projectile,
    ), "projectile");
  }

  get type() {
    return Item.list[this.name].type;
  }

  get engine() {
    return this._engine;
  }

  set engine(val) {
    this._engine = val;

    if ( this.engine ) {
      this.icon = this.engine.images.get(this.stats.icon ?? name);
      this.projectile.image = this.projectile.imageName && this.engine.images.get(this.projectile.imageName);
    }
  }
}