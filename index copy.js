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
let backgroundOffset = 0
const alasPohon = 920
let pohon = [
  {x:800, y: 150, scored:false},
  {x:1200, y: 350, scored:false},
  {x:1600, y: 200, scored:false},
]
let pohonLatar = [160, 390, 650, 970, 1280, 1580, 1780]
let gameOver = false
let gameStarted = false
let score = 0
const inpo_score = document.querySelector("#score");
let bensin = 100
const bar_bensin = document.querySelector("#bensin");
const inpo_bensin = document.querySelector("#teksbensin");

function gambar_background() {
  const warnaAtas = { r: 184, g: 215, b: 138 };
  const warnaBawah = { r: 240, g: 242, b: 197 };

  // Langit: warna tiap baris berubah perlahan dari atas ke bawah.
  for (let y = 0; y < canvas.height; y++) {
    const jumlahWarna = y / (canvas.height * 0.78);
    const t = Math.min(jumlahWarna, 1);
    const warnaBaris = {
      r: Math.round(warnaAtas.r + (warnaBawah.r - warnaAtas.r) * t),
      g: Math.round(warnaAtas.g + (warnaBawah.g - warnaAtas.g) * t),
      b: Math.round(warnaAtas.b + (warnaBawah.b - warnaAtas.b) * t),
    };

    for (let x = 0; x < canvas.width; x++) {
      lib.draw_dot(x, y, warnaBaris);
    }
  }
}

const konturBelakang = [
  [0, 0.77], [0.10, 0.76], [0.20, 0.74], [0.32, 0.79],
  [0.45, 0.78], [0.58, 0.74], [0.72, 0.77], [0.86, 0.78], [1, 0.77],
];
const konturTengah = [
  [0, 0.84], [0.25, 0.82], [0.45, 0.88], [0.68, 0.84],
  [0.84, 0.81], [1, 0.84],
];
const konturDepan = [
  [0, 0.89], [0.30, 0.86], [0.55, 0.92], [1, 0.89],
];

function hitungTinggiKontur(kontur, x) {
  const posisi = x / canvas.width;

  for (let i = 0; i < kontur.length - 1; i++) {
    const titikAwal = kontur[i];
    const titikAkhir = kontur[i + 1];

    if (posisi <= titikAkhir[0]) {
      const bagian = (posisi - titikAwal[0]) / (titikAkhir[0] - titikAwal[0]);
      return (titikAwal[1] + (titikAkhir[1] - titikAwal[1]) * bagian) * canvas.height;
    }
  }

  return kontur[kontur.length - 1][1] * canvas.height;
}

function gambarTanahBergerak(offset) {
  const warnaBelakang = { r: 162, g: 207, b: 77 };
  const warnaTengah = { r: 120, g: 173, b: 53 };
  const warnaDepan = { r: 23, g: 77, b: 43 };

  for (let x = 0; x < canvas.width; x++) {
    const posisiSumber = (x + offset) % canvas.width;
    const yBelakang = hitungTinggiKontur(konturBelakang, posisiSumber);
    const yTengah = hitungTinggiKontur(konturTengah, posisiSumber);
    const yDepan = hitungTinggiKontur(konturDepan, posisiSumber);

    for (let y = Math.floor(yBelakang); y < yTengah; y++) {
      lib.draw_dot(x, y, warnaBelakang);
    }
    for (let y = Math.floor(yTengah); y < yDepan; y++) {
      lib.draw_dot(x, y, warnaTengah);
    }
    for (let y = Math.floor(yDepan); y < canvas.height; y++) {
      lib.draw_dot(x, y, warnaDepan);
    }
  }
}

