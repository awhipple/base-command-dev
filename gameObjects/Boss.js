import Enemy from "./Enemy.js";

export default class Boss extends Enemy {
  constructor(engine, hp) {
    super(engine, engine.window.width/2, -100, hp, "purple");
    this.rect.x = this.rect.x - 30;
    this.rect.y = this.rect.y - 30;
    this.rect.w = this.rect.w + 60;
    this.rect.h = this.rect.h + 60;
    this.img = engine.images.get("dragon-green");

    this.yv = 0;
    this.oX = this.oY = 0;

    this.flash = this.engine.images.get("dragon-flash");
    this.flashBoss = 0;

    this._setDest(300, 200);

    this.sizeBoost = 30;
  }

  update() {
    super.update();

    if ( typeof this.delta === "number" ) {
      this.delta = Math.min(this.delta + 1/30, Math.PI/2);

      var cDelta = Math.pow(Math.sin(this.delta),1);

      this.x = this.iX + this.dX * cDelta;
      this.y = this.iY + this.dY * cDelta;

      if ( this.delta === Math.PI/2 ) {
        this.delta = null;
        this.timeBetweenMoves = this.timeBetweenMoves ?? 3;
        this.timeBetweenMoves = Math.max(this.timeBetweenMoves - 0.15, 0);
        this.nextMove = this.timeBetweenMoves;
        this.fireBalls = 3;
      }
    }

    if ( typeof this.nextMove === "number" ) {
      this.nextMove -= 1/60;
      if ( this.nextMove <= 0 ) {
        this.nextMove = null;
        this._setDest(
          Math.random()*(this.engine.window.width-200)+100,
          Math.random()*300+100,          
        );
      }
    }

    if ( (this.fireBalls ?? 0) > 0 ) {
      this.nextFire = this.nextFire || 0.2;
      this.nextFire -= 1/60;
      if ( this.nextFire <= 0 ) {
        var fireBallXv = 0;
        if ( this.fireBalls > 1 ) {
          fireBallXv = this.fireBalls === 3 ? -10 : 10;
        }
        this.engine.register(new Enemy(this.engine, this.x, this.y, 22, "fireBall", fireBallXv), "enemy");
        this.engine.sounds.play("fireball");
        this.fireBalls--;
        this.nextFire = 0.2;
      }
      if ( this.fireBalls === 0 ) {
        this.nextFire = null;
      }
    }

    this.nextFlash = this.nextFlash ?? 180;
    if ( this.hp === this.maxHp ) {
      this.nextFlash = 180;
    }
    this.nextFlash = Math.max(this.nextFlash - 1, 0);
    if ( this.nextFlash === 0 && this.flashBoss === 0) {
      this.flashBoss = 0.1;
    }

    if ( this.flashBoss > 0 ) {
      this.flashBoss = Math.max(this.flashBoss - 1/60, 0);
      if ( this.flashBoss === 0 ) {
        this.nextFlash = 180 - 175 * (1 - this.hp/this.maxHp);
      }
    } 
  }

  damage(dmg) {
    super.damage(dmg);

    this.oX = Math.random()*30-15;
    this.oY = Math.random()*30-15;
  }

  draw(ctx) {
    var img = this.flashBoss > 0 ? this.flash : this.img;
    
    img.draw(
      ctx, 
      this.rect.x - this.sizeBoost + this.oX, this.rect.y - this.sizeBoost + this.oY,
      this.rect.w + this.sizeBoost*2, this.rect.h + this.sizeBoost*2);

    this.oX *= 0.5; 
    this.oY *= 0.5;
  }

  _setDest(x, y) {
    this.iX = this.x;
    this.iY = this.y;
    this.dX = x - this.x;
    this.dY = y - this.y;
    this.delta = 0;
  }

}