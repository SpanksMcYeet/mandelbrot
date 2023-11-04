import Canvas from './toolbox/canvas.js'

const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)

import * as util from './toolbox/util.js'
import { mouse } from './toolbox/event.js'
import Fractal from './fractal.js'

const fractal = new Fractal(100)

// Similar to the canvas.js, but instead used to shove any methods that will be used more
// than once and/or are utilized throughout multiple files
const Page = {
  get width() {
    return window.innerWidth
  },
  get height() {
    return window.innerHeight
  },
  get centerX() {
    return Page.width * 0.5
  },
  get centerY() {
    return Page.height * 0.5
  },
  button({ x = 0, y = 0, width = 0, height = 0, fill = null, stroke = null, lineWidth = 1, clickable = false, hover = false, text = null, textSize = 1 }) {
    let draw = (fill1, fill2) => {
      c.box({ x, y, width, height, fill: fill1, lineWidth })
      c.box({ x, y: y + (height * 0.3), width, height: height * 0.4, fill: fill2, lineWidth })
      c.box({ x, y, width, height, stroke, lineWidth })
      if (text != null)
        c.text({ x: x, y: y + width * 0.1 * 0.25, size: Math.abs(width - height) * 0.075 * textSize, text: text, lineWidth: 8 })
    }
    
    let dfill = util.mixColors(fill, util.colors.black, 0.15)
    if (util.bounds({ x, y, width, height, mousePosition: mouse, }) && (clickable || hover)) {
      if (hover)
        draw(util.mixColors(fill, util.colors.white, 0.15), util.mixColors(dfill, util.colors.white, 0.15))
      if (mouse.left && clickable)
        clickable()
    } else {
      draw(fill, dfill)
    }
  },
  display() {
    fractal.compute({
      width: Page.height,
      height: Page.height,
      centerX: -0.7,
      centerY: 0.3,
      zoom: 38
    })
  },
  refreshCanvas() {
    c.setSize({ width: window.innerWidth, height: window.innerHeight, ratio: window.devicePixelRatio })

    mouse.left = false
    mouse.right = false
  },
}
// Honestly idk why I even did this
export default Page
