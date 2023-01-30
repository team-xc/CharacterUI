import CONFIG from '../core/config'

const readline = require('readline')

const {MATERIAL, SIZE} = CONFIG

export class BaseView {
  private readonly baseViewProps: ViewProps
  private container: Container
  private readonly viewId: ViewId
  private children = new Map<ViewId, { self: BaseView, x: number, y: number }>()

  constructor(props: ViewProps) {
    const {width, height, border = true} = props
    this.baseViewProps = {width, height, border}
    this.viewId = `view-id:${Date.now() + Math.random()}`
    this.generateContainer()
  }

  private generateContainer() {
    const {width, height, border} = this.baseViewProps
    const container = this.generate(width, height, MATERIAL.BLANK)

    this.expandAll(container, SIZE.CONTAINER_SPACE, MATERIAL.SPACE)

    if (border) {
      this.expandAll(container, SIZE.BORDER_SIZE, {x: MATERIAL.VERTICAL, y: MATERIAL.HORIZONTAL})
      this.setCorner(container, SIZE.BORDER_SIZE, {
        topLeft: MATERIAL.TOP_LEFT,
        topRight: MATERIAL.TOP_RIGHT,
        bottomLeft: MATERIAL.BOTTOM_LEFT,
        bottomRight: MATERIAL.BOTTOM_RIGHT
      })
      this.borderCorrect(container, SIZE.BORDER_SIZE, MATERIAL.HORIZONTAL)
    }

    this.setContainer(container)
  }

  private addEventListener(view: BaseView) {
    view.trigger = new Proxy(view.trigger, {
      apply: (_, __, args) => {
        const [event, params] = args
        switch (event) {
          case 'remove-self':
            this.remove(view.getInstance())
            break
          case 're-render':
            const position = this.children.get(params.getViewId())
            if (!position) return
            this.remove(params)
            this.add(view.getInstance(), position.x, position.y)
        }
      }
    })
  }

  private removeEventListener(view: BaseView) {
    view.trigger = new Proxy(view.trigger, {
      apply: () => {
      }
    })
  }

  public getContainer() {
    return this.container
  }

  public setContainer(container: Container) {
    this.container = container
  }

  public getContainerSize(container: Container) {
    if (!container.length) return {width: 0, height: 0}
    return {
      width: container[0].length,
      height: container.length
    }
  }

  public getViewId() {
    return this.viewId
  }

  public isOutOfBound(container: Container, x: number, y: number) {
    const {width, height} = this.getContainerSize(container)
    return x < 0 || x >= width || y < 0 || y >= height
  }

  public isOutOfContent(x: number, y: number) {
    const {border} = this.baseViewProps
    const {width, height} = this.getContainerSize(this.getContainer())
    const offset = border ? SIZE.CONTAINER_SPACE + SIZE.BORDER_SIZE : SIZE.CONTAINER_SPACE
    return x < offset || x >= width - offset || y < offset || y >= height - offset
  }

