export default class MatrixClass {
  constructor() {}
  multiply(matA, matB) {
    let matrixHasil = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          matrixHasil[i][k] += matA[i][j] * matB[j][k];
        }
      }
    }
    return matrixHasil
  }
  transform_point(PointerEvent, matT) {
    return {
      x: PointerEvent.x*matT[0][0] + PointerEvent.y*matT[0][1] + matT[0][2]*1 ,
      y: PointerEvent.x*matT[1][0]  + PointerEvent.y*matT[1][1] + matT[1][2]*1,
    };
  }
  transform_points(points, matT) {
    var hasil = [];
    for (let i = 0; i < points.length; i++){
        var titik_hasil;
        titik_hasil = this.transform_point(points[i], matT);
        hasil.push(titik_hasil)
    }
    return hasil
  }
  create_identity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  create_translansi(tx, ty) {
    return [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ];
  }
  create_scale(sx, sy) {
    return [
      [1, 0, sx],
      [0, 1, sy],
      [0, 0, 1],
    ];
  }
  create_rotation(degree) {
    var skala = [
        [Math.cos(degree),-Math.sin(degree),0],
        [Math.sin(degree),Math.cos(degree),0],
        [0,0,1]
    ]
    return skala;
  }
  create_fixedp_rotation(xc, yc, degree) {
    var m1 = this.create_translansi(-xc,-yc)
    var m2 = this.create_rotation(degree)
    var m3 = this.create_translansi(xc,yc)

    var hasil;
    hasil = this.multiply(m3,m2)
    hasil = this.multiply(hasil,m1)
    return hasil
  }
  create_fixedp_scale(xc, yc, sx, sy) {
    var m1 = this.create_translansi(-xc,-yc)
    var m2 = this.create_scale(sx,sy)
    var m3 = this.create_translansi(xc,yc)

    var hasil;
    hasil = this.multiply(m3,m2)
    hasil = this.multiply(hasil,m1)
    return hasil
  }
}
