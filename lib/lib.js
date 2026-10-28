export default class graflib {
  constructor(canvas_width, image_data) {
    this.canvas_width = canvas_width;
    this.image_data = image_data;
  }
  draw_dot( x, y, color) {
    let index = (x + y * this.canvas_width) * 4;
    this.image_data.data[index] = color.r;
    this.image_data.data[index + 1] = color.g;
    this.image_data.data[index + 2] = color.b;
    this.image_data.data[index + 3] = 255;
  }

  dda_line( x1, y1, x2, y2, color) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (x2 > x1) {
        let y = y1;
        for (let x = x1; x < x2; x++) {
          y = y + dy / Math.abs(dx);
          this.draw_dot( Math.round(x), Math.round(y), color);
        }
      } else {
        let y = y1;
        for (let x = x1; x > x2; x--) {
          y = y + dy / Math.abs(dx);
          this.draw_dot( Math.round(x), Math.round(y), color);
        }
      }
    } else {
      if (y2 > y1) {
        let x = x1;
        for (let y = y1; y < y2; y++) {
          x = x + dx / Math.abs(dy);
          this.draw_dot( Math.round(x), Math.round(y), color);
        }
      } else {
        let x = x1;
        for (let y = y1; y > y2; y--) {
          x = x + dx / Math.abs(dy);
          this.draw_dot( Math.round(x), Math.round(y), color);
        }
      }
    }
  }
  naive_circle( xc, yc, radius, color) {
    for (let x = xc - radius; x <= xc + radius; x++) {
      let y = Math.sqrt(radius * radius - (x - xc) * (x - xc)) + yc;
      let y2 = -Math.sqrt(radius * radius - (x - xc) * (x - xc)) + yc;
      this.draw_dot( x, Math.round(y2), color);
      this.draw_dot( x, Math.round(y), color);

      console.log("circle drawn");
    }
  }

  get_dot( x, y) {
    let index = (x + y * this.canvas_width) * 4;
    let r = this.image_data.data[index];
    let g = this.image_data.data[index + 1];
    let b = this.image_data.data[index + 2];
    return { r: r, b: b, g: g };
  }

  lingkaran_polar( xc, yc, radius, color) {
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.01) {
      let x = xc + radius * Math.cos(theta);
      let y = yc + radius * Math.sin(theta);
      this.draw_dot( Math.round(x), Math.round(y), color);
      // console.log(x)
      // console.log(y)
    }
    //     console.log("circle")
  }

  elips( xc, yc, rx, ry, color) {
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.001) {
      let x = xc + rx * Math.cos(theta);
      let y = yc + ry * Math.sin(theta);
      this.draw_dot( Math.round(x), Math.round(y), color);
      console.log(x);
      console.log(y);
    }
    console.log("elips");
  }

  obat_nyamuk( xc, yc, color) {
    for (let theta = 0; theta <= Math.PI * 6; theta += 0.001) {
      let r = 5 * theta;
      let x = xc + r * Math.cos(theta);
      let y = yc + r * Math.sin(theta);
      this.draw_dot( Math.round(x), Math.round(y), color);
      console.log(x);
      console.log(y);
    }
    console.log("elips");
  }

  bunga( xc, yc, r, n, color) {
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.001) {
      let x = xc + r * Math.cos(n * theta) * Math.cos(theta);
      let y = yc + r * Math.cos(n * theta) * Math.sin(theta);
      this.draw_dot( Math.round(x), Math.round(y), color);
      console.log(x);
      console.log(y);
    }
    console.log("bunga");
  }

  cardiod( xc, yc, r, color) {
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.001) {
      let x = xc + (r + r * Math.sin(theta) * Math.cos(theta));
      let y = yc + (r + r * Math.sin(theta) * Math.sin(theta));
      this.draw_dot( Math.round(x), Math.round(y), color);
      console.log(x);
      console.log(y);
    }
    console.log("cardiod");
  }

  check_warna(warna1, warna2) {
    if (warna1.r == warna2.r && warna1.g == warna2.g && warna1.b == warna2.b) {
      return 0;
    }
    return 1;
  }

  boundary_fill( x, y, warna_stop, warna_yang_dimau) {
    let warna_sekarang = get_dot( x, y);
    if (
      this.check_warna(warna_sekarang, warna_stop) == 0 ||
      this.check_warna(warna_sekarang, warna_yang_dimau) == 0
    ) {
      return;
    } else {
      this.draw_dot( x, y, warna_yang_dimau);
      boundary_fill( x + 1, y, warna_stop, warna_yang_dimau);
      boundary_fill( x - 1, y, warna_stop, warna_yang_dimau);
      boundary_fill( x, y + 1, warna_stop, warna_yang_dimau);
      boundary_fill( x, y - 1, warna_stop, warna_yang_dimau);
    }
  }

  polygon( array_titik, color) {
    for (let i = 0; i < array_titik.length - 1; i++) {
      this.dda_line(array_titik[i].x,array_titik[i].y,array_titik[i + 1].x,array_titik[i + 1].y,color,);
    }
    this.dda_line ( array_titik[0].x, array_titik[0].y, array_titik[array_titik.length-1].x, array_titik[array_titik.length-1].y, color);
  }

  FloodFillNonRecursive( x, y, color, color_stop) {
    const stack = [];
    stack.push({ x: x, y: y });
    while (stack.length > 0) {
      const current = stack.pop();
      if (current.x < 0 ||current.x >= this.image_data.width || current.y < 0 || current.y >= this.image_data.height
      ) {
        continue;
      }

      const currentColor = this.get_dot( current.x, current.y);
      if (
        this.check_warna(currentColor, color) == 0 ||
        this.check_warna(currentColor, color_stop) == 0
      ) {
        continue;
      }
      this.draw_dot( current.x, current.y, color);
      stack.push({ x: current.x + 1, y: current.y });
      stack.push({ x: current.x - 1, y: current.y });
      stack.push({ x: current.x, y: current.y + 1 });
      stack.push({ x: current.x, y: current.y - 1 });
    }
  }

  gambar_kotak( x, y, color) {
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        this.draw_dot( x + i, y + j, color);
      }
    }
  }
  translate(point, translatation) {
    return {
      x: point.x + translatation.x,
      y: point.y + translatation.y,
    };
  }

  multiple_translate(points, translatation) {
    let results = [];
    for (let i = 0; i < points.length; i++) {
      results[i] = this.translate(points[i], translatation);
    }
    return results;
  }

  scale(point, scale_factor) {
    return {
      x: point.x * scale_factor.x,
      y: point.y * scale_factor.y,
    };
  }

  multiple_scale(points, scale_factor) {
    let results = [];
    for (let i = 0; i < points.length; i++) {
      results[i] = this.scale(points[i], scale_factor);
    }
    return results;
  }

  rotate(point, angle) {
    let radian = angle * (Math.PI / 180);
    return {
      x: point.x * Math.cos(radian) - point.y * Math.sin(radian),
      y: point.x * Math.sin(radian) + point.y * Math.cos(radian),
    };
  }

  rotasiFP(points, angle, anchor) {
    let results = [];
    let radian = angle * Math.PI / 180;
    for(let i = 0; i < points.length; i++){
        let x = points[i].x - anchor.x;
        let y = points[i].y - anchor.y;
        let xBaru =
            x * Math.cos(radian) -
            y * Math.sin(radian);
        let yBaru =
            x * Math.sin(radian) +
            y * Math.cos(radian);
        results.push({
            x : xBaru + anchor.x,
            y : yBaru + anchor.y
        });
    }

    return results;
}

  restart(context, canvas_handler){
        context.clearRect(0, 0, canvas_handler.width, canvas_handler.height);
        this.image_data = context.getImageData(0, 0, canvas_handler.width, canvas_handler.height);
    }
}
// let array_titik =[
//     {x:100,y:100},
// ]

// let array_titik = [
//     [100,100],
// ]

// for (let x = xc - radius; x <= xc+radius;x++){
//     for (let y = yc - radius; y <= yc+radius;y++){
// if((xc-x)*(xc-x) + (y-yc)*(y-yc) <= radius*radius){
//     this.draw_dot( x, y, color);
// }
//     }
// }
