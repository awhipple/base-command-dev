import Projectile from "./Projectile.js";

export default class Item {
  static list = {
    redGem: {type: "gem", value: 500, icon: "red-gem"},
    greenGem: {type: "gem", value: 500, icon: "green-gem"},
    blueGem: {type: "gem", value: 500, icon: "blue-gem"},
    whiteGem: {type: "gem", value: 500, icon: "white-gem", craft: {
      whiteGem: "basic",
    }},

    "basic": {type: "weapon", value: 100, icon: "shot", craft: {
      basic: "rapid",
    }},
    "rapid": {type: "weapon", value: 100, projectile: {
      damage: 0.6,
      speed: 2,
      imageName: "triangle",
      alternate: true,
    }},
  }

  static ICON_SIZE = 40;

  constructor(engine, name) {
    this.engine = engine;

    this.name = name;
    this.stats = Item.list[name];

    this.borderColor = this.stats.borderColor = this.stats.borderColor ?? {weapon: "orange", gem: "white"}[this.stats.type];

    this.icon = engine.images.get(this.stats.icon ?? name);
    this.value = this.stats.value;

    this.projectile = this.stats.projectile = this.stats.projectile ?? {};
    this.projectile.speed = this.projectile.speed ?? 1;
    this.projectile.image = this.projectile.imageName && engine.images.get(this.projectile.imageName);
    this.projectile.damage = this.projectile.damage ?? 1;
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
}