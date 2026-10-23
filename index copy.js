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

function gambar_background() {
  const warnaAtas = { r: 184, g: 215, b: 138 };
  const warnaBawah = { r: 240, g: 242, b: 197 };
  const garisBatas = abu;
  const kanan = canvas.width - 1;
  const bawah = canvas.height - 1;

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

  // Bukit belakang
  const bukitBelakang = [
    { x: 0, y: canvas.height * 0.77 },
    { x: kanan * 0.10, y: canvas.height * 0.76 },
    { x: kanan * 0.20, y: canvas.height * 0.74 },
    { x: kanan * 0.32, y: canvas.height * 0.79 },
    { x: kanan * 0.45, y: canvas.height * 0.78 },
    { x: kanan * 0.58, y: canvas.height * 0.74 },
    { x: kanan * 0.72, y: canvas.height * 0.77 },
    { x: kanan * 0.86, y: canvas.height * 0.78 },
    { x: kanan, y: canvas.height * 0.75 },
    { x: kanan, y: bawah },
    { x: 0, y: bawah },
  ];
  const warnaBukitBelakang = { r: 162, g: 207, b: 77 };
  lib.polygon(bukitBelakang, garisBatas);
  lib.FloodFillNonRecursive(Math.floor(canvas.width * 0.5),Math.floor(canvas.height * 0.9),warnaBukitBelakang,garisBatas);

  // Tanah bagian tengah
  const tanahTengah = [
    { x: 0, y: canvas.height * 0.84 },
    { x: kanan * 0.25, y: canvas.height * 0.82 },
    { x: kanan * 0.45, y: canvas.height * 0.88 },
    { x: kanan * 0.68, y: canvas.height * 0.84 },
    { x: kanan * 0.84, y: canvas.height * 0.81 },
    { x: kanan, y: canvas.height * 0.83 },
    { x: kanan, y: bawah },
    { x: 0, y: bawah },
  ];
  const warnaTanahTengah = { r: 120, g: 173, b: 53 };
  lib.polygon(tanahTengah, garisBatas);
  lib.FloodFillNonRecursive(Math.floor(canvas.width * 0.5),Math.floor(canvas.height * 0.92),warnaTanahTengah,garisBatas);

  // Lapisan rumput paling depan
  const rumputDepan = [
    { x: 0, y: canvas.height * 0.89 },
    { x: kanan * 0.30, y: canvas.height * 0.86 },
    { x: kanan * 0.55, y: canvas.height * 0.92 },
    { x: kanan, y: canvas.height * 0.88 },
    { x: kanan, y: bawah },
    { x: 0, y: bawah },
  ];
  const warnaRumputDepan = { r: 23, g: 77, b: 43 };
  lib.polygon(rumputDepan, garisBatas);
  lib.FloodFillNonRecursive(Math.floor(canvas.width * 0.5),Math.floor(canvas.height * 0.96),warnaRumputDepan,garisBatas);
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
  context.putImageData(backgroundImageData, 0, 0)
  lib.image_data = context.getImageData(0, 0, canvas.width, canvas.height)
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