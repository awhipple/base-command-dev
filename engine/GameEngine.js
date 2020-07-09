import GameWindow from './gfx/GameWindow.js';
import ImageLibrary from './gfx/ImageLibrary.js';
import { KeyNames, MouseButtonNames } from './input/Enums.js';
import { Coord } from './GameMath.js';
import Button from './objects/Button.js';
import FullscreenSplash from './objects/FullScreenSplash.js';
import AudioLibrary from './AudioLibrary.js';
import FlashText from './gfx/FlashText.js';

export default class GameEngine {
  images = new ImageLibrary();
  sounds = new AudioLibrary();
  gameObjects = {all: []};
  globals = {};
  keyDownCallbacks = [];
  eventListeners = {};
  pressedKeys = {};
  mouse = {pos: new Coord(0, 0), left: false, right: false};
  fullscreen = false;
  eventTimers = {};

  constructor(options = {}) {
    this.window = new GameWindow(this, "gameCanvas", this.gameObjects.all);
    this.images.preload("fullscreen");

    this.dev = window.location.href.indexOf("localhost") !== -1;

    document.addEventListener('keydown', (event) => {
      var key = KeyNames[event.keyCode] || event.keyCode;
      this.pressedKeys[key] = true;
    });
    document.addEventListener('keyup', (event) => {
      var key = KeyNames[event.keyCode] || event.keyCode;
      delete this.pressedKeys[key];
    });

    this.window.canvas.addEventListener('mousemove', event => {
      this.mouse.pos = this.getMouseCoord(event);
    });

    this.onMouseDown(event => {
      if ( !this.firstInteraction ) {
        this.firstInteraction = true;
        this.trigger("firstInteraction")
      }
      this.mouse[MouseButtonNames[event.button] || event.button] = true;

      this._sendMouseEvent(event, "onMouseClick");
    });

    this.onMouseWheel(event => {
      this._sendMouseEvent(event, "onMouseWheel");
    });

    this.onMouseMove(event => {
      this._sendMouseEvent(event, "onMouseMove");
    });

    this.onMouseUp(event => {
      this.mouse[MouseButtonNames[event.button] || event.button] = false;
    });

    document.addEventListener('fullscreenchange', (event) => {
      this.fullscreen = !!document.fullscreenElement;
    });
    if ( options.showFullscreenSplash ) {
      this.window.register(new FullscreenSplash(this));
    }

    this.load().then(() => {
      if ( options.showFullscreenIcon ) {
        this.fullscreenButton = new Button(this, this.images.get("fullscreen"), this.window.width-20, this.window.height-20, 0.05);
        this.register(this.fullscreenButton);
      }

      this.flash = new FlashText(this);
      this.register(this.flash);
    });

    this.startGameLoop();
  }

  register(object, name) {
    if (object === this) {
      console.log("You cannot register the engine as a game object!");
      console.trace();
      return;
    }

    this.gameObjects.all.push(object);

    // Store in its own collection if requested
    if ( name ) {
      this.gameObjects[name] = this.gameObjects[name] || {};
      do {
        object._hash = Math.floor(Math.random()*1000000000);
      } while (this.gameObjects[name][object._hash]);
      this.gameObjects[name][object._hash] = object;
    }
  }

  unregister(object) {
    var objectIndex = this.gameObjects.all.indexOf(object);
    if ( objectIndex !== -1 ) {
      this.gameObjects.all.splice(objectIndex, 1);
    }

    var keys = Object.keys(this.gameObjects);
    for ( var i = 0; i < keys.length; i++) {
      if ( keys[i] !== "all" ) {
        if ( this.gameObjects[keys[i]][object._hash] ) {
          delete this.gameObjects[keys[i]][object._hash];
        }
      }
    }
  }

  getObjects(name) {
    this.gameObjects[name] = this.gameObjects[name] || {}
    return this.gameObjects[name] ? Object.values(this.gameObjects[name]) : [];
  }

