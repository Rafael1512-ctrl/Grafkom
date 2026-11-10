export default class pohon{
    constructor(lib,x,y,alasPohon,abu,coklat,hijau){
        this.lib = lib
        this.x = x
        this.y = y
        this.alasPohon = alasPohon
        this.abu = abu
        this.coklat = coklat
        this.hijau = hijau
        this.scored = false
    }

    update(){
        this.x -=5
    }
    gambar_pohon() {
        const x =this.x
        const atasBatang = this.alasPohon - this.y
        const batang = [
            {x:x-20, y:this.alasPohon},
            {x:x+20, y:this.alasPohon},
            {x:x+20, y:atasBatang},
            {x:x-20, y:atasBatang},
        ];

        this.lib.polygon(batang, this.abu)
        this.lib.FloodFillNonRecursive(x, this.alasPohon-75, this.coklat, this.abu)

        const gambar_daun=(dx, dy,kanan)=> {
            const cx = x+dx
            const cy = atasBatang+dy 
            
            this.lib.lingkaran_polar(cx, cy, 80, this.hijau)
            if(kanan){
                this.lib.FloodFillNonRecursive(cx+50,cy+30,this.hijau, this.hijau)
            }else{
                this.lib.FloodFillNonRecursive(cx-50,cy-30,this.hijau, this.hijau)   
            }
        }

        gambar_daun(-30,-30,false)
        gambar_daun(-25,-70,false)
        gambar_daun(30,-70,true)
        gambar_daun(30,-35,true)
    }
    respawn(x,y){
        this.x = x
        this.y = y
        this.scored = false
    }
}
