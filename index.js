import myLib from "./lib/lib.js";
import Game from "./game/game.js"

let canvas = document.querySelector("#mycanvas");
let context = canvas.getContext("2d", {
  willReadFrequently: true,
});

let image_data = context.getImageData(0, 0, canvas.width, canvas.height);
let lib = new myLib(canvas.width, image_data);
let game = new Game(
  canvas,
  context,
  lib,
)
game.start()
