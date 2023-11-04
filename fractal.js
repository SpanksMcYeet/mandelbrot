import Canvas from './toolbox/canvas.js'

const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)

import * as util from './toolbox/util.js'

const Fractal = class {
  static gradient = [{
    position: 0.0, 
    color: { r: 66, g: 30, b: 15 } // brown 3
  }, {
    position: 0.1, 
    color: { r: 25, g: 7, b: 26 } // dark violett
  }, {
    position: 0.2, 
    color: { r: 9, g: 1, b: 47 } // darkest blue
  }, {
    position: 0.3, 
    color: { r: 4, g: 4, b: 73 } // blue 5
  }, {
    position: 0.4, 
    color: { r: 0, g: 7, b: 100 } // blue 4
  }, {
    position: 0.5, 
    color: { r: 12, g: 44, b: 138 } // blue 3
  }, {
    position: 0.6, 
    color: { r: 24, g: 82, b: 177 } // blue 2
  }, {
    position: 0.7, 
    color: { r: 57, g: 125, b: 209 }// blue 1
  }, {
    position: 0.75,
    color: { r: 134, g: 181, b: 229 } // blue 0
  }, {
    position: 0.8, 
    color: { r: 211, g: 236, b: 248 } // lightest blue
  }, {
    position: 0.85, 
    color: { r: 241, g: 233, b: 191 } // lightest yellow
  }, {
    position: 0.9, 
    color: { r: 248, g: 201, b: 95 } // light yellow
  }, {
    position: 0.92, 
    color: { r: 255, g: 170, b: 0 } // dirty yellow
  }, {
    position: 0.94, 
    color: { r: 204, g: 128, b: 0 } // brown 0
  }, {
    position: 0.96, 
    color: { r: 153, g: 87, b: 0 } // brown 1
  }, {
    position: 0.98, 
    color: { r: 106, g: 52, b: 3 } // brown 2
  }, {
    position: 1.0, 
    color: { r: 0, g: 0, b: 0 } // Black
  }]
  constructor(maxIterations) {
    this.maxIterations = maxIterations
  }
  /* https://en.wikipedia.org/wiki/Mandelbrot_set */
  mandelbrot(x, y) {
    let z = { x: 0, y: 0 }
    let zx = z.x
    let zy = z.y
    let iterations = 0
    for (let i = 0; i < this.maxIterations; i++) {
      iterations = i
      z.x = zx * zx - zy * zy + x
      z.y = 2 * zx * zy + y
      zx = z.x
      zy = z.y
      if (z.x * z.x + z.y * z.y > 4) break 
    }
    return {
      zx,
      zy,
      iterations,
      diverged: z.x * z.x + z.y * z.y < 4,
    }
  }
  interpolateColor(color1, color2, factor) {
    return {
      r: color1.r + (color2.r - color1.r) * factor,
      g: color1.g + (color2.g - color1.g) * factor,
      b: color1.b + (color2.b - color1.b) * factor
    }
  }
  colorFromGradient(position) {
    for (let i = 0; i < Fractal.gradient.length - 1; i++) {
      if (position >= Fractal.gradient[i].position && position <= Fractal.gradient[i + 1].position) {
        let localFactor = (position - Fractal.gradient[i].position) / (Fractal.gradient[i + 1].position - Fractal.gradient[i].position)
        return this.interpolateColor(Fractal.gradient[i].color, Fractal.gradient[i + 1].color, localFactor)
      }
    }
    return { r: 0, g: 0, b: 0 }
  }
  colorize(iteration, real, imaginary) {
    let gradientScale = 256
    let colorsLength = 2048

    let smoothed = Math.log2(Math.log2(real * real + imaginary * imaginary) / 2)
    let color = (Math.sqrt(iteration + 10 - smoothed) * gradientScale) % colorsLength

    return this.colorFromGradient(color / colorsLength)
  }
  compute({
    width = 100,
    height = 100,
    centerX = 0,
    centerY = 0,
    zoom = 1,
  } = {}) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let ix = centerX + (2 * x / width - 1.5) / zoom
        let iy = centerY + (2 * y / height - 1) / zoom
        let { zx, zy, iterations, diverged } = this.mandelbrot(ix, iy)
        c.box({
          x, y,
          width: 1,
          height: 1,
          fill: `#${util.rgbToHex(...Object.values(this.colorize(iterations, zx, zy)))}`
        })
      }
    }
  }
}

export default Fractal