gambar_background();
context.putImageData(lib.image_data, 0, 0);
const backgroundImageData = context.getImageData(0, 0, canvas.width, canvas.height);
lib.image_data = context.getImageData(0, 0, canvas.width, canvas.height);

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
function gambar_pohon(x,y,skala=1,alas=alasPohon){
    let batang = [
        {x:Math.round(x), y:Math.round(alas)},
        {x:Math.round(x+40*skala), y:Math.round(alas)},
        {x:Math.round(x+40*skala), y:Math.round(alas-y*skala)},
        {x:Math.round(x), y:Math.round(alas-y*skala)}
    ];

    let daun = [
      {x:Math.round(x+20*skala), y:Math.round(alas-y*skala-150*skala)},
      {x:Math.round(x-50*skala), y:Math.round(alas-y*skala)},
      {x:Math.round(x+90*skala), y:Math.round(alas-y*skala)},
    ]

    lib.polygon(batang, abu);
    lib.polygon(daun,abu)
    lib.FloodFillNonRecursive(Math.round(x+20*skala), Math.round(alas-y*skala/2), coklat, abu);
    lib.FloodFillNonRecursive(Math.round(x+20*skala), Math.round(alas-y*skala-75*skala), hijau, abu);

}
function gambarPohonLatar(){
  for(let i=0; i<pohonLatar.length; i++){
    const posisiKontur = (pohonLatar[i] + backgroundOffset) % canvas.width;
    const alas = Math.round(hitungTinggiKontur(konturBelakang, posisiKontur));
    gambar_pohon(pohonLatar[i], 80, 0.2, alas);
  }
}
function cek_collision(){
  const sisiKiriBalon = [
    [180, 225], [190, 160], [230, 140], [280, 130],
    [340, 135], [390, 155], [440, 180], [485, 195],
  ];
  const sisiKananBalon = [
    [180, 225], [190, 280], [230, 310], [280, 320],
    [340, 315], [390, 295], [440, 270], [485, 255],
  ];
  const keranjangKiri = 185 + balonX;
  const keranjangKanan = 265 + balonX;
  const keranjangAtas = 565 + balonY;
  const keranjangBawah = 650 + balonY;

  function cariBatasBalon(sisi, y) {
    for (let i = 0; i < sisi.length - 1; i++) {
      const awal = sisi[i];
      const akhir = sisi[i + 1];

      if (y <= akhir[0]) {
        const bagian = (y - awal[0]) / (akhir[0] - awal[0]);
        return awal[1] + (akhir[1] - awal[1]) * bagian;
      }
    }

    return sisi[sisi.length - 1][1];
  }

  for (let i = 0; i < pohon.length; i++) {
    const daunKiri = pohon[i].x - 50;
    const daunKanan = pohon[i].x + 90;
    const daunAtas = alasPohon - pohon[i].y - 150;
    const daunBawah = alasPohon - pohon[i].y;
    const batangKiri = pohon[i].x;
    const batangKanan = pohon[i].x + 40;
    const batangAtas = alasPohon - pohon[i].y;
    const batangBawah = alasPohon;

    for (
      let y = Math.max(180, daunAtas - balonY);
      y <= Math.min(485, daunBawah - balonY);
      y++
    ) {
      const lebarDaun = 70 * (balonY + y - daunAtas) / 150;
      const daunKiriPadaY = pohon[i].x + 20 - lebarDaun;
      const daunKananPadaY = pohon[i].x + 20 + lebarDaun;
      const balonKiriPadaY = balonX + cariBatasBalon(sisiKiriBalon, y);
      const balonKananPadaY = balonX + cariBatasBalon(sisiKananBalon, y);

      if (
        balonKananPadaY >= daunKiriPadaY &&
        balonKiriPadaY <= daunKananPadaY
      ) {
        return true;
      }
    }

    for (
      let y = Math.max(180, batangAtas - balonY);
      y <= Math.min(485, batangBawah - balonY);
      y++
    ) {
      const balonKiriPadaY = balonX + cariBatasBalon(sisiKiriBalon, y);
      const balonKananPadaY = balonX + cariBatasBalon(sisiKananBalon, y);

      if (
        balonKananPadaY >= batangKiri &&
        balonKiriPadaY <= batangKanan
      ) {
        return true;
      }
    }

    if (
      (keranjangKanan > daunKiri &&
        keranjangKiri < daunKanan &&
        keranjangBawah > daunAtas &&
        keranjangAtas < daunBawah) ||
      (keranjangKanan > batangKiri &&
        keranjangKiri < batangKanan &&
        keranjangBawah > batangAtas &&
        keranjangAtas < batangBawah)
    ) {
      return true;
    }
  }

  return false;
}

function gambarKeadaanAwal(){
  lib.restart(context,canvas);
  context.putImageData(backgroundImageData,0,0);
  lib.image_data = context.getImageData(0,0,canvas.width,canvas.height);
  gambarTanahBergerak(backgroundOffset);
  gambarPohonLatar();
  gambar_balon();
  for(let i=0; i<pohon.length; i++){
    gambar_pohon(pohon[i].x,pohon[i].y);
  }
  context.putImageData(lib.image_data,0,0);
}

function gambarPesanGameOver(){
  context.fillStyle = "black";
  context.font = "bold 36px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GAME OVER - Klik untuk restart", canvas.width / 2, canvas.height / 2);
}

function restartGame(){
  balonX = 120;
  balonY = 120;
  kecepatanY = 0;
  heating = false;
  backgroundOffset = 0;
  pohon = [
    {x:800, y:150, scored:false},
    {x:1200, y:350, scored:false},
    {x:1600, y:200, scored:false},
  ];
  pohonLatar = [160, 390, 650, 970, 1280, 1580, 1780];
  gameOver = false;
  gameStarted = false;
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
  context.putImageData(backgroundImageData, 0, 0)
  lib.image_data = context.getImageData(0, 0, canvas.width, canvas.height)
  backgroundOffset = (backgroundOffset + 2) % canvas.width
  gambarTanahBergerak(backgroundOffset)
  for(let i=0; i<pohonLatar.length; i++){
    pohonLatar[i] = (pohonLatar[i] - 2 + canvas.width) % canvas.width;
  }
  gambarPohonLatar();
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
  gambar_balon()
  for(let i=0; i<pohon.length; i++){
    gambar_pohon(pohon[i].x,pohon[i].y)
}
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