  onUpdate(gameLoop) {
    this.gameLoop = gameLoop;
  }

  startGameLoop() {
    this.nextTick = (new Date).getTime();

    setInterval(() => {
      this.loops = 0;
      while ((new Date).getTime() > this.nextTick && this.loops < 10) {
        this.update();
        this.nextTick += 1000/60;
        this.loops++;
      }
    }, 1000/60);
  }

  update() {
    for(var i = 0; i < this.gameObjects.all.length; i++) {
      if ( this.gameObjects.all[i].update ) {
        this.gameObjects.all[i].update(this);
      }
    }
  
    var pressedKeys = Object.keys(this.pressedKeys);
    for(var i = 0; i < this.keyDownCallbacks.length; i++) {
      for(var k = 0; k < pressedKeys.length; k++) {
        this.keyDownCallbacks[i]({key: pressedKeys[k]});
      }
    }

    for ( var key in this.eventTimers ) {
      this.eventTimers[key] -= 1/60;
    }

    if ( this.gameLoop ) {
      this.gameLoop();
    }
  }

  load() {
    return this.images.load();
  }

  goFullscreen() {
    this.window.canvas.requestFullscreen();
  }

  onKeyPress(callback) {
    document.addEventListener('keydown', (event) => {
      callback(this._keyEvent(event));
    });
  }

  onKeyDown(callback) {
    this.keyDownCallbacks.push(callback);
  }

  onMouseMove(callback) {
    this.window.canvas.addEventListener('mousemove', event => {
      callback({pos: this.getMouseCoord(event)});
    });
  }

  onMouseDown(callback) {
    this.window.canvas.addEventListener('mousedown', event => {
      callback(this._mouseEvent(event));
    });
  }

  onMouseUp(callback) {
    this.window.canvas.addEventListener('mouseup', event => {
      callback(this._mouseEvent(event));
    });
  }

  onMouseWheel(callback) {
    this.window.canvas.addEventListener('mousewheel', event => {
      callback(this._mouseEvent(event));
    });
  }

  on(eventName, callback) {
    this.eventListeners[eventName] = this.eventListeners[eventName] || [];
    this.eventListeners[eventName].push(callback);
  }

  trigger(eventName) {
    var listeners = this.eventListeners[eventName] || [];
    for ( var i = 0; i < listeners.length; i++ ) {
      listeners[i]();
    }
  }

  getMouseCoord(event) {
    var canvas = this.window.canvas;
    var rect = canvas.getBoundingClientRect();
    
    return new Coord(
      (event.clientX - rect.x) * canvas.width / rect.width,
      (event.clientY - rect.y) * canvas.height / rect.height,
    );
  }

  get prod() {
    return !this.dev;
  }

  setProd() {
    this.dev = false;
  }

  // Used for console logs to prevent them from spamming
  oncePerSecond(callback, key = "onceOnly") {
    this.eventTimers[key] = this.eventTimers[key] ?? 0;
    if ( this.eventTimers[key] <= 0) {
      this.eventTimers[key] += 1;
      callback();
    }
  }

  _keyEvent(event) {
    return {
      key: KeyNames[event.keyCode] || event.keyCode
    }
  }

  _mouseEvent(event) {
    return {
      button: MouseButtonNames[event.button] || event.button,
      pos: this.getMouseCoord(event),
      wheelDirection: event.wheelDeltaY < 0 ? "down" : "up",
    };
  }

  _sendMouseEvent(event, methodName) {
    // The game window currently sorts all these objects in order of their z value
    for ( var i = this.gameObjects.all.length - 1; i >= 0; i-- ) {
      var obj = this.gameObjects.all[i];
      if ( typeof obj[methodName] === "function" && obj.screenRect?.contains(event.pos.x, event.pos.y) ) {
        event.relPos = { x: event.pos.x - obj.screenRect.x, y: event.pos.y - obj.screenRect.y };
        if ( !obj[methodName](event) ) {
          return;
        }
      }
    }
  }
}