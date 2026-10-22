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
let pohon = [
  {x:800, y: 150, scored:false},
  {x:1200, y: 350, scored:false},
  {x:1600, y: 200, scored:false},
]
let gameOver = false
let score = 0
const inpo_score = document.querySelector("#score");
let bensin = 100
const bar_bensin = document.querySelector("#bensin");
const inpo_bensin = document.querySelector("#teksbensin");

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
function gambar_pohon(x,y){
    let batang = [
        {x:x, y:800},
        {x:x+40, y:800},
        {x:x+40, y:800-y},
        {x:x, y:800-y}
    ];

    let daun = [
      {x:x+20, y:800-y-150},
      {x:x-50, y:800-y},
      {x:x+90, y:800-y},
    ]

    lib.polygon(batang, abu);
    lib.polygon(daun,abu)
    // lib.FloodFillNonRecursive(x+20,700,coklat,abu);
    // lib.FloodFillNonRecursive(x+20,600,hijau,abu);

}
function cek_collision(){
  
  let balonKiri = 250;
  let balonKanan = 450;
  let balonBawah = 810 + balonY;
  for(let i=0;i<pohon.length;i++){

    let pohonKiri = pohon[i].x;
    let pohonKanan = pohon[i].x + 40;
    let pohonAtas = 800 - pohon[i].y;
    if(
        balonKanan > pohonKiri &&
        balonKiri < pohonKanan &&
        balonBawah > pohonAtas
      ){
        return true;
      }
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
  for(let i = 0; i<pohon.length;i++){
    pohon[i].x -=2
    if(!pohon[i].scored && pohon[i].x + 40 < 250){
      score += 1
      inpo_score.textContent = `Score: ${score}`
      pohon[i].scored=true
    }
    if(pohon[i].x <-100){
      pohon[i].x =1200
      pohon[i].y =Math.floor(Math.random()*250)+100
      pohon[i].scored= false
    }
  }
  if (heating && bensin > 0) {
    kecepatanY -=2;
    bensin -=0.08;

    bar_bensin.value= bensin;
    inpo_bensin.textContent = `${Math.ceil(bensin)}%`;

    if (bensin === 0) {
      heating = false;
    }
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
    alert("tabrak")
    gameOver = true;
  }
  gambar_balon()
  for(let i=0; i<pohon.length; i++){
    gambar_pohon(pohon[i].x,pohon[i].y)
}
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