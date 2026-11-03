export default class balon{
    constructor(canvas,context,lib,tanahY){
        this.canvas = canvas
        this.context = context
        this.lib = lib
        this.tanahY = tanahY
        this.balonX = 120
        this.balonY = tanahY
        this.kecepatanY = 0
        this.bensin = 100
        this.coklat = {r:139, g:69, b:19}
        this.merah = {r:255, g: 0, b:0}
    }
    gambar_balon() {
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

        kotak1 = this.lib.multiple_translate(kotak1, {x: this.balonX, y: this.balonY})
        kotak2 = this.lib.multiple_translate(kotak2, {x: this.balonX, y: this.balonY})
        skirt = this.lib.multiple_translate(skirt, {x: this.balonX, y: this.balonY})

        this.lib.polygon(kotak1, this.coklat)
        this.lib.polygon(kotak2, this.coklat)
        this.lib.dda_line(205+this.balonX, 525+this.balonY, 205+this.balonX, 565+this.balonY, this.coklat)
        this.lib.FloodFillNonRecursive(Math.round(225+this.balonX), Math.round(620 + this.balonY), this.coklat, this.coklat)
        this.lib.dda_line(245+this.balonX, 525+this.balonY, 245+this.balonX, 565+this.balonY, this.coklat)
        this.lib.FloodFillNonRecursive(Math.round(225+this.balonX), Math.round(575 + this.balonY), this.coklat, this.coklat)

        this.lib.elips(225+this.balonX, 330+this.balonY, 145, 180, this.coklat)
        this.lib.FloodFillNonRecursive(Math.round(225+this.balonX), Math.round(330+this.balonY + 140), this.merah, this.coklat)

        this.lib.polygon(skirt, this.coklat)
        this.lib.FloodFillNonRecursive(Math.round(225+this.balonX), Math.round(515+this.balonY), this.coklat, this.coklat)
    }
    update(heating){
        if (heating && this. bensin > 0) {
            this.kecepatanY -=6
            this.bensin -=0.5

            if (this.bensin <= 0) {
                this.bensin = 0
                heating = false
            }
        }
        this.kecepatanY += 0.2

        if(this.kecepatanY <-5){
            this.kecepatanY = -5
        }

        if(this.kecepatanY>5){
            this.kecepatanY = 5
        }
        this.balonY += this.kecepatanY

        if (this.balonY < -150) {
            this.balonY = -150
            this.kecepatanY = 0
        }

        if(this.balonY > this.tanahY){
            this.balonY = this.tanahY
            this.kecepatanY = 0
        }
        return heating
    }
    reset(){
        this.balonX = 120;
        this.balonY = this.tanahY;
        this.kecepatanY = 0;
        this.bensin = 100;
    }
}