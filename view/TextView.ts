import { ResizeView } from './ResizeView'

export class TextView extends ResizeView {
  private readonly textViewProps: TextViewProps

  constructor(props: TextViewProps) {
    super({border: props?.border || false})
    this.textViewProps = props
    this.setText(props?.text || '')
  }

  public setTextWithInterval(textFunction: () => string, interval: number, firstRender = true) {
    if (firstRender) {
      this.setText(textFunction())
    }
    setInterval(() => {
      this.setText(textFunction())
    }, interval)
  }

  public setText(text: string) {
    const {horizontalPadding = 0, color = 0} = this.textViewProps || {}
    const textLines = text.split('\n').map(line => ' '.repeat(horizontalPadding) + line + ' '.repeat(horizontalPadding))

    const view = this.updateView({
      width: textLines.reduce((max, line) => Math.max(max, line.length), 0),
      height: textLines.length
    })

    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i]
      for (let j = 0; j < line.length; j++) {
        view.setInner(j, i, `\x1b[${color}m${line[j]}\x1b[0m`)
      }
    }

    this.rerender()
  }

  public setColor(color: number) {
    this.textViewProps.color = color
  }
}