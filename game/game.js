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
    const titikBalon = [
        {x:this.balon.balonX+130, y:this.balon.balonY+180}, 
        {x:this.balon.balonX+320, y:this.balon.balonY+180}, 
        {x:this.balon.balonX+130, y:this.balon.balonY+485}, 
        {x:this.balon.balonX+320, y:this.balon.balonY+485}, 
        
        {x:this.balon.balonX+185, y:this.balon.balonY+485}, 
        {x:this.balon.balonX+265, y:this.balon.balonY+485}, 
        {x:this.balon.balonX+185, y:this.balon.balonY+650}, 
        {x:this.balon.balonX+265, y:this.balon.balonY+650}  
    ];

    const radius = 80
    for (let i = 0; i < this.pohon.length; i++) {
        const pohonX = this.pohon[i].x
        const atasBatang = this.alasPohon - this.pohon[i].y
        const daun1 = {x:pohonX-30, y:atasBatang-30}
        const daun2 = {x:pohonX-25, y:atasBatang-70}
        const daun3 = {x:pohonX+30, y:atasBatang-70}
        const daun4 = {x:pohonX+30, y:atasBatang-35}

        for (let j = 0; j < titikBalon.length; j++) {
        const balon = titikBalon[j]
        if (this.jarak(balon, daun1)<radius || this.jarak(balon, daun2)<radius || this.jarak(balon, daun3)<radius || this.jarak(balon, daun4)<radius) {
            return true
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





