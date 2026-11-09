import balon from "./balon.js"
import pohon from "./pohon.js"
export default class game{
    constructor(canvas,context,lib){
        this.canvas = canvas
        this.context = context
        this.lib = lib
        this.abu = {r:150, g:150, b:150}
        this.coklat = {r:139, g:69, b:19}
        this.hijau = {r:0, g:255, b:0}
        this.merah = {r:255, g: 0, b:0}
        this.alasPohon = 940
        this.tinggiBalon = 650
        this.tanahY = this.alasPohon-this.tinggiBalon
        this.balon = new balon(canvas,context,lib,this.tanahY) 
        this.pohon = this.buatPohonAwal()
        this.heating = false
        this.gameOver = false
        this.gameStarted = false
        this.score = 0
        this.pesanGameOver = document.querySelector("#pesan-game-over")
    }
    jarakPohon(){
        return Math.floor(300+Math.random()*81)
    }
    tinggiPohonAcak() {
        return Math.floor(Math.random()*120) + 150
    }
    buatPohonAwal(){
        const daftarpohon =[]
        let x = this.canvas.width +120
        for (let i = 0; i < 6; i++) {
            daftarpohon.push(new pohon(this.lib,x,this.tinggiPohonAcak(),this.alasPohon,this.abu,this.coklat,this.hijau))
            x += this.jarakPohon()
    }
    return daftarpohon
    }
    jarak(point1, point2) {
        return Math.sqrt((point2.x-point1.x)**2 + (point2.y-point1.y)**2)
    }

    cek_collision() { 
        const titikBalon = []
        const balonX = this.balon.balonX
        const balonY = this.balon.balonY

        const pusatX = balonX + 225
        const pusatY = balonY + 330

        for ( let sudut = 0; sudut<360; sudut +=10){
            const radian = sudut*Math.PI/180

            titikBalon.push({ x: pusatX+145*Math.cos(radian), y: pusatY+180*Math.sin(radian)})
        }

        for(let x=181; x<=269;x+=10){
            titikBalon.push({ x: balonX+x,y:balonY+485})
            titikBalon.push({ x: balonX+x,y:balonY+650})
        }

        for(let y=485; y<=650;y+=10){
            titikBalon.push({ x: balonX+181,y:balonY+y})
            titikBalon.push({ x: balonX+269,y:balonY+y})
        }
        const radius = 80
        for (let i = 0; i < this.pohon.length; i++) {
            const pohon = this.pohon[i]
            const atasBatang = this.alasPohon - pohon.y
            const daun =[
                {x:pohon.x -30, y:atasBatang-30},
                {x:pohon.x-25,y:atasBatang-70},
                {x:pohon.x+30,y:atasBatang-70},
                {x:pohon.x+30,y:atasBatang-35}
            ] 

            for (let j = 0; j < daun.length; j++) {
                const pusatDaun = daun[j]
                const dx =(pusatDaun.x-pusatX)/145
                const dy =(pusatDaun.y - pusatY)/180
                const diDalamElips = dx*dx+dy*dy<=1
                const diDalamKeranjang=
                    pusatDaun.x >= balonX + 181 &&
                    pusatDaun.x <= balonX + 269 &&
                    pusatDaun.y >= balonY + 485 &&
                    pusatDaun.y <= balonY + 650
            
                if (diDalamElips||diDalamKeranjang){
                    return true
                }
                for(let k=0;k<titikBalon.length;k++){
                    if (this.jarak(titikBalon[k],pusatDaun) <radius) {
                    return true
                }
            }
            }
        } 
        return false
    }
    gambarInfo(){
        this.context.fillStyle = "black"
        this.context.font = "bold 48px Arial"
        this.context.textAlign = "right"
        this.context.fillText(`Score: ${this.score}`,this.canvas.width-24,45)
        this.context.textAlign = "left"
        this.context.fillText(`Fuel: ${Math.ceil(this.balon.bensin)}%`,24,45)
    }
    gambarKeadaanAwal(){
        this.lib.restart()
        for (let i = 0; i < this.pohon.length; i++) {
            this.pohon[i].gambar_pohon()
        }
        this.balon.gambar_balon()
        this.context.putImageData(this.lib.image_data,0,0)
        this.gambarInfo()
    }

    gambarPesanGameOver(){
        this.pesanGameOver.hidden = false
    }

    update(){
        if(this.gameOver || !this.gameStarted){
                return
            }
            this.lib.restart()
            for(let i = 0; i<this.pohon.length;i++){
                this.pohon[i].update()
                if(!this.pohon[i].scored && this.pohon[i].x + 40 <250){
                this.score += 1
                this.pohon[i].scored=true
                }
                if(this.pohon[i].x <-120){
                    let palingkanan = -Infinity
                    for(let j=0;j<this.pohon.length;j++){
                        if(j !== i && this.pohon[j].x > palingkanan){
                            palingkanan = this.pohon[j].x
                        }
                    }
                    const xbaru=Math.max(this.canvas.width+120,palingkanan+this.jarakPohon())
                    this.pohon[i].respawn(xbaru,this.tinggiPohonAcak())
                }
            }
            
            this.heating = this.balon.update(this.heating)

            if(this.cek_collision()){
                this.gameOver = true
                this.heating = false
            }
            for(let i = 0; i < this.pohon.length; i++){
                this.pohon[i].gambar_pohon()
            }
            this.balon.gambar_balon()
            this.context.putImageData(this.lib.image_data,0,0 )
            this.gambarInfo()
            if(this.gameOver){
                this.gambarPesanGameOver()
            }
            requestAnimationFrame(() => this.update())
    }
    restartGame(){
        this.heating = false
        this.pohon = this.buatPohonAwal()
        this.gameOver = false
        this.gameStarted = false
        this.pesanGameOver.hidden = true
        this.score = 0
        this.balon.reset()
        this.gambarKeadaanAwal()
    }

    start() {
        this.bindEvents()
        this.gambarKeadaanAwal()
    }
    bindEvents(){
        this.canvas.addEventListener("mousedown",() =>{
        if (this.gameStarted && !this.gameOver) {
            this.heating = true
        }
        })
        this.canvas.addEventListener("mouseup",() =>{
        this.heating = false
        })

        this.canvas.addEventListener("click", () => {
        if (this.gameOver) {
            this.restartGame()
            return
        }

        if (!this.gameStarted && !this.gameOver) {
            this.gameStarted = true
            this.update()
        }
        });
    }
}





