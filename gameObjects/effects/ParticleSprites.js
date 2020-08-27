import { ParticleSprite } from "../../node_modules/avocado2d/gfx/shapes/Particle.js";

var whiteCircle = new ParticleSprite(
  {x: 25, y: 25, radius: 25},
  { 
    pw: 50, px: 50,
    generator: () => {
      var c = Math.random()*128 + 128;
      var rad = Math.random()*Math.PI*2;
      return {
        start: {
          x: 25, y: 25,
          radius: 5,
          r: c, g: c, b: c,
          alpha: 1,
        }, 
        end: {
          x: 25 + Math.cos(rad)*3, y: 25 + Math.sin(rad)*3,
          radius: 22,
          r: 255, g: 255, b: 255,
          alpha: 0,
        },
        lifeSpan: 0.5,
      };
    },
  });
  whiteCircle.hide = true;
  
var blueCircle = new ParticleSprite(
  {x: 25, y: 25, radius: 25},
  { 
    pw: 50, px: 50,
    generator: () => {
      var g = Math.random()*128+32;
      var b = Math.random()*200 + 56;
      var rad = Math.random()*Math.PI*2;
      return {
        start: {
          x: 25, y: 25,
          radius: 3,
          g, b,
          alpha: 1,
        }, 
        end: {
          x: 25 + Math.cos(rad)*3, y: 25 + Math.sin(rad)*3,
          radius: 22,
          g, b: 255,
          alpha: 0.5,
        },
        lifeSpan: 0.5,
      };
    },
    qty: 0.7,
  });
  blueCircle.hide = true;
  export { whiteCircle, blueCircle };