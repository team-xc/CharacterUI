import { BaseView } from './BaseView'

export class TextView extends BaseView {
  private readonly textViewProps: TextViewProps
  private view: BaseView
  private lastView: BaseView

  constructor(props: TextViewProps) {
    super({width: 0, height: 0})
    this.textViewProps = props
    this.setText(props.text)
  }

  private createView(textLines: string[]) {
    const {border = true} = this.textViewProps || {}
    return new BaseView({
        width: textLines.reduce((max, line) => Math.max(max, line.length), 0),
        height: textLines.length,
        border
      }
    )
  }

  private update(textLines: string[]): boolean {
    if (!this.view) {
      this.view = this.createView(textLines)
      return true
    }
    this.lastView = Object.assign(Object.create(Object.getPrototypeOf(this.view)), this.view)
    const view = this.createView(textLines)
    this.view.getContainer = () => view.getContainer()
    this.view.getInstance = () => view.getInstance()
    this.view.getViewId = () => view.getViewId()
    this.view = view
    return false
  }

  public setText(text: string) {
    const {horizontalPadding = 0, color = 0} = this.textViewProps || {}
    const textLines = text.split('\n').map(line => ' '.repeat(horizontalPadding) + line + ' '.repeat(horizontalPadding))
    const isInit = this.update(textLines)
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i]
      for (let j = 0; j < line.length; j++) {
        this.view.setInner(j, i, `\x1b[${color}m${line[j]}\x1b[0m`)
      }
    }
    !isInit && this.lastView.trigger('re-render', this.lastView)
  }

  public setColor(color: number) {
    this.textViewProps.color = color
  }

  public getContainer(): Container {
    if (!this.view) return []
    return this.view.getContainer()
  }

  public getViewId(): string {
    if (!this.view) return ''
    return this.view.getViewId()
  }

  public getInstance(): BaseView {
    if (!this.view) return null
    return this.view.getInstance()
  }
}