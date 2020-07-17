import Projectile from "./Projectile.js";

export default class Item {
  static list = {
    "shot": {type: "weapon", value: 100},
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
    this.icon = engine.images.get(Item.list[name].icon ?? name);
    this.value = Item.list[name].value;

    this.projectile = Item.list[name].projectile = Item.list[name].projectile ?? {};
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
    return Item[this.name].type;
  }
}