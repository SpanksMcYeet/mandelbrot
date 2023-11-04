import Canvas from './toolbox/canvas.js'
import * as util from './toolbox/util.js'

import Page from './page.js'

const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)


Page.refreshCanvas()
Page.display()

let time = 0
let appLoop = async (newTime) => {
  // Not used but might be used later on for a debug mode if I feel motivated enough to do that
  let timeElapsed = newTime - time
  time = newTime
  
  requestAnimationFrame(appLoop)
}
