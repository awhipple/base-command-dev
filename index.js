import Game from './Game.js';

// async function getGameJS() {
//   let y = await fetch('./Game.js');
//   y = await y.json();
//   return y;
// }
// Game$$Game().then(Game => {

window.onload = function() {
  var game = new Game();
  game.start();
}
