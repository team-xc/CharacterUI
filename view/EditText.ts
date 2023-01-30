import { TextView } from './TextView'

const readline = require('readline')

export class EditText extends TextView {
  private readonly editTextProps: EditTextProps
  #text = ''

  constructor(props: EditTextProps) {
    super(props)
    this.editTextProps = props
    this.text = props.text || ''

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

  public setText(text: string) {
    if (text === '') {
      this.setColor(37)
      super.setText(this.editTextProps?.hint || '')
    } else {
      this.setColor(0)
      super.setText(text)
    }
  }

  get text(): string {
    return this.#text
  }

  set text(text: string) {
    this.#text = text
  }
}