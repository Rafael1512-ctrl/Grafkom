import myLib from "./lib/lib.js";

let canvas = document.querySelector("#mycanvas");
let context = canvas.getContext("2d", {
  willReadFrequently: true,
});

let image_data = context.getImageData(0, 0, canvas.width, canvas.height);
let lib = new myLib(canvas.width, image_data);
let abu = {r:150, g:150, b:150};
let coklat = {r:139, g:69, b:19};
let hijau = {r:0, g:255, b:0};
let merah = {r:255, g: 0, b:0};
const alasPohon = 940
const tinggiBalon = 650
let tanahY = alasPohon-tinggiBalon
let balonX = 120
let balonY = tanahY
let kecepatanY = 0
let heating = false


// let pohon = [
//   {x:800, y: 150, scored:false},
//   {x:1200, y: 175, scored:false},
//   {x:1600, y: 200, scored:false},
// ]
let gameOver = false
let gameStarted = false
let score = 0
const inpo_score = document.querySelector("#score");
let bensin = 100
const bar_bensin = document.querySelector("#bensin");
const inpo_bensin = document.querySelector("#teksbensin");
const pesanGameOver = document.querySelector("#pesan-game-over");



function jarakPohon(){
  return Math.floor(300+Math.random()*81)
}
function tinggiPohonAcak() {
  return Math.floor(Math.random()*120) + 150
}
function buatPohonAwal(){
  const daftarpohon =[]
  let x = canvas.width +120
  for (let i = 0; i < 6; i++) {
    daftarpohon.push({x: x,y: tinggiPohonAcak(),scored: false})
    x += jarakPohon()
  }
  return daftarpohon
}
let pohon = buatPohonAwal()
function gambar_balon() {
  var kotak1 = [
    {x:265, y:650},
    {x:265, y:580},
    {x:185, y:580}, 
    {x:185, y:650}
  ];
  var kotak2 = [
    {x:265, y:650}, 
    {x:265, y:565},
    {x:185, y:565}, 
    {x:185, y:650}
  ];
  
  let skirt = [
    {x:181, y:485},
    {x:269, y:485},
    {x:255, y:525},
    {x:195, y:525}
  ];

  kotak1 = lib.multiple_translate(kotak1, {x: balonX, y: balonY});
  kotak2 = lib.multiple_translate(kotak2, {x: balonX, y: balonY});
  skirt = lib.multiple_translate(skirt, {x: balonX, y: balonY});

  lib.polygon(kotak1, coklat);
  lib.polygon(kotak2, coklat);
  lib.dda_line(205+balonX, 525+balonY, 205+balonX, 565+balonY, coklat);
  lib.FloodFillNonRecursive(Math.round(225+balonX), Math.round(620 + balonY), coklat, coklat);
  lib.dda_line(245+balonX, 525+balonY, 245+balonX, 565+balonY, coklat);
  lib.FloodFillNonRecursive(Math.round(225+balonX), Math.round(575 + balonY), coklat, coklat);

  lib.elips(225+balonX, 330+balonY, 145, 180, coklat);
  lib.FloodFillNonRecursive(Math.round(225+balonX), Math.round(330+balonY + 140), merah, coklat);

  lib.polygon(skirt, coklat);
  lib.FloodFillNonRecursive(Math.round(225+balonX), Math.round(515+balonY), coklat, coklat);
}

function gambar_pohon(pohon) {
  const x =pohon.x;
  const h =pohon.y;  

  const atasBatang = alasPohon - h;
  const batang = [
    {x:x-20, y:alasPohon},
    {x:x+20, y:alasPohon},
    {x:x+20, y:atasBatang},
    {x:x-20, y:atasBatang},
  ];

  lib.polygon(batang, abu);
  lib.FloodFillNonRecursive(x, alasPohon-75, coklat, abu);

  function gambar_daun_kiri(dx, dy) {
    const cx = x+dx;
    const cy = atasBatang+dy; 
    
    lib.lingkaran_polar(cx, cy, 80, hijau);
    lib.FloodFillNonRecursive(cx-50,cy-30,hijau, hijau)
  }

  function gambar_daun_kanan(dx, dy) {
    const cx = x+dx;
    const cy = atasBatang+dy; 
    
    lib.lingkaran_polar(cx, cy, 80, hijau);
    lib.FloodFillNonRecursive(cx+50,cy+50,hijau, hijau)
  }

  gambar_daun_kiri(-30,-30);
  gambar_daun_kiri(-25,-70);
  gambar_daun_kanan(30,-70);
  gambar_daun_kanan(30,-35);
}

function jarak(point1, point2) {
  return Math.sqrt((point2.x-point1.x)**2 + (point2.y-point1.y)**2);
}

function cek_collision() { 
  const titikBalon = [
    {x:balonX+130, y:balonY+180}, 
    {x:balonX+320, y:balonY+180}, 
    {x:balonX+130, y:balonY+485}, 
    {x:balonX+320, y:balonY+485}, 
    
    {x:balonX+185, y:balonY+485}, 
    {x:balonX+265, y:balonY+485}, 
    {x:balonX+185, y:balonY+650}, 
    {x:balonX+265, y:balonY+650}  
  ];

  const radius = 80;
  for (let i = 0; i < pohon.length; i++) {
    const pohonX = pohon[i].x;
    const atasBatang = alasPohon - pohon[i].y;
    const daun1 = {x:pohonX-30, y:atasBatang-30};
    const daun2 = {x:pohonX-25, y:atasBatang-70};
    const daun3 = {x:pohonX+30, y:atasBatang-70};
    const daun4 = {x:pohonX+30, y:atasBatang-35};

    for (let j = 0; j < titikBalon.length; j++) {
      const balon = titikBalon[j];
      if (jarak(balon, daun1)<radius || jarak(balon, daun2)<radius || jarak(balon, daun3)<radius || jarak(balon, daun4)<radius) {
        return true; 
      }
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
  balonY = tanahY;
  kecepatanY = 0;
  heating = false;
  pohon = buatPohonAwal()
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
    pohon[i].x -= 5
    if(!pohon[i].scored && pohon[i].x + 40 < 250){
      score += 1
      inpo_score.textContent = `Score: ${score}`
      pohon[i].scored=true
    }
    if(pohon[i].x <-120){
      let palingkanan = -Infinity
      for(let j=0;j<pohon.length;j++){
        if(j !== i && pohon[j].x > palingkanan){
          palingkanan = pohon[j].x
        }
      }
      pohon[i].x =Math.max(canvas.width+120,palingkanan+jarakPohon())
      pohon[i].y =tinggiPohonAcak()
      pohon[i].scored= false
    }
  }
  if (heating && bensin > 0) {
    kecepatanY -=6
    bensin -=0.5;

    bar_bensin.value= bensin;
    inpo_bensin.textContent = `${Math.ceil(bensin)}%`;

    if (bensin === 0) {
      heating = false;
    }
  }
  kecepatanY += 0.2

  if(kecepatanY <-5){
    kecepatanY = -5
  }

  if(kecepatanY>5){
    kecepatanY = 5
  }
  balonY += kecepatanY

  if (balonY < -150) {
    balonY = -150
    kecepatanY = 0
  }

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