declare type ViewProps = {
  width: number,
  height: number,
  border?: boolean
}

declare type TextViewProps = {
  text: string,
  border?: boolean,
  horizontalPadding?: number,
  color?: number
}

declare type Container = string[][]

declare type ViewId = string