  public fill(container: Container, x: number, y: number, width: number, height: number, char: string) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.set(container, x + j, y + i, char)
      }
    }
  }

  public expand(container: Container, size: number, direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom', char: string) {
    const {width, height} = this.getContainerSize(container)
    const newContainer = this.generate(width + (direction === 'left' || direction === 'right' ? size : 0), height + (direction === 'top' || direction === 'bottom' ? size : 0), char)
    this.fill(newContainer, direction === 'left' ? size : 0, direction === 'top' ? size : 0, width, height, MATERIAL.BLANK)
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.set(newContainer, direction === 'left' ? size + j : j, direction === 'top' ? size + i : i, this.get(container, j, i))
      }
    }
    container.length = 0
    container.push(...newContainer)
  }

  public expandAll(container: Container, size: number, char: string | { top: string, bottom: string, left: string, right: string } | { x: string, y: string }) {
    if (typeof char === 'string') {
      this.expand(container, size, 'top', char)
      this.expand(container, size, 'bottom', char)
      this.expand(container, size, 'left', char)
      this.expand(container, size, 'right', char)
    }
    if (typeof char === 'object') {
      if ('x' in char && 'y' in char) {
        const {x, y} = char
        this.expand(container, size, 'top', y)
        this.expand(container, size, 'bottom', y)
        this.expand(container, size, 'left', x)
        this.expand(container, size, 'right', x)
      }
      if ('top' in char && 'bottom' in char && 'left' in char && 'right' in char) {
        const {top, bottom, left, right} = char
        this.expand(container, size, 'top', top)
        this.expand(container, size, 'bottom', bottom)
        this.expand(container, size, 'left', left)
        this.expand(container, size, 'right', right)
      }
    }
  }

  public borderCorrect(container: Container, size: number, char: string) {
    if (size < 1) return
    const {width, height} = this.getContainerSize(container)
    for (let i = 1; i < size; i++) {
      for (let j = 0; j < i; j++) {
        this.set(container, i, j, char)
        this.set(container, i, height - 1 - j, char)
        this.set(container, width - 1 - i, j, char)
        this.set(container, width - 1 - i, height - 1 - j, char)
      }
    }
  }

  public setCorner(container: Container, size: number, char: { topLeft?: string, topRight?: string, bottomLeft?: string, bottomRight?: string }) {
    if (size === 0) return
    const {width, height} = this.getContainerSize(container)
    for (let i = 0; i < size; i++) {
      if (char.topLeft) this.set(container, i, i, char.topLeft)
      if (char.topRight) this.set(container, width - 1 - i, i, char.topRight)
      if (char.bottomLeft) this.set(container, i, height - 1 - i, char.bottomLeft)
      if (char.bottomRight) this.set(container, width - 1 - i, height - 1 - i, char.bottomRight)
    }
  }

  public generate(width: number, height: number, fill: string) {
    return new Array(height).fill('').map(() => new Array(width).fill(fill))
  }

  public set(container: Container, x: number, y: number, char: string) {
    if (this.isOutOfBound(container, x, y)) return
    container[y][x] = char
  }

  public setInner(x: number, y: number, char: string) {
    const {border} = this.baseViewProps
    const offset = border ? SIZE.CONTAINER_SPACE + SIZE.BORDER_SIZE : SIZE.CONTAINER_SPACE
    const actualX = x + offset
    const actualY = y + offset
    if (this.isOutOfContent(actualX, actualY)) return
    this.set(this.getContainer(), actualX, actualY, char)
  }

  public get(container: Container, x: number, y: number) {
    if (this.isOutOfBound(container, x, y)) return
    return container[y][x]
  }

  public add(child: BaseView, x: number, y: number) {
    if (!child) return
    const childContainer = child.getContainer()
    const {width, height} = this.getContainerSize(childContainer)
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.setInner(x + j, y + i, this.get(childContainer, j, i))
      }
    }
    if (this.children.has(child.getViewId())) return
    this.children.set(child.getViewId(), {self: child.getInstance(), x, y})
    this.addEventListener(child.getInstance())
  }

  public remove(child: BaseView) {
    if (!child) return
    const childContainer = child.getContainer()
    const position = this.children.get(child.getViewId())
    if (!position) return
    const childX = position.x
    const childY = position.y
    const {width, height} = this.getContainerSize(childContainer)
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        this.setInner(childX + j, childY + i, MATERIAL.BLANK)
      }
    }
    this.children.delete(child.getViewId())
    this.removeEventListener(child.getInstance())
  }

  public trigger = (event: string, params?: any) => {}

  public getInstance(): BaseView {
    return this
  }

  public draw() {
    return this.getContainer().map(row => row.join('')).join(CONFIG.MATERIAL.NEW_LINE)
  }

  public render() {
    CONFIG.RENDER_METHOD(this.draw.bind(this))
  }

  public loadView(view: (container: BaseView) => void) {
    view(this)
  }
}