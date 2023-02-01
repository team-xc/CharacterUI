import { TextView } from './TextView'

const readline = require('readline')

export class EditText extends TextView {
  private readonly editTextProps: EditTextProps
  #text = ''

  constructor(props: EditTextProps) {
    super(props)
    this.editTextProps = props
    this.text = props?.text || ''

    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)

    process.stdin.on('keypress', (_, key) => {
      switch (key.name) {
        case 'backspace':
          this.text = this.text.slice(0, -1)
          break
        case 'return':
          this.text += '\n'
          break
        default:
          this.text += key.sequence
      }
      this.setText(this.text)
    })

    this.setText(this.text)
  }

  private blinkBorder = () => {
    this.setBorderStyle(this.getContainer(), '\x1b[31m')
  }

  public setText(text: string) {
    const cursor = '_'
    if (text === '') {
      this.setStyle('\x1b[31;2m')
      super.setText(this.editTextProps?.hint || '', this.blinkBorder)
    } else {
      this.setStyle('\x1b[0m')
      super.setText(text + cursor, this.blinkBorder)
    }
  }

  get text(): string {
    return this.#text
  }

  set text(text: string) {
    this.#text = text
  }
}