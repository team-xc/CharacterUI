import CONFIG from './config'

const readline = require('readline')

export const renderForConsole = (draw: () => string) => {
  let lastDraw = ''
  setInterval(() => {
    const currentDraw = draw()
    if (lastDraw !== currentDraw) {
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0, 0)
      process.stdout.write('\x1b[?25l')
      process.stdout.write('\n' + currentDraw)
      lastDraw = currentDraw
    }
  }, 1000 / CONFIG.RENDER_FPS)
}