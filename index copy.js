import myLib from "./lib/lib.js";

let canvas = document.querySelector("#mycanvas");
let context = canvas.getContext("2d", {
  willReadFrequently: true,
});

let image_data = context.getImageData(0, 0, canvas.width, canvas.height);
let lib = new myLib(canvas.width, image_data);
let abu = { r: 150, g: 150, b: 150, a: 255 };
let coklat = { r: 139, g: 69, b: 19 };
let hijau = { r: 0, g: 255, b: 0 };
let merah = { r: 255, g: 0, b: 0};

let balonX = 120
let balonY = 120
let kecepatanY = 0
let heating = false
let tanahY = 160
const alasPohon = 920
let pohon = [
  {x:800, y: 150, scored:false},
  {x:1200, y: 175, scored:false},
  {x:1600, y: 200, scored:false},
]
let gameOver = false
let gameStarted = false
let score = 0
const inpo_score = document.querySelector("#score");
let bensin = 100
const bar_bensin = document.querySelector("#bensin");
const inpo_bensin = document.querySelector("#teksbensin");
const pesanGameOver = document.querySelector("#pesan-game-over");


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
  lib.polygon(kotak1, coklat);
  lib.polygon(kotak2, coklat);
  lib.dda_line(205+balonX,525+balonY,205+balonX,565+balonY,coklat);
  lib.FloodFillNonRecursive(Math.round(225 + balonX) , Math.round(620 +balonY), coklat, coklat);
  lib.dda_line(245+balonX,525+balonY,245+balonX,565+balonY,coklat);
  lib.FloodFillNonRecursive(Math.round(225 +balonX), Math.round(575+balonY), coklat, coklat);

  lib.polygon(balon, coklat);
  lib.FloodFillNonRecursive(Math.round(225+balonX), Math.round(320+balonY), merah, coklat);
  lib.polygon(skirt, coklat);
  lib.FloodFillNonRecursive(Math.round(225 + balonX), Math.round(500 + balonY),coklat,coklat);
}

function gambar_pohon(pohon) {
  const x =pohon.x;
  const h =pohon.y; 
  
  const r = 80; 

  const atasBatang = alasPohon - h;
  const batang = [
    {x: x-20, y: alasPohon},
    {x: x+20, y: alasPohon},
    {x: x+20, y: atasBatang},
    {x: x-20, y: atasBatang},
  ];

  lib.polygon(batang, abu);
  lib.FloodFillNonRecursive(x, alasPohon-75, coklat, abu);

  function gambar_daun(dx, dy) {
    const cx =x + dx;
    const cy = atasBatang + dy; 
    
    for (let i = 1; i <= r; i++) {
      lib.lingkaran_polar(cx, cy, i, hijau);
    }
  }

  gambar_daun(-30,-30);
  gambar_daun(-40,-50);
  gambar_daun(-20,-50);
  gambar_daun(-10,-80);
  gambar_daun(20,-60);
  gambar_daun(30,-70);
  gambar_daun(30,-35);
}

function kotakBertabrakan(a, b) {
  return a.kiri < b.kanan &&
    a.kanan > b.kiri &&
    a.atas < b.bawah &&
    a.bawah > b.atas;
}

function cek_collision(){
  const badanBalon = {
    kiri: balonX + 130,
    kanan: balonX + 320,
    atas: balonY + 180,
    bawah: balonY + 485,
  };
  const keranjangBalon = {
    kiri: balonX + 185,
    kanan: balonX + 265,
    atas: balonY + 485,
    bawah: balonY + 650,
  };

  for (let i = 0; i < pohon.length; i++) {
    const daunPohon = {
      kiri: pohon[i].x - 50,
      kanan: pohon[i].x + 90,
      atas: alasPohon - pohon[i].y - 150,
      bawah: alasPohon - pohon[i].y,
    };
    const batangPohon = {
      kiri: pohon[i].x,
      kanan: pohon[i].x + 40,
      atas: alasPohon - pohon[i].y,
      bawah: alasPohon,
    };

    if (
      kotakBertabrakan(badanBalon, daunPohon) ||
      kotakBertabrakan(badanBalon, batangPohon) ||
      kotakBertabrakan(keranjangBalon, daunPohon) ||
      kotakBertabrakan(keranjangBalon, batangPohon)
    ) {
      return true;
    }
  }

  return false;
}

function gambarKeadaanAwal(){
  lib.restart(context,canvas);

  for (let i = 0; i < pohon.length; i++) {
    gambar_pohon(pohon[i]);
}
  gambar_balon();
  context.putImageData(lib.image_data,0,0);
}

function gambarPesanGameOver(){
  pesanGameOver.hidden = false;
}

function restartGame(){
  balonX = 120;
  balonY = 120;
  kecepatanY = 0;
  heating = false;
  pohon = [
    {x:800, y:150, scored:false},
    {x:1200, y:175, scored:false},
    {x:1600, y:200, scored:false},
  ];
  gameOver = false;
  gameStarted = false;
  pesanGameOver.hidden = true;
  score = 0;
  bensin = 100;
  inpo_score.textContent = "Score: 0";
  bar_bensin.value = 100;
  inpo_bensin.textContent = "100%";
  gambarKeadaanAwal();
}

// Tampilkan posisi awal game tanpa menjalankan pergerakan.
gambarKeadaanAwal();

function update(){
  if(gameOver || !gameStarted){
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
    gameOver = true;
    heating = false;
  }
  for(let i = 0; i < pohon.length; i++){
    gambar_pohon(pohon[i]);
  }
  gambar_balon()
  context.putImageData(lib.image_data,0,0 )
  if(gameOver){
    gambarPesanGameOver();
  }
  requestAnimationFrame(update)
}

canvas.addEventListener("mousedown",function(){
  if (gameStarted && !gameOver) {
    heating = true
  }
})
canvas.addEventListener("mouseup",function(){
  heating = false
})

canvas.addEventListener("click", function(){
  if(gameOver){
    restartGame();
    return;
  }

  if (!gameStarted && !gameOver) {
    gameStarted = true;
    update();
  }
})