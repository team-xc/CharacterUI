import { TextView } from '../../view/TextView'
import { BaseView } from '../../view/BaseView'

const readline = require('readline')

const Home = (container: BaseView) => {
  const tv1 = new TextView({text: new Date().toLocaleTimeString(), border: false, horizontalPadding: 1, color: 32})
  setInterval(() => {tv1.setText(new Date().toLocaleTimeString())}, 1000)
  container.add(tv1, 36, 0)

  const tv2 = new TextView({text: '', border: true, horizontalPadding: 1})
  container.add(tv2, 1, 0)

  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)

  let content = ''
  process.stdin.on('keypress', (_, key) => {
    switch (key.name) {
      case 'backspace':
        content = content.slice(0, -1)
        break
      case 'return':
        content += '\n'
        break
      default:
        content += key.sequence
    }
    tv2.setText(content)
  })
}

export default Home