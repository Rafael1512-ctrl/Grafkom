import myLib from "./lib/lib.js";
import myLib2 from "./lib/MatrixA.js";

let canvas = document.querySelector("#mycanvas");
let context = canvas.getContext("2d", {
  willReadFrequently: true,
});

let image_data = context.getImageData(0, 0, canvas.width, canvas.height);
let lib = new myLib(canvas.width, image_data);
let lib2 = new myLib2(canvas.width, image_data);
let abu = { r: 150, g: 150, b: 150, a: 255 };
let coklat = { r: 139, g: 69, b: 19 };
let merah = { r: 255, g: 0, b: 0 };
let hijau = { r: 0, g: 255, b: 0 };

let balonX = 120
let balonY = 120
let kecepatanY = 0
let heating = false
let tanahY = 160
let pohonX = 800;
let gameOver = false
function gambar_balon() {
  var kotak1 = [
    { x:265, y:650 },
    { x:265, y:580 },
    { x:185, y:580 },
    { x:185, y:650 },
  ];
  var kotak2 = [
    { x:265, y:650 },
    { x:265, y:565 },
    { x:185, y:565 },
    { x:185, y:650 },
  ];
  let balon = [
    { x:225, y:180 },

    { x:160, y:190 },
    { x:140, y:230 },
    { x:130, y:280 },

    { x:135, y:340 },
    { x:155, y:390 },
    { x:180, y:440 },

    { x:195, y:485 },

    { x:255, y:485 },

    { x:270, y:440 },
    { x:295, y:390 },
    { x:315, y:340 },

    { x:320, y:280 },
    { x:310, y:230 },
    { x:280, y:190 },
];
let skirt = [
    { x: 195, y: 485 },
    { x: 255, y: 485 },
    { x: 265, y: 525 },
    { x: 185, y: 525 },
  ];

  kotak1 = lib.multiple_translate(kotak1,{x:balonX, y:balonY})
  kotak2 = lib.multiple_translate(kotak2,{x:balonX,y:balonY})
  balon = lib.multiple_translate(balon,{x:balonX, y:balonY})
  skirt = lib.multiple_translate(skirt,{x:balonX,y:balonY})
  lib.polygon(kotak1, abu);
  // lib.FloodFillNonRecursive(225 + balonX, 620 +balonY, coklat, abu);
  lib.polygon(kotak2, abu);
  // lib.FloodFillNonRecursive(225 +balonX, 575+balonY, { r: 140, g: 50, b: 50 }, abu);
  lib.dda_line(205+balonX,525+balonY,205+balonX,565+balonY,abu);
  lib.dda_line(245+balonX,525+balonY,245+balonX,565+balonY,abu);

  
  lib.polygon(balon, abu); 
  // lib.FloodFillNonRecursive(225+balonX, 320+balonY, merah, abu);

  lib.polygon(skirt, abu);
  // lib.FloodFillNonRecursive(225 + balonX,500 + balonY,merah,abu);
}
function gambar_pohon(x){

    let batang = [
        {x:x, y:800},
        {x:x+40, y:800},
        {x:x+40, y:650},
        {x:x, y:650}
    ];

    let daun = [
      {x:x+20, y:500},
      {x:x-50, y:650},
      {x:x+90, y:650},
    ]

    lib.polygon(batang, abu);
    lib.polygon(daun,abu)
    lib.FloodFillNonRecursive(x+20,700,coklat,abu);
    lib.FloodFillNonRecursive(x+20,600,hijau,abu);

}
function cek_collision(){
  let balonnBawah = 650+balonY
  if(pohonX < 320 && pohonX +40>130 && balonnBawah>650){
    return true;
  }
  return false
}
function update(){
  if(gameOver){
    return
  }
  lib.restart(context,canvas)
  // console.log("update jalan");
  // balonY -=1
  pohonX -= 2;
  if(heating){
    kecepatanY -= 2
  }
  kecepatanY += 0.1

  if(kecepatanY <-5){
    kecepatanY = -5
  }

  if(kecepatanY>5){
    kecepatanY = 5
  }
  
  balonY += kecepatanY

  if(balonY > tanahY){
    balonY = tanahY
    kecepatanY = 0
  }
  if(cek_collision()){
    gameOver = true;
}
  gambar_balon()
  gambar_pohon(pohonX)
  context.putImageData(lib.image_data,0,0 )
  requestAnimationFrame(update)
}

canvas.addEventListener("mousedown",function(){
  heating = true
})
canvas.addEventListener("mouseup",function(){
  heating = false
})

update()