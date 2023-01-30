import { BaseView } from './BaseView'

export class ResizeView extends BaseView {
  private readonly resizeViewProps: ResizeViewProps
  private currentView: BaseView
  private lastView: BaseView

  #width: number
  #height: number

  constructor(props?: ResizeViewProps) {
    super({width: 0, height: 0, border: props?.border || false})
    this.resizeViewProps = props
    this.width = props?.width || 0
    this.height = props?.height || 0

    this.updateView()
  }

  get width(): number {
    return this.#width
  }

  set width(value: number) {
    this.#width = value
  }

  get height(): number {
    return this.#height
  }

  set height(value: number) {
    this.#height = value
  }

  private refreshView(): BaseView {
    const {border = true} = this.resizeViewProps || {}
    return new BaseView({
        width: this.width,
        height: this.height,
        border
      }
    )
  }

  public updateView(size: { width?: number, height?: number } = {}): BaseView {
    const {width, height} = size
    if (width) this.width = width
    if (height) this.height = height

    if (!this.currentView) {
      this.currentView = this.refreshView()
    } else {
      this.lastView = Object.assign(Object.create(Object.getPrototypeOf(this.currentView)), this.currentView)
      const newView = this.refreshView()
      this.currentView.getContainer = () => newView.getContainer()
      this.currentView.getInstance = () => newView.getInstance()
      this.currentView.getViewId = () => newView.getViewId()
      this.currentView = newView
    }

    return this.currentView
  }

  public rerender() {
    if (!this.lastView) return
    this.lastView.trigger('re-render', this.lastView)
  }

  public getContainer(): Container {
    if (!this.currentView) return []
    return this.currentView.getContainer()
  }

  public getViewId(): string {
    if (!this.currentView) return ''
    return this.currentView.getViewId()
  }

  public getInstance(): BaseView {
    if (!this.currentView) return null
    return this.currentView.getInstance()
  }
}